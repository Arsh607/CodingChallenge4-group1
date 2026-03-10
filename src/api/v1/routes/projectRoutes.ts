import { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import {
    getHealth,
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} from "../controllers/projectController";
const router = Router();
router.get("/health", getHealth);
router.get(
    "/projects",
    authenticate,
    isAuthorized({ hasRole: ["admin", "lead", "developer"] }),
    getAllProjects
);
router.get(
    "/projects/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "lead", "developer"] }),
    getProjectById
);
router.post(
    "/projects",
    authenticate,
    isAuthorized({ hasRole: ["admin", "lead"] }),
    createProject
);
router.put(
    "/projects/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "lead"] }),
    updateProject
);
router.delete(
    "/projects/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    deleteProject
);
export default router;