import { Request, Response } from "express";

import * as projectService from "../services/projectService";

import { HTTP_STATUS } from "../../../constants/httpConstants";
 
export const getHealth = (req: Request, res: Response): void => {

    res.status(HTTP_STATUS.OK).json({

        status: "OK",

        uptime: process.uptime(),

        timestamp: new Date().toISOString(),

        version: "1.0.0",

    });

};
 
export const getAllProjects = (req: Request, res: Response): void => {

    const projects = projectService.getAllProjects();
 
    res.status(HTTP_STATUS.OK).json({

        message: "Projects retrieved",

        count: projects.length,

        data: projects,

    });

};
 
export const getProjectById = (req: Request, res: Response): void => {

    const id = Number(req.params.id);

    const project = projectService.getProjectById(id);
 
    if (!project) {

        res.status(HTTP_STATUS.NOT_FOUND).json({

            message: "Project not found",

        });

        return;

    }
 
    res.status(HTTP_STATUS.OK).json({

        message: "Project retrieved",

        data: project,

    });

};
 
export const createProject = (req: Request, res: Response): void => {

    const { name, status } = req.body;
 
    if (!name || !status) {

        res.status(HTTP_STATUS.BAD_REQUEST).json({

            message: "Name and status are required",

        });

        return;

    }
 
    const project = projectService.createProject({ name, status });
 
    res.status(HTTP_STATUS.CREATED).json({

        message: "Project created",

        data: project,

    });

};
 
export const updateProject = (req: Request, res: Response): void => {

    const id = Number(req.params.id);

    const { name, status } = req.body;
 
    const updatedProject = projectService.updateProject(id, { name, status });
 
    if (!updatedProject) {

        res.status(HTTP_STATUS.NOT_FOUND).json({

            message: "Project not found",

        });

        return;

    }
 
    res.status(HTTP_STATUS.OK).json({

        message: "Project updated",

        data: updatedProject,

    });

};
 
export const deleteProject = (req: Request, res: Response): void => {

    const id = Number(req.params.id);

    const deletedProject = projectService.deleteProject(id);
 
    if (!deletedProject) {

        res.status(HTTP_STATUS.NOT_FOUND).json({

            message: "Project not found",

        });

        return;

    }
 
    res.status(HTTP_STATUS.OK).json({

        message: "Project deleted",

        data: deletedProject,

    });

};