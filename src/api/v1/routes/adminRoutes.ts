import { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { setCustomClaims } from "../controllers/adminController";
const router = Router();
router.post(
    "/admin/setCustomClaims",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    setCustomClaims
);
export default router;