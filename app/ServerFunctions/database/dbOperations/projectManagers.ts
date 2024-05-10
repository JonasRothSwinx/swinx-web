"use server";
import { SelectionSet } from "aws-amplify/api";
import client from "./.dbclient";
import { Schema } from "@/amplify/data/resource";
import ProjectManagers from "../../types/projectManagers";

const selectionSet = ["id", "firstName", "lastName", "email", "phoneNumber", "notes"] as const;

type RawProjectManager = SelectionSet<Schema["ProjectManager"], typeof selectionSet>;

interface GetProjectManagerParams {
    id: string;
}
export async function getProjectManager({ id }: GetProjectManagerParams) {
    const { data, errors } = await client.models.ProjectManager.get(
        { id },
        { selectionSet: ["id", "firstName", "lastName", "email", "phoneNumber", "notes"] },
    );
    console.log({
        data: data,
        error: JSON.stringify(errors),
    });
    return validateProjectManager(data);
}

export async function listProjectManagers() {
    const { data, errors } = await client.models.ProjectManager.list({
        selectionSet: ["id", "firstName", "lastName", "email", "phoneNumber", "notes"],
    });
    console.log({
        data: data,
        error: JSON.stringify(errors),
    });
    return validateProjectManagers(data);
}

interface CreateProjectManagerParams {
    projectManager: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
        notes?: string;
    };
}
export async function createProjectManager({ projectManager }: CreateProjectManagerParams) {
    const { data, errors } = await client.models.ProjectManager.create({ ...projectManager });
    console.log({
        data: data,
        error: JSON.stringify(errors),
    });
    return data.id;
}

interface UpdateProjectManagerParams {
    id: string;
    updatedData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        notes?: string;
    };
}
export async function updateProjectManager({ id, updatedData }: UpdateProjectManagerParams) {
    const projectManagerResponse = await client.models.ProjectManager.update({
        id,
        ...updatedData,
    });
    console.log({
        data: projectManagerResponse.data,
        error: JSON.stringify(projectManagerResponse.errors),
    });
}

interface DeleteProjectManagerParams {
    id: string;
}
export async function deleteProjectManager({ id }: DeleteProjectManagerParams) {
    const projectManagerResponse = await client.models.ProjectManager.delete({ id });
    console.log({
        data: projectManagerResponse.data,
        error: JSON.stringify(projectManagerResponse.errors),
    });
}

//#region validation

function validateProjectManager(rawData: RawProjectManager): ProjectManagers.ProjectManager {
    const validatedProjectManager: ProjectManagers.ProjectManager = {
        id: rawData.id,
        firstName: rawData.firstName,
        lastName: rawData.lastName,
        email: rawData.email,
        phoneNumber: rawData.phoneNumber ?? undefined,
        notes: rawData.notes ?? undefined,
    };
    return validatedProjectManager;
}

function validateProjectManagers(rawData: RawProjectManager[]): ProjectManagers.ProjectManager[] {
    const validatedProjectManagers = rawData.map((raw) => validateProjectManager(raw));
    return validatedProjectManagers;
}

//#endregion
