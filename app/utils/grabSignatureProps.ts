import { SignatureTemplateVariables } from "@/app/Emails/templates/_components/SignatureTemplateVariables";
import { ProjectManager, ProjectManagers } from "@/app/ServerFunctions/types";

interface GrabSignatureProps {
    projectManager: ProjectManager;
}
export function grabSignatureProps({
    projectManager,
}: GrabSignatureProps): SignatureTemplateVariables {
    const out: SignatureTemplateVariables = {
        projectManagerFullName: ProjectManagers.getFullName(projectManager),
        projectManagerJobTitle: projectManager.jobTitle,
        projectManagerEmail: projectManager.email,
        projectManagerPhoneNumber: projectManager.phoneNumber,
    };
    return out;
}
