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
    if (!taskDescriptions || !candidates || !assignment || !customer) {
        const missingContext = {
            taskDescriptions: !!taskDescriptions,
            candidates: !!candidates,
            assignment: !!assignment,
            customer: !!customer,
        };
        throw new Error("Missing context" + JSON.stringify(missingContext));
    }

    const templateName = templates[level].name;

    const commonVariables: commonVariables = {
        assignments: taskDescriptions.map((assignmentDescription) => ({
            assignmentDescription,
        })),
        honorar: assignment.budget?.toString() ?? "<Honorar nicht definiert>",
        customerCompany: customer?.company ?? "TestCustomer",
    };
    const campaignId = assignment.campaign.id;
    const baseUrl = process.env.BASE_URL + "/Response?data=";
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
                linkData: encodeURIComponent(
                    btoa(
                        JSON.stringify({
                            assignmentId: assignment.id,
                            campaignId,
                            candidateFullName: "Teapot",
                            candidateId: "1234-5678",
                        } satisfies CampaignInviteEncodedData),
                    ),
                ),
                customerCompany: commonVariables.customerCompany,
            } satisfies TemplateVariables),

            //personalized Part
            emailData: candidates
                .map((candidate) => {
                    const { id: candidateId, influencer, ...candidateData } = candidate;
                    if (!candidateId || !influencer) {
                        console.error("Error: Candidate data is invalid", { candidate });
                        return null;
                    }
                    const candidateFullName = `${influencer.firstName} ${influencer.lastName}`;
                    const baseParams: CampaignInviteEncodedData = {
                        assignmentId: assignment.id,
                        candidateId,
                        candidateFullName,
                        campaignId,
                    };
                    const encodedData = encodeURIComponent(btoa(JSON.stringify(baseParams)));
                    return {
                        to: candidate.influencer.email,
                        templateData: JSON.stringify({
                            name: candidateFullName,
                            linkBase: baseUrl,
                            linkData: encodedData,
                        } satisfies personalVariables),
                    };
                })
                .filter((data): data is { to: string; templateData: string } => {
                    if (data === null) {
                        console.error("Error: Email data is invalid");
                        return false;
                    }
                    return true;
                }),
        },
    };

    const response = await sesAPIClient.sendBulk(requestBody);
    return response;
}
