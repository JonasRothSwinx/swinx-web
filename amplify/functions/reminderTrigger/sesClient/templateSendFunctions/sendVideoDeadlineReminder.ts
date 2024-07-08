import {
    TemplateVariables,
    templateNames,
} from "@/app/Emails/templates/video/deadlineReminder/TemplateVariables";
import { SendMailProps, sesAPIClient } from "..";

export async function sendVideoDeadlineReminder(props: SendMailProps) {
    const { level, fromAdress, individualContext } = props;
    if (level === "none") {
        return;
    }
    const templateName = templateNames[level];
    const templateData = individualContext.reduce((acc, { event, customer, influencer }) => {
        if (!event || !customer || !influencer) {
            console.log("Missing context");
            return acc;
        }
        const recipientName = `${influencer.firstName} ${influencer.lastName}`;
        const customerName = `${customer.firstName} ${customer.lastName}`;
        const topic = event.info?.topic ?? "<Kein Thema angegeben>";
        return [
            ...acc,
            {
                to: influencer.email,
                templateData: JSON.stringify({
                    name: recipientName,
                    customerName,
                    topic,
                } satisfies TemplateVariables),
            },
        ];
    }, [] as { to: string; templateData: string }[]);

    const response = await sesAPIClient.sendBulk({
        from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
        templateName,
        defaultTemplateData: JSON.stringify({
            name: "TestName",
            customerName: "TestCustomer",
            topic: "TestTopic",
        } satisfies TemplateVariables),
        bulkTemplateData: templateData,
    });
    return response;
}
