import { Router } from "express";

import {
    getAllTeams,
    createTeam,
    updateTeam,   
    deleteTeam,
    getTeamMembers,
    addTeamMembers,
    removeTeamMembers,
    setTeamStatus,
} from "../controllers/team.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkTeamAccess } from "../middlewares/teamRole.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/teams/createTeam").post(createTeam);
router.route("/teams/getAllTeams").get(getAllTeams);
router.route("/teams/:teamId/updateTeam").put(checkTeamAccess({minRole: "admin"}), updateTeam);
router.route("/teams/:teamId/deleteTeam").delete(checkTeamAccess({exactRole: "owner"}), deleteTeam);
router.route("/teams/:teamId/getMembers").get(checkTeamAccess({minRole: "member"}),getTeamMembers);
router.route("/teams/:teamId/addMembers").patch(checkTeamAccess({minRole: "admin"}),addTeamMembers);
router.route("/teams/:teamId/removeMembers").patch(checkTeamAccess({minRole: "admin"}),removeTeamMembers);
router.route("/teams/:teamId/setTeamStatus").patch(checkTeamAccess({exactRole: "owner"}), setTeamStatus);