import { Request, Response, NextFunction } from "express";
import authenticate from "../src/api/v1/middleware/authenticate";
import { auth } from "../src/config/firebaseConfig";
jest.mock("../src/config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
    },
}));
describe("authenticate middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {},
        };
        next = jest.fn();
        jest.clearAllMocks();
    });
    it("should return 401 with TOKEN_NOT_FOUND when no Authorization header", async () => {
        // Arrange
        req.headers = {};
        // Act
        await authenticate(req as Request, res as Response, next);
        // Assert
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: {
                    message: "Unauthorized: No token provided",
                    code: "TOKEN_NOT_FOUND",
                },
            })
        );
        expect(next).not.toHaveBeenCalled();
    });
    it("should return 401 with TOKEN_INVALID when token verification fails", async () => {
        // Arrange
        req.headers = {
            authorization: "Bearer invalid-token",
        };
        (auth.verifyIdToken as jest.Mock).mockRejectedValue(new Error("Invalid token"));
        // Act
        await authenticate(req as Request, res as Response, next);
        // Assert
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: {
                    message: "Unauthorized: Invalid token",
                    code: "TOKEN_INVALID",
                },
            })
        );
        expect(next).not.toHaveBeenCalled();
    });
    it("should store uid in res.locals when token is valid", async () => {
        // Arrange
        req.headers = {
            authorization: "Bearer valid-token",
        };
        (auth.verifyIdToken as jest.Mock).mockResolvedValue({
            uid: "user-123",
            role: "admin",
        });
        // Act
        await authenticate(req as Request, res as Response, next);
        // Assert
        expect(res.locals?.uid).toBe("user-123");
        expect(next).toHaveBeenCalled();
    });
    it("should store role in res.locals when token is valid", async () => {
        // Arrange
        req.headers = {
            authorization: "Bearer valid-token",
        };
        (auth.verifyIdToken as jest.Mock).mockResolvedValue({
            uid: "user-123",
            role: "lead",
        });
        // Act
        await authenticate(req as Request, res as Response, next);
        // Assert
        expect(res.locals?.role).toBe("lead");
        expect(next).toHaveBeenCalled();
    });
});