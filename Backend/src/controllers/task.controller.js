import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

import { Task } from "../models/task.model.js"

const getUserTasks = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const tasks = await Task.find({ assignedTo: userId })
        .select("-assignedTo");

    if (!tasks || tasks.length === 0) {
        throw new ApiError(404, "No tasks found for this user");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, tasks, "All user tasks fetched successfully")
        );

})

const getTeamTasks = asyncHandler(async (req, res, next) => {
    const { teamId } = req.params;

    const tasks = await Task.find({ team: teamId });

    if (!tasks || tasks.length === 0) {
        throw new ApiError(404, "No tasks found for this team");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tasks, "Team tasks retrieved successfully"));
})

const createTask = asyncHandler(async (req, res, next) => {
    const { teamId } = req.params;
    const assignedBy = req.user._id;

    const {
        title,
        description,
        status = "pending",
        priority = "medium",
        dueDate,
        assignedTo = [],
        attachments = [],
        todoChecklist = [],
        repeatDuration = "no-repeat"
    } = req.body;

    if (!title || !description || !dueDate) {
        throw new ApiError(400, "Title, description, and due date are required");
    }

    const newTask = await Task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        assignedTo,
        assignedBy,
        attachments,
        todoChecklist,
        repeatDuration,
        team: teamId,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(201, newTask, "Task created successfully")
        );
})

const updateTaskDetails = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description } = req.body;

    if (!title && !description) {
        throw new ApiError(400, "At least one of title or description must be provided");
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            $set: updateFields
        },
        {
            new: true
        }
    ).select("title description");

    if (!updatedTask) {
        throw new ApiError(404, "Task not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedTask, "Task details updated successfully")
        );
});


export {
    getUserTasks,
    getTeamTasks,
    createTask,
    updateTaskDetails,
};