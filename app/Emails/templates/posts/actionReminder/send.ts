import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../../sesAPI";
import { SendMailProps } from "../../types";
import { TemplateVariables, defaultParams } from "./PostActionReminderMail";
import { dayjs } from "@/app/utils";
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
        const postTime = dayjs(event.date).format("H:MM");
        const { company: customerName, profileLink: customerProfileLink } = customer;
        const postContent = event.info?.eventPostContent ?? "Kein Postinhalt gefunden";
        return [
            ...acc,
            {
                to: influencer.email,
                templateData: JSON.stringify({
                    name: `${influencer.firstName} ${influencer.lastName}`,
                    postTime,
                    customerName,
                    customerProfileLink: customerProfileLink ?? "Invalid",
                    // postContent,
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
