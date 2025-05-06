import { Router } from "express";

import { 
    getUserTasks,
    getTeamTasks,
    createTask,
    updateTaskDetails,
} from "../controllers/task.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkTeamAccess } from "../middlewares/teamRole.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/get-tasks").get(getUserTasks);
router.route("/:teamId/getTeamTasks").get(checkTeamAccess({minRole: "member"}), getTeamTasks);
router.route("/:teamId/createTask").post(checkTeamAccess({minRole: "manager"}), createTask);
router.route("/:taskId/updateTaskDetails").post(checkTeamAccess({minRole: "manager"}), updateTaskDetails);
export default router;
