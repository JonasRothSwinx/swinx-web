"use server";
import { TemplateVariables, defaultParams, templateNames } from "./TemplateVariables";
import { SESClientSendMail as sesAPIClient } from "../../sesAPI";
import { SendMailProps } from "../types";
import {
    grabSignatureProps,
    defaultSignatureProps,
    type SignatureTemplateVariables,
} from "@/app/Emails/templates/signature";
import { getTaskPageUrl } from "@/app/utils";

export default async function send(props: SendMailProps) {
    const {
        level,
        commonContext: { customer, projectManager: campaignManager, campaign, assignment },
        individualContext,
    } = props;
    console.log("Sending invites for level", level, props);

    if (level === "none") return;
    // Check if all required data is present
    if (!customer || !individualContext || !campaignManager /* || !campaign  */ || !assignment) {
        const missingContext = {
            customer: !!customer,
            individualContext: !!individualContext,
            campaignManager: !!campaignManager,
            // campaign: !!campaign,
            assignment: !!assignment,
        };
        Object.entries(missingContext).forEach(([key, value]) => {
            if (value) {
                delete missingContext[key as keyof typeof missingContext];
            }
        });
        throw new Error(`Missing email context: ${Object.keys(missingContext).join(", ")}`);
    }
    const templateName = templateNames[level];
    const templateData = individualContext.reduce((acc, { influencer }) => {
        if (!influencer) {
            throw new Error("Missing influencer context");
        }
        const influencerName = `${influencer.firstName} ${influencer.lastName}`;
        const customerName = customer.company;

        const templateVariables: TemplateVariables & SignatureTemplateVariables = {
            influencerName: influencerName,
            customerName,
            taskPageUrl: getTaskPageUrl({
                // influencerId: influencer.id,
                // campaignId: campaign.id,
                assignmentId: assignment.id,
            }),
            ...grabSignatureProps({ projectManager: campaignManager }),
        };
        return [
            ...acc,
            {
                to: influencer.email,
                templateData: JSON.stringify(templateVariables),
            },
        ];
    }, [] as { to: string; templateData: string }[]);
    const fromAdress = `${campaignManager.firstName} ${campaignManager.lastName} <${campaignManager.email}>`;

    const response = await sesAPIClient.sendBulk({
        from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
        templateName,
        defaultTemplateData: JSON.stringify({
            ...defaultSignatureProps,
            ...defaultParams,
        }),
        bulkTemplateData: templateData,
    });
    return response;
}
