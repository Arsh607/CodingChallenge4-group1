import { Request, Response, NextFunction } from "express";
import isAuthorized from "../src/api/v1/middleware/authorize";
describe("authorize middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {},
        };
        next = jest.fn();
        jest.clearAllMocks();
    });
    it("should return 403 with ROLE_NOT_FOUND when user has no role", () => {
        // Arrange
        const middleware = isAuthorized({ hasRole: ["admin"] });
        res.locals = {};
        // Act
        middleware(req as Request, res as Response, next);
        // Assert
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: {
                    message: "Forbidden: No role found",
                    code: "ROLE_NOT_FOUND",
                },
            })
        );
        expect(next).not.toHaveBeenCalled();
    });
    it("should return 403 with INSUFFICIENT_ROLE when role not in allowed list", () => {
        // Arrange
        const middleware = isAuthorized({ hasRole: ["admin"] });
        res.locals = { role: "developer" };
        // Act
        middleware(req as Request, res as Response, next);
        // Assert
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: {
                    message: "Forbidden: Insufficient role",
                    code: "INSUFFICIENT_ROLE",
                },
            })
        );
        expect(next).not.toHaveBeenCalled();
    });
    it("should call next() when user role is in allowed list", () => {
        // Arrange
        const middleware = isAuthorized({ hasRole: ["admin"] });
        res.locals = { role: "admin" };
        // Act
        middleware(req as Request, res as Response, next);
        // Assert
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
    it("should work with multiple allowed roles", () => {
        // Arrange
        const middleware = isAuthorized({ hasRole: ["admin", "lead"] });
        res.locals = { role: "lead" };
        // Act
        middleware(req as Request, res as Response, next);
        // Assert
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});