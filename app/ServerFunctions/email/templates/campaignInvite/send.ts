"use server";
import { Candidates } from "@/app/ServerFunctions/types/candidates";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../sesAPI";
import { TemplateVariables, templateNames } from ".";

interface BulkCampaignInviteProps {
    candidates: Candidates.Candidate[];
    variables: Pick<TemplateVariables, "assignments" | "honorar">;
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
                linkData: "testData",
            } satisfies TemplateVariables),
            emailData: props.candidates.map((candidate) => {
                const baseParams = {
                    firstName: candidate.influencer.firstName,
                    lastName: candidate.influencer.lastName,
                    id: candidate.id,
                };
                const encodedParametersYes = encodeURIComponent(
                    btoa(JSON.stringify({ ...baseParams, response: "accepted" }))
                );
                const encodedParametersNo = encodeURIComponent(
                    btoa(JSON.stringify({ ...baseParams, response: "rejected" }))
                );
                const encodedData = encodeURIComponent(btoa(JSON.stringify(baseParams)));
                return {
                    to: candidate.influencer.email,
                    templateData: JSON.stringify({
                        name: `${candidate.influencer.firstName} ${candidate.influencer.lastName}`,
                        assignments: variables.assignments ?? [{ assignmentDescription: "Make Tea" }],
                        honorar: variables.honorar ?? "<Honorar nicht definiert>",
                        linkBase: baseUrl + "/Response?",
                        linkData: encodedData,
                    } satisfies Partial<TemplateVariables>),
                };
            }),
        },
    };

    const response = await sesAPIClient.sendBulk(requestBody);
    return response;
}
