import html from "./invite.html";
import { MailTemplate } from "../templates";

type inviteTemplateVariables = {
    name: string;
    assignments: { assignmentDescription: string }[];
    honorar: string;
    linkBase: string;
    linkYes: string;
    linkNo: string;
};

const template: MailTemplate = {
    name: "CampaignInvite",
    subjectLine: "Einladung zu Kampagne",
    html,
};

export { template };
export type { inviteTemplateVariables };
