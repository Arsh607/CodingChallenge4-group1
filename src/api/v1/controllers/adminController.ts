import { Request, Response } from "express";
import { auth } from "../../../config/firebaseConfig";
import { HTTP_STATUS } from "../../../constants/httpConstants";
export const setCustomClaims = async (req: Request, res: Response): Promise<void> => {
    try {
        const { uid, role } = req.body;
        if (!uid || !role) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "uid and role are required",
            });
            return;
        }
        await auth.setCustomUserClaims(uid, { role });
        res.status(HTTP_STATUS.OK).json({
            message: "Custom claims set successfully",
            data: {
                uid,
                role,
            },
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to set custom claims",
        });
    }
};