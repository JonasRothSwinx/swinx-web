import html from "./invite.html";
import { MailTemplate, TemplateSet } from "../../templates";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";

type inviteTemplateVariables = {
    name: string;
    assignments: { assignmentDescription: string }[];
    honorar: string;
    linkBase: string;
    linkYes: string;
    linkNo: string;
};

const templateNew: MailTemplate = {
    name: "CampaignInvite",
    subjectLine: "Einladung zu Kampagne",
    html,
} as const;
const templateReduced: MailTemplate = {
    name: "CampaignInviteReduced",
    subjectLine: "Einladung zu Kampagne",
    html,
} as const;
const inviteTemplateNames = [templateNew.name, templateReduced.name] as const;

const defaultParams: inviteTemplateVariables = {
    name: "testName",
    assignments: [{ assignmentDescription: "Fliege zum Mars" }],
    honorar: "0€",
    linkBase: "http://localhost:3000/Response?",
    linkYes: "q=Yes",
    linkNo: "q=No",
};

const inviteEmails: TemplateSet = {
    new: {
        template: templateNew,
        defaultParams,
        variables: extractVariables,
    },
    reduced: {
        template: templateReduced,
        defaultParams,
        variables: extractVariables,
    },
};

function extractVariables(event: TimelineEvent.Event): inviteTemplateVariables {
    const name = "";
    throw new Error("Not implemented yet");
}

export { template };
export type { inviteTemplateVariables };
