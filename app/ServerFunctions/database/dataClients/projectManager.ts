import config from "./config";
import database from "../dbOperations";
import ProjectManagers from "../../types/projectManagers";

const projectManagerClient = {
    createProjectManager,
    listProjectManagers,
    updateProjectManager,
    deleteProjectManager,
};
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
    const id = await database.projectManager.create({ projectManager });
    const createdProjectManager = { ...projectManager, id };
    queryClient.setQueryData(["projectManager", id], { ...projectManager, id });
    queryClient.setQueryData(["projectManagers"], (prev: ProjectManagers.ProjectManager[]) => {
        if (!prev) {
            return [createdProjectManager];
        }
        return [...prev, createdProjectManager];
    });
    queryClient.refetchQueries({ queryKey: ["projectManagers"] });
    queryClient.refetchQueries({ queryKey: ["projectManager", id] });
    return createdProjectManager;
}

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

/**
 * Get associated Project Manager Object for current user
 */
// async function getProjectManager(): Promise<ProjectManagers.ProjectManager> {
//     // const queryClient = config.getQueryClient();
//     // const projectManager = await database.projectManager.get();
//     // queryClient.setQueryData(["projectManager", projectManager.id], projectManager);
//     // return projectManager;
// }
