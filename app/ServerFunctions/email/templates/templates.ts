import * as inviteTemplate from "./invites/invitesTemplate";

export interface MailTemplate {
    name: string;
    subjectLine: string;
    html: string;
}
const templateDefinitions: MailTemplate[] = [inviteTemplate.template];

const templateNames = { inviteTemplate: inviteTemplate.template.name } as const;
export { templateNames };
export default templateDefinitions;
