"use server";
import {
    BulkEmailEntry,
    SendBulkEmailCommand,
    SendBulkEmailCommandInput,
    SendEmailCommand,
    SendEmailCommandInput,
} from "@aws-sdk/client-sesv2";
import client from "./sesClient";
import Influencer from "../types/influencer";
import { inviteTemplateVariables } from "./templates/invites/invitesTemplate";
import { templateNames } from "./templates/templates";
import emailClient from "./emailClient";

export async function sendTestMail() {
    const input: SendEmailCommandInput = {
        Destination: { ToAddresses: ["jonasroth1@gmail.com"] },
        FromEmailAddress: "swinx GmbH <noReply@swinx.de>",
        Content: {
            Simple: {
                Body: { Html: { Data: "<h1>hi!</h1>" }, Text: { Data: "hi!" } },
                Subject: { Data: "Test mail, please ignore" },
            },
        },
    };
    const mail = new SendEmailCommand(input);
    console.log({ input, mail });
    const response = await client.send(mail);
    console.log({ response });
}
export async function sendTestTemplate() {
    const input: SendEmailCommandInput = {
        Destination: { ToAddresses: ["jonasroth1@gmail.com"] },
        FromEmailAddress: "swinx GmbH <noReply@swinx.de>",
        Content: {
            Template: {
                TemplateName: "CampaignInvite",
                TemplateData: JSON.stringify({
                    name: "testName",
                    assignments: "Fliege zum Mars",
                    honorar: "10.000.000.000€",
                    linkBase: "http://localhost:3000/Response?",
                    linkYes: "q=Yes",
                    linkNo: "q=No",
                }),
            },
        },
        ConfigurationSetName: "Default",
    };
    const mail = new SendEmailCommand(input);
    console.log({ input, mail });
    const response = await client.send(mail);
    console.log({ response });
}
interface TestBulkMailProps {
    candidates: Influencer.Candidate[];
}
export async function sendTestBulkTemplate(props: TestBulkMailProps) {
    const input: SendBulkEmailCommandInput = {
        BulkEmailEntries: props.candidates.map<BulkEmailEntry>((candidate) => {
            return {
                Destination: { ToAddresses: [candidate.influencer.details.email] },
                ReplacementEmailContent: {
                    ReplacementTemplate: {
                        ReplacementTemplateData: JSON.stringify({
                            name: `${candidate.influencer.firstName} ${candidate.influencer.lastName}`,
                        }),
                    },
                },
            } satisfies BulkEmailEntry;
        }),
        DefaultContent: {
            Template: {
                TemplateName: "templatesTest",
                TemplateData: JSON.stringify({
                    // Name: "name",
                    name: "Error 418: Teapot",
                }),
            },
        },

        FromEmailAddress: "swinx GmbH <noReply@swinx.de>",
    };
    const mail = new SendBulkEmailCommand(input);
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
interface BulkCampaignInviteProps {
    candidates: Influencer.Candidate[];
    variables: Partial<inviteTemplateVariables>;
}
export async function sendBulkCampaignInvite(props: BulkCampaignInviteProps) {
    await emailClient.templates.update();
    console.log(JSON.stringify(props, null, " "));
    const input: SendBulkEmailCommandInput = {
        BulkEmailEntries: props.candidates.map<BulkEmailEntry>((candidate) => {
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
                Destination: { ToAddresses: [candidate.influencer.details.email] },
                ReplacementEmailContent: {
                    ReplacementTemplate: {
                        ReplacementTemplateData: JSON.stringify({
                            name: `${candidate.influencer.firstName} ${candidate.influencer.lastName}`,
                            linkYes: `q=${encodedParametersYes}`,
                            linkNo: `q=${encodedParametersNo}`,
                        } satisfies Partial<inviteTemplateVariables>),
                    },
                },
            } satisfies BulkEmailEntry;
        }),
        DefaultContent: {
            Template: {
                TemplateName: templateNames.inviteTemplate,
                TemplateData: JSON.stringify({
                    // Name: "name",
                    name: "Error 418: Teapot",
                    assignments: props.variables.assignments ?? [
                        { assignmentDescription: "Make Tea" },
                    ],
                    honorar: props.variables.honorar ?? "<Honorar nicht definiert>",
                    linkBase: "http://localhost:3000/Response?",
                    linkYes: "q=Yes",
                    linkNo: "q=No",
                } satisfies inviteTemplateVariables),
            },
        },
        ConfigurationSetName: "Default",
        FromEmailAddress: "swinx GmbH <noReply@swinx.de>",
    };
    const mail = new SendBulkEmailCommand(input);
    // console.log({ input, mail });
    const response = await client.send(mail);
    return { response: JSON.parse(JSON.stringify(response)) };
}
