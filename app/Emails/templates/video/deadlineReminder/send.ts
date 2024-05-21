import { SendMailProps } from "../../types";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../../sesAPI";
import { TemplateVariables, defaultParams } from "./VideoDraftDeadlineReminderEmail";
import ErrorLogger from "@/app/ServerFunctions/errorLog";
import { PostReminder } from ".";

export default async function send(props: SendMailProps) {
    const { level, fromAdress, individualContext } = props;
    if (level === "none") {
        return;
    }
    const templateName = PostReminder.levels[level].name;
    const templateData = individualContext.reduce((acc, { event, influencer, customer }) => {
        if (!event || !influencer || !customer) {
            ErrorLogger.log("Missing context");
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
                } satisfies TemplateVariables),
            },
        ];
    }, [] as { to: string; templateData: string }[]);
    const response = await sesAPIClient.sendBulk({
        from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
        templateName,
        defaultTemplateData: JSON.stringify(defaultParams),
        bulkTemplateData: templateData,
    });
}
