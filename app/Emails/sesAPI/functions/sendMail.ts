"use server";
import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import getSESClient from "../client";

interface SendMailProps {
    ToAddresses: string[];
    CcAddresses?: string[];
    sender?: {
        name: string;
        email: string;
    };
    subject: string;
    html: string;
    text?: string;
    noSenderBcc?: boolean;
}
export default async function sendMail({
    ToAddresses,
    CcAddresses,
    sender,
    subject,
    html,
    text,
    noSenderBcc,
}: SendMailProps) {
    const emailClient = await getSESClient();
    const bcc: string[] = [];
    if (sender && !noSenderBcc && !sender.email.includes("noreply")) bcc.push(sender.email);
    const command = new SendEmailCommand({
        FromEmailAddress: sender
            ? `${sender.name} <${sender.email}>`
            : "swinx GmbH <noreply@swinx.de>",
        Destination: { ToAddresses, CcAddresses, BccAddresses: bcc },
        Content: {
            Simple: {
                Subject: { Data: subject, Charset: "UTF-8" },
                Body: {
                    Html: { Data: html, Charset: "UTF-8" },
                    ...(text && { Text: { Data: text, Charset: "UTF-8" } }),
                },
            },
        },
    });
    const response = await emailClient.send(command);
    return response.MessageId;
}
