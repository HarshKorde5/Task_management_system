import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"


import { Team } from "../models/team.model.js"

const getAllTeams = asyncHandler(async (req, res) => {

    const teams = await Team.find({ members: req.user?._id })

    if (teams.length === 0) {
        throw new ApiError(404, "No user teams found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, teams, "All user teams fetched successfully"))

})


const createTeam = asyncHandler(async (req, res) => {
    try {
        const { title, description, members = [] } = req.body;

        if (
            [title, description, members].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required")
        }
        const existedTeam = await Team.findOne({ title });

        if (existedTeam) {
            throw new ApiError(409, `Team ${title} already exists`);
        }

        const ownerId = req.user._id;

        const uniqueMembers = Array.from(new Set([...members, ownerId.toString()]));

        const newTeam = await Team.create({
            title,
            description,
            owner: ownerId,
            members: uniqueMembers,
            roles: [{ userId: ownerId, role: "admin" }],
        });

        if (!newTeam) {
            throw new ApiError(500, "Something went wrong while creating the team")
        }


        // await ActivityLog.create({
        // userId: ownerId,
        // userName: req.user.fullName,
        // action: "Team Created",
        // targetType: "Team",
        // targetId: savedTeam._id,
        // details: { teamTitle: title, teamDescription: description },
        // });

        return res
            .status(201)
            .json(
                new ApiResponse(200, newTeam, "Team created successfully")
            );

    } catch (error) {

        throw new ApiError(500, error?.message || "Failed to create team")
    }
})

const updateTeam = asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const { title, description, status } = req.body;

    if (!title && !description && !status) {
        throw new ApiError(400, "At least one field (title, description, or status) must be provided");
    }


    const validStatuses = ["active", "inactive"];
    if (status && !validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status value");
    }

    const updatedTeam = await Team.findByIdAndUpdate(
        teamId,
        {
            $set: {
                ...(title && { title }),
                ...(description && { description }),
                ...(status && { status })
            }
        },
        { new: true }
    ).select("-members -owner -roles");

    if (!updatedTeam) {
        throw new ApiError(404, "Team not found");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedTeam, "Team updated successfully")
        )
})

const deleteTeam = asyncHandler(async (req, res) => {
    const { teamId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
        throw new ApiError(404, "Team not found");
    }

    // clean up related data like tasks, notifications, etc.

    await Team.findByIdAndDelete(teamId);

    res
        .status(200)
        .json(
            new ApiResponse(200, "Team deleted successfully")
        );
})


const getTeamMembers = asyncHandler(async (req, res) => {
    const { teamId } = req.params;

    const team = await Team.findById(teamId)
        .populate("members", "fullName email avatar")
        .populate("roles.userId", "fullName email avatar");

    if (!team) {
        throw new ApiError(404, "Team not found");
    }

    const members = team.members.map(member => {
        const roleEntry = team.roles.find(role => role.userId._id.equals(member._id));
        return {
            _id: member._id,
            fullName: member.fullName,
            email: member.email,
            avatar: member.avatar,
            role: roleEntry?.role || "member"
        };
    });

    res
        .status(200)
        .json(
            new ApiResponse(200, members, "Team members fetched successfully")
        );
});

const addTeamMembers = asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const { memberIds } = req.body;

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
        throw new ApiError(400, "memberIds must be a non-empty array");
    }

    const updatedTeam = await Team.findByIdAndUpdate(
        teamId,
        {
            $addToSet: { members: { $each: memberIds } },
        },
        { new: true }
    ).populate("members", "fullName email avatar");

    res.
        status(200).
        json(
            new ApiResponse(200, updatedTeam.members, "Members added successfully to the team",)
        );
});

const removeTeamMembers = asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const { memberIds } = req.body;

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
        throw new ApiError(400, "memberIds must be a non-empty array")
    }

    const team = await Team.findById(teamId).select("owner members roles");

    if (!team) {
        throw new ApiError(404, "Team not found")
    }

    const isOwnerIncluded = memberIds.some(id => id.toString() === team.owner.toString());
    if (isOwnerIncluded) {
        throw new ApiError(403, "Cannot remove the team owner");
    }

    const updatedTeam = await Team.findByIdAndUpdate(
        teamId,
        {
            $pull: { members: { $in: memberIds } },
            $pullAll: {
                roles: memberIds.map(userId => ({ userId }))
            }
        },
        { new: true }
    ).populate("members", "fullName email avatar");

    res
        .status(200)
        .json(
            new ApiResponse(200, updatedTeam.members, "Members removed successfully")
        );
});

const setTeamStatus = asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    if (!["active", "inactive"].includes(status)) {
        throw new ApiError(400, "Invalid status value")
    }

    const team = await Team.findById(teamId).select("owner status");

    if (!team) {
        throw new ApiError(404, "Team not found")
    }

    if (team.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "Only the team owner can change the team status")
    }

    const updatedTeam = await Team.findByIdAndUpdate(
        teamId,
        {
            $set: {
                status
            }
        },
        {
            new: true
        }
    );

    if (!updatedTeam) {
        throw new ApiError(404, "Team not found");
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, updatedTeam, `Team status updated to ${status}`)
        );
})


export {
    getAllTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamMembers,
    addTeamMembers,
    removeTeamMembers,
    setTeamStatus,
}