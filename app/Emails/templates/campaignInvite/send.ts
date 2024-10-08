"use server";
import { SESClientSendMail as sesAPIClient } from "../../sesAPI";
import { SendMailProps } from "../types";
import { TemplateVariables, templateNames } from "./TemplateVariables";
import { ProjectManagers } from "@/app/ServerFunctions/types";
import { CampaignInviteEncodedData, encodeQueryParams } from "@/app/utils";
import { getInviteBaseUrl } from "@/app/ServerFunctions/serverActions";
import {
    grabSignatureProps,
    defaultSignatureProps,
    type SignatureTemplateVariables,
} from "@/app/Emails/templates/signature";

/**
 * Send campaign invites to candidates
 * @param props
 * @param props.level The email level to send
 * @param props.props.candidates The candidates to send the email to
 * @param props.props.assignment The assignment to send the email for
 * @param props.props.taskDescriptions The descriptions of the tasks in the assignment
 * @returns
 */
type commonVariables = Pick<
    TemplateVariables,
    /* "assignments" | */
    /* "honorar" | */
    "customerCompany"
>;
type personalVariables = Pick<TemplateVariables, "name" | "linkBase" | "linkData">;
export default async function send(props: SendMailProps) {
    const {
        level,
        commonContext: {
            candidates,
            assignment,
            // taskDescriptions,
            customer,
            // campaign,
            projectManager: campaignManager,
        },
    } = props;
    console.log("Sending invites for level", level, props);

    if (level === "none") return;
    // Check if all required data is present
    if (/* !taskDescriptions || */ !candidates || !assignment || !customer || !campaignManager) {
        const missingContext = {
            /*  taskDescriptions: !!taskDescriptions, */
            candidates: !!candidates,
            assignment: !!assignment,
            customer: !!customer,
            campaignManager: !!campaignManager,
        };
        Object.entries(missingContext).forEach(([key, value]) => {
            if (value) {
                delete missingContext[key as keyof typeof missingContext];
            }
        });
        throw new Error(`Missing email context: ${Object.keys(missingContext).join(", ")}`);
    }

    const templateName = templateNames[level];

    const commonVariables: commonVariables = {
        // assignments: taskDescriptions.map((assignmentDescription) => ({
        //     assignmentDescription,
        // })),
        // honorar: `${assignment.budget?.toString()} €` ?? "<Honorar nicht definiert>",
        customerCompany: customer?.company ?? "TestCustomer",
    };

    const senderName = ProjectManagers.getFullName(campaignManager);
    const senderEmail = campaignManager.email;
    const campaignId = assignment.campaign.id;
    const baseUrl = await getInviteBaseUrl();

    const senderAdress =
        senderName && senderEmail
            ? `${senderName} <${senderEmail}>`
            : "swinx GmbH <noreply@swinx.de>";
    const defaultTemplateData: TemplateVariables = {
        name: "Error 418: Teapot",
        // assignments: commonVariables.assignments,
        // honorar: commonVariables.honorar,
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
    };
    const bulkTemplateData = candidates
        .map((candidate) => {
            const { id: candidateId, influencer, ...candidateData } = candidate;
            if (!candidateId || !influencer) {
                console.error("Error: Candidate data is invalid", { candidate });
                return null;
            }
            const candidateFullName = `${influencer.firstName} ${influencer.lastName}`;
            // const baseParams: CampaignInviteEncodedData = {
            //     assignmentId: assignment.id,
            //     candidateId,
            //     candidateFullName,
            //     campaignId,
            // };
            const encodedData = encodeQueryParams({
                assignmentId: assignment.id,
                candidateId,
                candidateFullName,
                campaignId,
            });
            const templateVariables: TemplateVariables & SignatureTemplateVariables = {
                name: candidateFullName,
                customerCompany: commonVariables.customerCompany,
                linkBase: baseUrl,
                linkData: encodedData,
                ...grabSignatureProps({ projectManager: campaignManager }),
            };
            return {
                to: candidate.influencer.email,
                templateData: JSON.stringify(templateVariables),
            };
        })
        .filter((data): data is { to: string; templateData: string } => {
            if (data === null) {
                console.error("Error: Email data is invalid");
                return false;
            }
            return true;
        });
    const response = await sesAPIClient.sendBulk({
        from: senderAdress,
        templateName: templateName,
        defaultTemplateData: JSON.stringify({ ...defaultTemplateData, ...defaultSignatureProps }),
        bulkTemplateData: bulkTemplateData,
    });
    return response;
}
