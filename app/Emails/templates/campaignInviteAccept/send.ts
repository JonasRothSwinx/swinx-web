"use server";
import { TemplateVariables, templateNames } from "./TemplateVariables";
import { SESClientSendMail as sesAPIClient } from "../../sesAPI";
import { SendMailProps } from "../types";

export default async function send(props: SendMailProps) {
    const {
        level,
        commonContext: { customer, campaignManager },
        individualContext,
    } = props;
    console.log("Sending invites for level", level, props);

    if (level === "none") return;
    // Check if all required data is present
    if (!customer || !individualContext || !campaignManager) {
        const missingContext = {
            customer: !!customer,
            individualContext: !!individualContext,
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
    const templateData = individualContext.reduce((acc, { influencer }) => {
        if (!influencer) {
            throw new Error("Missing influencer context");
        }
        return [
            ...acc,
            {
                to: influencer.email,
                templateData: JSON.stringify({
                    influencerName: `${influencer.firstName} ${influencer.lastName}`,
                    // customerName: customer.company,
                } satisfies Partial<TemplateVariables>),
            },
        ];
    }, [] as { to: string; templateData: string }[]);
    const fromAdress = `${campaignManager.firstName} ${campaignManager.lastName} <${campaignManager.email}>`;

    const response = await sesAPIClient.sendBulk({
        from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
        templateName,
        defaultTemplateData: JSON.stringify({
            customerName: customer.company,
            influencerName: "{influencer.firstName} {influencer.lastName}",
        } satisfies TemplateVariables),
        bulkTemplateData: templateData,
    });
    return response;
}
