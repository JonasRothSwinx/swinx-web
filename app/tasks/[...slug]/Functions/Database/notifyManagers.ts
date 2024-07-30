"use server";

import getSESClient from "@/app/Emails/sesAPI/client";
import { Task } from "./types";
import { config, dataClient } from ".";
import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import { renderAsync } from "@react-email/render";
import { SubmitLinkEmail } from "./Emails/SubmitLink";

interface SharePostLink {
    eventId: string;
    campaignId: string;
    postLink: string;
}

export async function sharePostLink({ eventId, campaignId, postLink }: SharePostLink) {
    const queryClient = config.getQueryClient();
    const sesClient = await getSESClient();
    const mangagerEmails = await dataClient.getCampaignManagers({ campaignId });
    const task = queryClient.getQueryData<Task>(["task"]);
    if (!task) throw new Error("Task not found");
    const event = task.events.find((event) => event.id === eventId);
    console.log("event", event);
    if (!event) throw new Error("Event not found");
    const customerName = task.campaignInfo.customerCompany;
    const influencerName = `${task.influencerInfo.firstName} ${task.influencerInfo.lastName}`.trim();

    const emailHtml = renderAsync(
        SubmitLinkEmail({
            campaignId,
            eventId,
            event,
            customerName,
            influencerName,
            postLink,
        })
    );
    const emailText = renderAsync(
        SubmitLinkEmail({
            campaignId,
            eventId,
            event,
            customerName,
            influencerName,
            postLink,
        }),
        { plainText: true }
    );

    const response = await sesClient.send(
        new SendEmailCommand({
            Destination: {
                ToAddresses: [mangagerEmails[0]],
                CcAddresses: mangagerEmails.slice(1),
            },
            Content: {
                Simple: {
                    Subject: {
                        Data: `Influencer ${influencerName} hat einen Beitragslink für ${customerName} eingereicht`,
                    },
                    Body: {
                        Html: {
                            Data: await emailHtml,
                        },
                        Text: {
                            Data: await emailText,
                        },
                    },
                },
            },
        })
    );
    console.log("Email sent", response);
    return response;
}
