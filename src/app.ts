import express, { Express } from "express";
import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import projectRoutes from "./api/v1/routes/projectRoutes";
import adminRoutes from "./api/v1/routes/adminRoutes";


const app: Express = express();

if (process.env.NODE_ENV === "production") {
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    app.use(consoleLogger);
}

app.use(express.json());
app.use('/api/v1', projectRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use(errorHandler);

export default app;