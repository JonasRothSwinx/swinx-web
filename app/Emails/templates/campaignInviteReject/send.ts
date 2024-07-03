"use server";
import { TemplateVariables, template, defaultParams } from ".";
import sesAPIClient from "../../sesAPI";
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
    const templateName = template.levels[level].name;
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
                    customerName: customer.company,
                } satisfies TemplateVariables),
            },
        ];
    }, [] as { to: string; templateData: string }[]);
    const fromAdress = `${campaignManager.firstName} ${campaignManager.lastName} <${campaignManager.email}>`;

    const response = await sesAPIClient.sendBulk({
        from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
        templateName,
        defaultTemplateData: JSON.stringify(defaultParams),
        bulkTemplateData: templateData,
    });
    return response;
}
