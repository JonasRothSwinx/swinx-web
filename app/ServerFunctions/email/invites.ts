"use server";
import {
    ListTemplatesCommand,
    ListTemplatesCommandInput,
    SESClient,
    SendBulkTemplatedEmailCommand,
    SendBulkTemplatedEmailCommandInput,
    SendEmailCommand,
    SendEmailCommandInput,
    SendTemplatedEmailCommand,
    SendTemplatedEmailCommandInput,
} from "@aws-sdk/client-ses";
import client from "./sesClient";
import Influencer from "../types/influencer";

export async function sendTestMail() {
    const input: SendEmailCommandInput = {
        Destination: { ToAddresses: ["jonasroth1@gmail.com"] },
        Source: "swinx GmbH <noReply@swinx.de>",
        Message: {
            Body: { Html: { Data: "<h1>hi!</h1>" }, Text: { Data: "hi!" } },
            Subject: { Data: "Test mail, please ignore" },
        },
    };
    const mail = new SendEmailCommand(input);
    console.log({ input, mail });
    const response = await client.send(mail);
    console.log({ response });
}
export async function sendTestTemplate() {
    const input: SendTemplatedEmailCommandInput = {
        Destination: { ToAddresses: ["jonasroth1@gmail.com"] },
        Source: "swinx GmbH <noReply@swinx.de>",
        Template: "templatesTest",
        TemplateData: JSON.stringify({ name: "testvalue" }),
    };
    const mail = new SendTemplatedEmailCommand(input);
    console.log({ input, mail });
    const response = await client.send(mail);
    console.log({ response });
}
interface TestBulkMailProps {
    candidates: Influencer.Candidate[];
}
export async function sendTestBulkTemplate(props: TestBulkMailProps) {
    const input: SendBulkTemplatedEmailCommandInput = {
        Destinations: props.candidates.map((candidate) => {
            return {
                Destination: { ToAddresses: [candidate.influencer.details.email] },
                ReplacementTemplateData: JSON.stringify({
                    name: `${candidate.influencer.firstName} ${candidate.influencer.lastName}`,
                }),
            };
        }),
        DefaultTemplateData: JSON.stringify({
            // Name: "name",
            name: "Error 418: Teapot",
        }),
        Source: "swinx GmbH <noReply@swinx.de>",
        Template: "templatesTest",
    };
    const mail = new SendBulkTemplatedEmailCommand(input);
    console.log({ input, mail });
    const response = await client.send(mail);
    return { response: JSON.parse(JSON.stringify(response)) };
    // const responses = await Promise.all(
    //     props.candidates.map(async (recipient) => {
    //         const input: SendTemplatedEmailCommandInput = {
    //             Destination: { ToAddresses: ["jonasroth1@gmail.com"] },
    //             Source: "swinx GmbH <noReply@swinx.de>",
    //             Template: "templatesTest",
    //             TemplateData: JSON.stringify({
    //                 name: `${recipient.influencer.firstName} ${recipient.influencer.lastName}`,
    //             }),
    //         };
    //         const mail = new SendTemplatedEmailCommand(input);
    //         // console.log({ input, mail });
    //         const response = await client.send(mail);
    //         return { input, response };
    //     })
    // );
    // console.log({ responses });
    // return { response: responses.map((response) => JSON.parse(JSON.stringify(response))) };
}
