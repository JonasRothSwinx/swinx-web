namespace ProjectManagers {
    export type ProjectManager = {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
        notes?: string;
    };

    export function getFullName(projectManager: ProjectManager): string {
        return `${projectManager.firstName} ${projectManager.lastName}`;
    }
}

export default ProjectManagers;
