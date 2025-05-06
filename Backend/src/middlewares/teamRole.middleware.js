import { Team } from "../models/Team.js";
import { Task } from "../models/task.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const ROLE_LEVEL = {
  member: 1,
  manager: 2,
  admin: 3,
  owner: 4
};

export const checkTeamAccess = ({ minRole = "member", exactRole = null } = {}) => asyncHandler(async (req, _, next) => {
  const { teamId, taskId } = req.params;
  const userId = req.user._id;
  let team;

  if (taskId) {
    const task = await Task.findById(taskId).select("team");

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    team = await Team.findById(task.team).select("owner roles members");
  } else if (teamId) {
    team = await Team.findById(teamId).select("owner roles members");
  }

  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  let userRole = null;

  if (team.owner.toString() === userId.toString()) {
    userRole = "owner";
  } else {
    const foundRole = team.roles.find(role =>
      role.userId.toString() === userId.toString()
    );
    userRole = foundRole?.role || (team.members.some(member => member.toString() === userId.toString()) ? "member" : null);
  }

  if (!userRole) {
    throw new ApiError(403, "Access denied: Not a team member");
  }

  if (exactRole) {
    if (userRole !== exactRole) {
      throw new ApiError(403, `Access denied: Only ${exactRole} allowed`);
    }
  } else {
    if (ROLE_LEVEL[userRole] < ROLE_LEVEL[minRole]) {
      throw new ApiError(403, `Access denied: Minimum ${minRole} role required`);
    }
  }

  req.team = team;
  req.teamRole = userRole;
  next();
});
