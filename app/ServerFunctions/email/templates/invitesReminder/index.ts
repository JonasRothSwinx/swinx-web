import htmlNew from "./htmlNew.html";
import htmlReduced from "./htmlReduced.html";
import { MailTemplate, SendMailProps, Template } from "../../templates";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";

type inviteReminderVariables = {
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
    html: htmlNew,
} as const;
const templateReduced: MailTemplate = {
    name: "CampaignInviteReduced",
    subjectLine: "Einladung zu Kampagne",
    html: htmlReduced,
} as const;
const inviteTemplateNames = [templateNew.name, templateReduced.name] as const;

const defaultParams: inviteReminderVariables = {
    name: "testName",
    assignments: [{ assignmentDescription: "Fliege zum Mars" }],
    honorar: "0€",
    linkBase: "http://localhost:3000/Response?",
    linkYes: "q=Yes",
    linkNo: "q=No",
};

const inviteReminderTemplates: Template = {
    defaultParams,
    send,
    levels: {
        new: templateNew,
        reduced: templateReduced,
    },
    templateNames: [...inviteTemplateNames],
};

function extractVariables(event: TimelineEvent.Event): inviteReminderVariables {
    const name = "";
    throw new Error("Not implemented yet");
}

async function send(props: SendMailProps) {
    throw new Error("Not implemented yet");
}
