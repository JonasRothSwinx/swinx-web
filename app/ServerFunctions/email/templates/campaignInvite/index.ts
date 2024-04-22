import htmlReduced from "./reduced.html";
import { MailTemplate, Template, SendMailProps, EmailLevelDefinition } from "../types";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import dotenv from "dotenv";
import sendBulkCampaignInvite from "./send";
import { render, renderAsync } from "@react-email/render";
import CampaignInviteEmail from "./CampaignInviteEmail";

export type TemplateVariables = {
    name: string;
    assignments: { assignmentDescription: string }[];
    honorar: string;
    linkBase: string;
    linkData: string;
};

const templateNameBase = "CampaignInvite";
const subjectLineBase = "Einladung zur Kampagne";
const templates: EmailLevelDefinition = {
    new: {
        name: `${templateNameBase}New`,
        subjectLine: subjectLineBase,
        html: renderAsync(CampaignInviteEmail({ emailLevel: "new" })),
        text: renderAsync(CampaignInviteEmail({ emailLevel: "new" }), { plainText: true }),
    },
    reduced: {
        name: `${templateNameBase}Reduced`,
        subjectLine: subjectLineBase,
        html: renderAsync(CampaignInviteEmail({ emailLevel: "reduced" })),
        text: renderAsync(CampaignInviteEmail({ emailLevel: "reduced" }), { plainText: true }),
    },
} as const;

export const templateNames = [...Object.values(templates).map((template) => template.name)] as const;

const defaultParams: TemplateVariables = {
    name: "testName",
    assignments: [{ assignmentDescription: "Fliege zum Mars" }],
    honorar: "0€",
    linkBase: "http://localhost:3000/Response?",
    linkData: "testData",
};

const inviteEmails: Template = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
} as const;
export default inviteEmails;

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
        context: { candidates, assignment, taskDescriptions },
    } = props;
    console.log("Sending invites for level", level, props);
    // debugger;
    if (level === "none" || !candidates || !assignment) return;
    if (!taskDescriptions) throw new Error("Task descriptions are missing");

    const templateName = templates[level].name;
    return sendBulkCampaignInvite({
        templateName: templateName as (typeof templateNames)[number],
        candidates,
        variables: {
            assignments: taskDescriptions.map((assignmentDescription) => ({
                assignmentDescription,
            })),
            honorar: assignment.budget?.toString() ?? "<Honorar nicht definiert>",
        },
    });
}
