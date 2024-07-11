import { SendMailProps } from "../../types";
import { SESClientSendMail as sesAPIClient } from "../../../sesAPI";
// import { defaultParams } from "./VideoDraftDeadlineReminderEmail";
import { TemplateVariables, templateNames } from "./TemplateVariables";

export default async function send(props: SendMailProps) {
    const { level, fromAdress, individualContext } = props;
    if (level === "none") {
        return;
    }
    const templateName = templateNames[level];
    const templateData = individualContext.reduce((acc, { event, influencer, customer }) => {
        if (!event || !influencer || !customer) {
            console.log("Missing context");
            return acc;
        }
        const recipientName = `${influencer.firstName} ${influencer.lastName}`;
        const customerName = `${customer.firstName} ${customer.lastName}`;
        const topic = event.info?.topic ?? "Kein Thema gefunden";
        return [
            ...acc,
            {
                to: influencer.email,
                templateData: JSON.stringify({
                    name: recipientName,
                    customerName,
                    topic,
                    actionTime: "am Ende aller Tage",
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
            actionTime: "am Ende aller Tage",
        } satisfies TemplateVariables),
        bulkTemplateData: templateData,
    });
}
