"use server";

import InfluencerResponseEmail from "@/app/Emails/manualTemplates/InfluencerResponse";
import sesAPIClient from "@/app/Emails/sesAPI";
import ProjectManagers from "@/app/ServerFunctions/types/projectManagers";
import { renderAsync } from "@react-email/render";
import { getProjectManagerEmails } from "./Database/dbOperations";

interface NotifyResponseParams {
    response: boolean;
    candidateFullName: string;
    customerCompany: string;
    campaignId: string;
}
export default async function notifyResponse({
    response,
    candidateFullName,
    customerCompany,
    campaignId,
}: NotifyResponseParams) {
    const projectManagers = await getProjectManagerEmails({ campaignId: campaignId });
    const toAdresses = [projectManagers[0]];
    const ccAdresses = projectManagers.length > 1 ? projectManagers.slice(1) : undefined;
    const sender = { name: "Swinx Web", email: "noreply@swinx.de" };
    const subject = `${candidateFullName} hat auf Anfrage geantwortet`;
    const html = renderAsync(
        InfluencerResponseEmail({
            accepted: response,
            InfluencerName: candidateFullName,
            customerName: customerCompany,
        }),
    );
    sesAPIClient.send({
        ToAddresses: toAdresses,
        CcAddresses: ccAdresses,
        sender,
        subject,
        html: await html,
    });
}
