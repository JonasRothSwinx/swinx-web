import { SendMailProps } from "../../types";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../../sesAPI";
import { TemplateVariables, defaultParams } from "./VideoActionReminderEmail";
import dayjs from "@/app/utils/configuredDayJs";
import ErrorLogger from "@/app/ServerFunctions/errorLog";
import { VideoReminder } from ".";

export default async function send(props: SendMailProps) {
    const { level, fromAdress, individualContext } = props;
    if (level === "none") {
        return;
    }
    const templateName = VideoReminder.levels[level].name;
    const templateData = individualContext.reduce((acc, { event, influencer, customer }) => {
        if (!event || !influencer || !customer) {
            ErrorLogger.log("Missing context");
            return acc;
        }
        const postTime = dayjs(event.date).format("H:MM");
        const recipientName = `${influencer.firstName} ${influencer.lastName}`;
        const customerName = `${customer.firstName} ${customer.lastName}`;
        const customerLink = customer.profileLink ?? "<No profile link found>";
        const postContent = event.info?.eventPostContent ?? "<No post content found>";
        return [
            ...acc,
            {
                to: influencer.email,
                templateData: JSON.stringify({
                    name: recipientName,
                    customerName,
                    customerLink,
                    postContent,
                    postTime,
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
    return response;
}
