"use server";

import InfluencerResponseEmail from "./InfluencerResponse";
import sesAPIClient from "@/app/Emails/sesAPI";
import { ProjectManager, Candidates } from "@/app/ServerFunctions/types";
import { render, renderAsync } from "@react-email/render";
import { getProjectManagerEmails } from "../Database/dbOperations";
import { Prettify } from "@/app/Definitions/types";

interface NotifyResponseParams {
    response: Candidates.candidateResponse;
    influencerName: string;
    customerCompany: string;
    campaignId: string;
    feedback?: string;
}
export default async function notifyResponse({
    response,
    influencerName,
    customerCompany,
    campaignId,
    feedback,
}: NotifyResponseParams) {
    const projectManagers = await getProjectManagerEmails({ campaignId: campaignId });
    const toAdresses = [projectManagers[0]];
    const ccAdresses = projectManagers.length > 1 ? projectManagers.slice(1) : undefined;
    const sender = { name: "Swinx Web", email: "noreply@swinx.de" };
    const subject = getSubjectLine(response, influencerName);
    const { html, text } = renderEmail({ response, influencerName, customerCompany, feedback });
    sesAPIClient.send({
        ToAddresses: toAdresses,
        CcAddresses: ccAdresses,
        sender,
        subject,
        html: await html,
        text: await text,
    });
}

function getSubjectLine(response: Candidates.candidateResponse, candidateFullName: string) {
    switch (response) {
        case "accepted":
            return `${candidateFullName} hat eine Anfrage angenommen`;
        case "rejected":
            return `${candidateFullName} hat eine Anfrage abgelehnt`;
        case "pending":
            return `${candidateFullName} wird eine Antwort ändern`;
    }
}

type RenderEmailParams = Prettify<Parameters<typeof InfluencerResponseEmail>[0]>;
function renderEmail({ response, influencerName, customerCompany, feedback }: RenderEmailParams) {
    const mailJSX = InfluencerResponseEmail({
        response,
        influencerName,
        customerCompany,
        feedback,
    });
    return { html: render(mailJSX), text: render(mailJSX, { plainText: true }) };
}
