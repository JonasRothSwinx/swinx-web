import config from "./config";
import database from "../dbOperations";
import ProjectManagers from "../../types/projectManagers";
import { Nullable } from "@/app/Definitions/types";
import { getUserAttributes } from "../../serverActions";

const projectManagerClient = {
    create: createProjectManager,
    list: listProjectManagers,
    update: updateProjectManager,
    delete: deleteProjectManager,
    get: getProjectManager,
    getByCognitoId: getProjectManagerByCognitoId,
    getForUser: getProjectManagerForCurrentUser,
};
export default projectManagerClient;

//#region Create
/**
 * Create a new project manager
 * @param projectManager The project manager object to create
 * @returns The created project manager object
 */
interface CreateProjectManagerParams {
    projectManager: Omit<ProjectManagers.ProjectManager, "id">;
}

async function createProjectManager({
    projectManager,
}: CreateProjectManagerParams): Promise<ProjectManagers.ProjectManager> {
    const queryClient = config.getQueryClient();
    const cognitoId = projectManager.cognitoId;
    const id = await database.projectManager.create({ projectManager });
    if (!id) throw new Error("Failed to create project manager");
    const createdProjectManager = { ...projectManager, id };
    queryClient.setQueryData(["projectManager"], { ...projectManager, id });
    queryClient.refetchQueries({ queryKey: ["projectManager"] });
    return createdProjectManager;
}
//#endregion

//#region List
/**
 * List all project managers
 * @returns The list of project managers
 */
async function listProjectManagers(): Promise<ProjectManagers.ProjectManager[]> {
    const queryClient = config.getQueryClient();
    //Return cached data if available
    // const cachedData = queryClient.getQueryData<ProjectManagers.ProjectManager[]>(["projectManagers"]);
    // if (cachedData) return cachedData;

    const projectManagers = await database.projectManager.list();
    queryClient.setQueryData(["projectManagers"], projectManagers);
    // queryClient.refetchQueries({ queryKey: ["projectManagers"] });

    return projectManagers;
}
//#endregion

//#region Get
/**
 * Get a project manager by id
 * @param id The id of the project manager to get
 */
interface GetProjectManagerParams {
    id: string;
}
async function getProjectManager({
    id,
}: GetProjectManagerParams): Promise<Nullable<ProjectManagers.ProjectManager>> {
    const queryClient = config.getQueryClient();
    const cachedData = queryClient.getQueryData<ProjectManagers.ProjectManager>([
        "projectManager",
        id,
    ]);
    if (cachedData) return cachedData;

    const projectManager = await database.projectManager.get({ id });
    queryClient.setQueryData(["projectManager", id], projectManager);
    return projectManager;
}

/**
 * Get Project Manager by Cognito ID
 * @param cognitoId The cognito id of the project manager to get
 */
interface GetProjectManagerByCognitoIdParams {
    cognitoId: string;
}
async function getProjectManagerByCognitoId({
    cognitoId,
}: GetProjectManagerByCognitoIdParams): Promise<Nullable<ProjectManagers.ProjectManager>> {
    const queryClient = config.getQueryClient();
    const cachedData = queryClient.getQueryData<ProjectManagers.ProjectManager>([
        "projectManager",
        cognitoId,
    ]);
    if (cachedData) return cachedData;

    const projectManager = await database.projectManager.getByCognitoId({ cognitoId });
    queryClient.setQueryData(["projectManager", cognitoId], projectManager);
    return projectManager;
}

/**
 * Get associated Project Manager Object for current user
 */
async function getProjectManagerForCurrentUser(): Promise<
    Nullable<ProjectManagers.ProjectManager>
> {
    const queryClient = config.getQueryClient();
    const cachedData = queryClient.getQueryData<ProjectManagers.ProjectManager>(["projectManager"]);
    if (cachedData) return cachedData;
    const cognitoId = (
        await queryClient.fetchQuery({
            queryKey: ["userAttributes"],
            queryFn: () => {
                return getUserAttributes();
            },
        })
    ).sub;
    if (!cognitoId) throw new Error("Cognito ID not found");

    const projectManager = await database.projectManager.getByCognitoId({ cognitoId });
    queryClient.setQueryData(["projectManager"], projectManager);
    return projectManager;
}
//#endregion

//#region Update
/**
 * Update a project manager
 * @param id The id of the project manager to update
 * @param updatedData The data to update
 * @returns The updated project manager object
 */

interface UpdateProjectManagerParams {
    id: string;
    updatedData: Partial<ProjectManagers.ProjectManager>;
}
async function updateProjectManager({
    id,
    updatedData,
}: UpdateProjectManagerParams): Promise<ProjectManagers.ProjectManager> {
    const queryClient = config.getQueryClient();
    const previousProjectManager = queryClient.getQueryData<ProjectManagers.ProjectManager>([
        "projectManager",
        id,
    ]);
    if (!previousProjectManager) throw new Error("Project Manager not found");
    database.projectManager.update({ id, updatedData });
    const updatedProjectManager = {
        ...previousProjectManager,
        ...updatedData,
    };
    queryClient.setQueryData(["projectManager", id], updatedProjectManager);
    queryClient.setQueryData(["projectManagers"], (prev: ProjectManagers.ProjectManager[]) => {
        if (!prev) {
            return [updatedProjectManager];
        }
        return prev.map((projectManager) =>
            projectManager.id === id ? updatedProjectManager : projectManager,
        );
    });
    queryClient.refetchQueries({ queryKey: ["projectManagers"] });
    queryClient.refetchQueries({ queryKey: ["projectManager", id] });
    return updatedProjectManager;
}
//#endregion

//#region Delete
/**
 * Delete a project manager
 * @param id The id of the project manager to delete
 */
async function deleteProjectManager(id: string): Promise<void> {
    const queryClient = config.getQueryClient();
    const previousProjectManager = queryClient.getQueryData<ProjectManagers.ProjectManager>([
        "projectManager",
        id,
    ]);
    if (!previousProjectManager) throw new Error("Project Manager not found");
    database.projectManager.delete({ id });
    queryClient.setQueryData(["projectManagers"], (prev: ProjectManagers.ProjectManager[]) => {
        if (!prev) {
            return [];
        }
        return prev.filter((projectManager) => projectManager.id !== id);
    });
    queryClient.refetchQueries({ queryKey: ["projectManagers"] });
    queryClient.refetchQueries({ queryKey: ["projectManager", id] });
}
//#endregion

/**
 * Get associated Project Manager Object for current user
 */
// async function getProjectManager(): Promise<ProjectManagers.ProjectManager> {
//     // const queryClient = config.getQueryClient();
//     // const projectManager = await database.projectManager.get();
//     // queryClient.setQueryData(["projectManager", projectManager.id], projectManager);
//     // return projectManager;
// }
