"use server";

import getSESClient from "@/app/Emails/sesAPI/client";
import sesAPIClient from "@/app/Emails/sesAPI";
import { Task } from "./types";
import { config, dataClient } from ".";
import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import { renderAsync } from "@react-email/render";
import { SubmitLinkEmail } from "./Emails/SubmitLink";
import MediaUploadEmail from "./Emails/MediaUpload";

interface SharePostLink {
    eventId: string;
    campaignId: string;
    postLink: string;
    task: Task;
}

export async function sharePostLink({ eventId, campaignId, postLink, task }: SharePostLink) {
    const sesClient = await getSESClient();
    const mangagerEmails = await dataClient.getCampaignManagers({ campaignId });
    if (!task) throw new Error("Task not found");
    const event = task.events.find((event) => event.id === eventId);
    if (!event) throw new Error("Event not found");
    console.log("event", event);
    const customerName = task.campaignInfo.customerCompany;
    const influencerName =
        `${task.influencerInfo.firstName} ${task.influencerInfo.lastName}`.trim();
    const emailHtml = renderAsync(
        SubmitLinkEmail({
            campaignId,
            eventId,
            event,
            customerName,
            influencerName,
            postLink: "",
        }),
    );
    const emailText = renderAsync(
        SubmitLinkEmail({
            campaignId,
            eventId,
            event,
            customerName,
            influencerName,
            postLink: "",
        }),
        { plainText: true },
    );
    // console.log("emailHtml", await emailHtml);
    // console.log("emailText", await emailText);
    // console.log("mangagerEmails", mangagerEmails);

    const resAPI = await sesAPIClient.send({
        ToAddresses: [mangagerEmails[0]],
        CcAddresses: mangagerEmails.slice(1),
        sender: {
            name: "swinx Email Gremlin",
            email: "basement@swinx.de",
        },
        subject: `Influencer ${influencerName} hat Medien für ${customerName} eingereicht`,
        html: await emailHtml,
        text: await emailText,
        noSenderBcc: true,
    });
    // console.log("Email sent", resAPI);
    return resAPI;
}
interface NotifyMediaSubmission {
    eventId: string;
    campaignId: string;
    task: Task;
}
export async function notifyMediaSubmission({ eventId, campaignId, task }: NotifyMediaSubmission) {
    const mangagerEmails = await dataClient.getCampaignManagers({ campaignId });
    if (!task) throw new Error("Task not found");
    const event = task.events.find((event) => event.id === eventId);
    if (!event) throw new Error("Event not found");
    const customerName = task.campaignInfo.customerCompany;
    const influencerName =
        `${task.influencerInfo.firstName} ${task.influencerInfo.lastName}`.trim();

    const baseUrl = process.env.BASE_URL as string;
    const campaignUrl = `${baseUrl}/campaign/${campaignId}`;
    const emailHtml = renderAsync(
        MediaUploadEmail({
            campaignId,
            eventId,
            event,
            customerName,
            influencerName,
            campaignUrl,
        }),
    );
    const emailText = renderAsync(
        MediaUploadEmail({
            campaignId,
            eventId,
            event,
            customerName,
            influencerName,
            campaignUrl,
        }),
        { plainText: true },
    );
    const resAPI = await sesAPIClient.send({
        ToAddresses: [mangagerEmails[0]],
        CcAddresses: mangagerEmails.slice(1),
        sender: {
            name: "swinx Email Gremlin",
            email: "basement@swinx.de",
        },
        subject: `Influencer ${influencerName} hat Medien für ${customerName} eingereicht`,
        html: await emailHtml,
        text: await emailText,
        noSenderBcc: true,
    });
}
