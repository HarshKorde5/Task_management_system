import { Team } from "../models/Team.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const ROLE_LEVEL = {
  member: 1,
  manager: 2,
  admin: 3,
  owner: 4
};

export const checkTeamAccess = ({ minRole = "member", exactRole = null } = {}) => asyncHandler(async (req, _, next) => {
  const { teamId } = req.params;
  const userId = req.user._id;

  const team = await Team.findById(teamId);

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
