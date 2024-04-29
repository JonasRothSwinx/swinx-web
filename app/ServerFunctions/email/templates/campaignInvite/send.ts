"use server";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../sesAPI";
import { SendMailProps } from "../types";
import { TemplateVariables } from "./CampaignInviteEmail";
import { templates } from ".";

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
export default async function send(props: SendMailProps) {
    const {
        level,
        commonContext: { candidates, assignment, taskDescriptions, customer },
    } = props;
    console.log("Sending invites for level", level, props);

    if (level === "none") return;
    // Check if all required data is present
    if (!taskDescriptions || !candidates || !assignment || !customer) throw new Error("Missing context");

    const templateName = templates[level].name;

    const commonVariables: commonVariables = {
        assignments: taskDescriptions.map((assignmentDescription) => ({
            assignmentDescription,
        })),
        honorar: assignment.budget?.toString() ?? "<Honorar nicht definiert>",
        customerCompany: customer?.company ?? "TestCustomer",
    };
    const baseUrl = process.env.BASE_URL + "/Response?q=";
    const requestBody: sesHandlerSendEmailTemplateBulk = {
        operation: "sendEmailTemplateBulk",
        bulkEmailData: {
            //common Part
            from: "swinx GmbH <noreply@swinx.de>",
            templateName: templateName,
            defaultTemplateData: JSON.stringify({
                name: "Error 418: Teapot",
                assignments: commonVariables.assignments,
                honorar: commonVariables.honorar,
                linkBase: baseUrl,
                linkData: "testData",
                customerCompany: commonVariables.customerCompany,
            } satisfies TemplateVariables),

            //personalized Part
            emailData: candidates.map((candidate) => {
                const baseParams = {
                    firstName: candidate.influencer.firstName,
                    lastName: candidate.influencer.lastName,
                    id: candidate.id,
                };
                const encodedData = encodeURIComponent(btoa(JSON.stringify(baseParams)));
                const recipientName = `${candidate.influencer.firstName} ${candidate.influencer.lastName}`;
                return {
                    to: candidate.influencer.email,
                    templateData: JSON.stringify({
                        name: recipientName,
                        linkBase: baseUrl,
                        linkData: encodedData,
                    } satisfies personalVariables),
                };
            }),
        },
    };

    const response = await sesAPIClient.sendBulk(requestBody);
    return response;
}
