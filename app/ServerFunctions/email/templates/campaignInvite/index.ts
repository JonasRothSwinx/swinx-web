import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import { renderAsync } from "@react-email/render";
import sesAPIClient from "../../sesAPI";
import { EmailLevelDefinition, SendMailProps, Template } from "../types";
import CampaignInviteEmail, { TemplateVariables, defaultParams, subjectLineBase } from "./CampaignInviteEmail";

const templateNameBase = "CampaignInvite";
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
type commonVariables = Pick<TemplateVariables, "assignments" | "honorar" | "customerCompany">;
type personalVariables = Pick<TemplateVariables, "name" | "linkBase" | "linkData">;
async function send(props: SendMailProps) {
    const {
        level,
        context: { candidates, assignment, taskDescriptions, customer },
    } = props;
    console.log("Sending invites for level", level, props);

    if (level === "none" || !candidates || !assignment) return;
    if (!taskDescriptions) throw new Error("Task descriptions are missing");

    const templateName = templates[level].name;

    const commonVariables: commonVariables = {
        assignments: taskDescriptions.map((assignmentDescription) => ({
            assignmentDescription,
        })),
        honorar: assignment.budget?.toString() ?? "<Honorar nicht definiert>",
        customerCompany: customer?.company ?? "TestCustomer",
    };
    const baseUrl = process.env.BASE_URL;
    const requestBody: sesHandlerSendEmailTemplateBulk = {
        operation: "sendEmailTemplateBulk",
        bulkEmailData: {
            from: "swinx GmbH <noreply@swinx.de>",
            templateName: templateName,
            defaultTemplateData: JSON.stringify({
                name: "Error 418: Teapot",
                assignments: commonVariables.assignments,
                honorar: commonVariables.honorar,
                linkBase: baseUrl + "/Response?",
                linkData: "testData",
                customerCompany: commonVariables.customerCompany,
            } satisfies TemplateVariables),
            emailData: candidates.map((candidate) => {
                const baseParams = {
                    firstName: candidate.influencer.firstName,
                    lastName: candidate.influencer.lastName,
                    id: candidate.id,
                };
                const encodedData = encodeURIComponent(btoa(JSON.stringify(baseParams)));
                return {
                    to: candidate.influencer.email,
                    templateData: JSON.stringify({
                        name: `${candidate.influencer.firstName} ${candidate.influencer.lastName}`,
                        linkBase: baseUrl + "/Response?",
                        linkData: encodedData,
                    } satisfies personalVariables),
                };
            }),
        },
    };

    const response = await sesAPIClient.sendBulk(requestBody);
    return response;
}
