"use server";
import { Candidates } from "@/app/ServerFunctions/types/candidates";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../sesAPI";
import { inviteTemplateVariables, templateNames } from ".";

interface BulkCampaignInviteProps {
    candidates: Candidates.Candidate[];
    variables: Pick<inviteTemplateVariables, "assignments" | "honorar">;
    templateName: (typeof templateNames)[number];
}
export default async function sendBulkCampaignInviteAPI(props: BulkCampaignInviteProps) {
    const { templateName, variables, candidates } = props;
    const baseUrl = process.env.BASE_URL;
    const requestBody: sesHandlerSendEmailTemplateBulk = {
        operation: "sendEmailTemplateBulk",
        bulkEmailData: {
            from: "swinx GmbH <noreply@swinx.de>",
            templateName: templateName,
            defaultTemplateData: JSON.stringify({
                name: "Error 418: Teapot",
                assignments: variables.assignments ?? [{ assignmentDescription: "Make Tea" }],
                honorar: variables.honorar ?? "<Honorar nicht definiert>",
                linkBase: baseUrl + "/Response?",
                linkYes: "q=Yes",
                linkNo: "q=No",
            } satisfies inviteTemplateVariables),
            emailData: props.candidates.map((candidate) => {
                const baseParams = {
                    firstName: candidate.influencer.firstName,
                    lastName: candidate.influencer.lastName,
                    id: candidate.id,
                };
                const encodedParametersYes = encodeURIComponent(
                    btoa(JSON.stringify({ ...baseParams, response: "accepted" })),
                );
                const encodedParametersNo = encodeURIComponent(
                    btoa(JSON.stringify({ ...baseParams, response: "rejected" })),
                );
                return {
                    to: candidate.influencer.email,
                    templateData: JSON.stringify({
                        assignments: variables.assignments ?? [
                            { assignmentDescription: "Make Tea" },
                        ],
                        honorar: variables.honorar ?? "<Honorar nicht definiert>",
                        linkBase: baseUrl + "/Response?",
                        name: `${candidate.influencer.firstName} ${candidate.influencer.lastName}`,
                        linkYes: `q=${encodedParametersYes}`,
                        linkNo: `q=${encodedParametersNo}`,
                    } satisfies Partial<inviteTemplateVariables>),
                };
            }),
        },
    };

    const response = await sesAPIClient.sendBulk(requestBody);
    return response;
}
