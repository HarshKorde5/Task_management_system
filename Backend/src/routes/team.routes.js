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

router.route("/createTeam").post(createTeam);
router.route("/getAllTeams").get(getAllTeams);
router.route("/:teamId/updateTeam").put(checkTeamAccess({minRole: "admin"}), updateTeam);
router.route("/:teamId/deleteTeam").delete(checkTeamAccess({exactRole: "owner"}), deleteTeam);
router.route("/:teamId/getMembers").get(checkTeamAccess({minRole: "member"}),getTeamMembers);
router.route("/:teamId/addMembers").patch(checkTeamAccess({minRole: "admin"}),addTeamMembers);
router.route("/:teamId/removeMembers").patch(checkTeamAccess({minRole: "admin"}),removeTeamMembers);
router.route("/:teamId/setTeamStatus").patch(checkTeamAccess({exactRole: "owner"}), setTeamStatus);