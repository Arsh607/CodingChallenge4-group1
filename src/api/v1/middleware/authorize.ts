import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

interface AuthorizeOptions {
    hasRole: string[];
}

const isAuthorized =
    ({ hasRole }: AuthorizeOptions) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const userRole = res.locals.role;

        if (!userRole) {
            res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                error: {
                    message: "Forbidden: No role found",
                    code: "ROLE_NOT_FOUND",
                },
                timestamp: new Date().toISOString(),
            });
            return;
        }

        if (!hasRole.includes(userRole)) {
            res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                error: {
                    message: "Forbidden: Insufficient role",
                    code: "INSUFFICIENT_ROLE",
                },
                timestamp: new Date().toISOString(),
            });
            return;
        }

        next();
    };

export default isAuthorized;