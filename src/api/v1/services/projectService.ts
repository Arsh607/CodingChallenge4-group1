import { project } from "../repositories/projectRepository";
import { Project } from "../models/projectModel";
import { AppError } from "../errors/errors";
import { HTTP_STATUS } from "../../../constants/httpConstants";

interface CreateProjectInput {
    name: string;
    status: string;
}

interface UpdateProjectInput {
    name?: string;
    status?: string;
}

export const getAllProjects = (): Project[] => {
    return project;
};

export const getProjectById = (id: number): Project => {
    const foundProject = project.find((p) => p.id === id);

    if (!foundProject) {
        throw new AppError(
            "Project not found",
            "PROJECT_NOT_FOUND",
            HTTP_STATUS.NOT_FOUND
        );
    }

    return foundProject;
};

export const createProject = (data: CreateProjectInput): Project => {
    const { name, status } = data;

    if (!name || !status) {
        throw new AppError(
            "Name and status are required",
            "INVALID_PROJECT_DATA",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    const newProject: Project = {
        id: project.length ? project[project.length - 1].id + 1 : 1,
        name,
        status,
        createdAt: new Date().toISOString(),
    };

    project.push(newProject);

    return newProject;
};

export const updateProject = (
    id: number,
    data: UpdateProjectInput
): Project => {
    const foundProject = project.find((p) => p.id === id);

    if (!foundProject) {
        throw new AppError(
            "Project not found",
            "PROJECT_NOT_FOUND",
            HTTP_STATUS.NOT_FOUND
        );
    }

    if (data.name !== undefined) {
        foundProject.name = data.name;
    }

    if (data.status !== undefined) {
        foundProject.status = data.status;
    }

    return foundProject;
};

export const deleteProject = (id: number): Project => {
    const index = project.findIndex((p) => p.id === id);

    if (index === -1) {
        throw new AppError(
            "Project not found",
            "PROJECT_NOT_FOUND",
            HTTP_STATUS.NOT_FOUND
        );
    }

    const deleted = project.splice(index, 1);

    return deleted[0];
};