"use server";
import { SelectionSet } from "aws-amplify/api";
import client from "./.dbclient";
import { Schema } from "@/amplify/data/resource";
import ProjectManagers from "../../types/projectManagers";
import { Nullable } from "@/app/Definitions/types";

const selectionSet = [
    //
    "id",
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "notes",
    "cognitoId",
] as const;

type RawProjectManager = SelectionSet<Schema["ProjectManager"]["type"], typeof selectionSet>;

//#region Get
interface GetProjectManagerParams {
    id: string;
}
export async function getProjectManager({ id }: GetProjectManagerParams) {
    const { data, errors } = await client.models.ProjectManager.get({ id }, { selectionSet });
    console.log({
        data: data,
        error: JSON.stringify(errors),
    });
    return validateProjectManager(data);
}

interface GetProjectManagerByCognitoIdParams {
    cognitoId: string;
}
export async function getProjectManagerByCognitoId({
    cognitoId,
}: GetProjectManagerByCognitoIdParams): Promise<Nullable<ProjectManagers.ProjectManager>> {
    const { data, errors } = await client.models.ProjectManager.listByCognitoId({ cognitoId }, { selectionSet });
    // console.log({
    //     data: data,
    //     error: JSON.stringify(errors),
    // });
    const entries = validateProjectManagers(data);
    if (entries.length === 0) return null;
    if (entries.length > 1) throw new Error("Multiple project managers with the same cognito id");
    return entries[0];
}
//#endregion

//#region List
export async function listProjectManagers() {
    const { data, errors } = await client.models.ProjectManager.list({
        selectionSet,
    });
    console.log({
        data: data,
        error: JSON.stringify(errors),
    });
    return validateProjectManagers(data);
}
//#endregion

//#region Create
interface CreateProjectManagerParams {
    projectManager: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
        notes?: string;
        cognitoId: string;
    };
}
export async function createProjectManager({ projectManager }: CreateProjectManagerParams) {
    const { data, errors } = await client.models.ProjectManager.create({ ...projectManager });
    console.log({
        data: data,
        error: JSON.stringify(errors),
    });
    return data?.id ?? null;
}
//#endregion

//#region Update
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
//#endregion

//#region Delete
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
//#endregion

//#region Connect
interface ConnectToManagerParams {
    campaignId: string;
    projectManagerId: string;
}
export async function connectToManager({ campaignId, projectManagerId }: ConnectToManagerParams) {
    const { data, errors } = await client.models.ProjectManagerCampaignAssignment.create({
        projectManagerId,
        campaignId,
    });
    console.log({
        data: data,
        error: JSON.stringify(errors),
    });
}
//#endregion

//#region validation

function validateProjectManager(rawData: Nullable<RawProjectManager>): Nullable<ProjectManagers.ProjectManager> {
    if (!rawData) return null;
    const validatedProjectManager: ProjectManagers.ProjectManager = {
        id: rawData.id,
        firstName: rawData.firstName,
        lastName: rawData.lastName,
        email: rawData.email,
        phoneNumber: rawData.phoneNumber ?? undefined,
        notes: rawData.notes ?? undefined,
        cognitoId: rawData.cognitoId,
    };
    return validatedProjectManager;
}

function validateProjectManagers(rawData: RawProjectManager[]): ProjectManagers.ProjectManager[] {
    const validatedProjectManagers = rawData
        .map((raw) => validateProjectManager(raw))
        .filter((x): x is ProjectManagers.ProjectManager => x !== null);
    return validatedProjectManagers;
}

//#endregion
