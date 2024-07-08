export type ProjectManager = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    notes?: string;
    cognitoId: string;
    jobTitle: string;
};

export function getFullName(projectManager: ProjectManager): string {
    return `${projectManager.firstName} ${projectManager.lastName}`;
}
export function validate(data: Partial<ProjectManager>): data is ProjectManager {
    return (
        typeof data.firstName === "string" &&
        typeof data.lastName === "string" &&
        typeof data.email === "string" &&
        typeof data.cognitoId === "string" &&
        typeof data.jobTitle === "string"
    );
}
