import htmlNew from "./new.html";
import htmlReduced from "./reduced.html";
import { MailTemplate, Template, SendMailProps, EmailLevelDefinition } from "..";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import dotenv from "dotenv";
import sendBulkCampaignInvite from "./send";

export type inviteTemplateVariables = {
    name: string;
    assignments: { assignmentDescription: string }[];
    honorar: string;
    linkBase: string;
    linkYes: string;
    linkNo: string;
};

const templateNew: MailTemplate = {
    name: "CampaignInviteNew",
    subjectLine: "Einladung zu Kampagne",
    html: htmlNew,
} as const;

const templateReduced: MailTemplate = {
    name: "CampaignInviteReduced",
    subjectLine: "Einladung zu Kampagne",
    html: htmlReduced,
} as const;

const templates: EmailLevelDefinition = {
    new: templateNew,
    reduced: templateReduced,
};

export const inviteTemplateNames: string[] = [templateNew.name, templateReduced.name] as const;

const defaultParams: inviteTemplateVariables = {
    name: "testName",
    assignments: [{ assignmentDescription: "Fliege zum Mars" }],
    honorar: "0€",
    linkBase: "http://localhost:3000/Response?",
    linkYes: "q=Yes",
    linkNo: "q=No",
};

const inviteEmails: Template = {
    defaultParams,
    send,
    levels: {
        new: templateNew,
        reduced: templateReduced,
    },
    templateNames: [...inviteTemplateNames],
} as const;
export default inviteEmails;

function extractVariables(event: TimelineEvent.Event): inviteTemplateVariables {
    const name = "";
    throw new Error("Not implemented yet");
}

/**
 * Send campaign invites to candidates
 * @param props
 * @param props.level The email level to send
 * @param props.props.candidates The candidates to send the email to
 * @param props.props.assignment The assignment to send the email for
 * @param props.props.taskDescriptions The descriptions of the tasks in the assignment
 * @returns
 */
async function send(props: SendMailProps) {
    const {
        level,
        props: { candidates, assignment, taskDescriptions },
    } = props;
    console.log("Sending invites for level", level, props);
    // debugger;
    if (level === "none" || !candidates || !assignment) return;
    if (!taskDescriptions) throw new Error("Task descriptions are missing");

    const templateName = templates[level].name;
    return sendBulkCampaignInvite({
        templateName,
        candidates,
        variables: {
            assignments: taskDescriptions.map((assignmentDescription) => ({
                assignmentDescription,
            })),
            honorar: assignment.budget?.toString() ?? "<Honorar nicht definiert>",
        },
    });
}
