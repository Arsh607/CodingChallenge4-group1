import { Request, Response, NextFunction } from "express";
import { auth } from "../../../config/firebaseConfig";
import { HTTP_STATUS } from "../../../constants/httpConstants";

const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: {
                    message: "Unauthorized: No token provided",
                    code: "TOKEN_NOT_FOUND",
                },
                timestamp: new Date().toISOString(),
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: {
                    message: "Unauthorized: No token provided",
                    code: "TOKEN_NOT_FOUND",
                },
                timestamp: new Date().toISOString(),
            });
            return;
        }

        const decodedToken = await auth.verifyIdToken(token);

        res.locals.uid = decodedToken.uid;
        res.locals.role = decodedToken.role;

        next();
    } catch (error) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: {
                message: "Unauthorized: Invalid token",
                code: "TOKEN_INVALID",
            },
            timestamp: new Date().toISOString(),
        });
    }
};

export default authenticate;