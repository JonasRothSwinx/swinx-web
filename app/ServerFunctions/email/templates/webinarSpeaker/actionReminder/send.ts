import { SendMailProps } from "../../types";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../../sesAPI";
import { defaultParams, TemplateVariables } from "./WebinarSpeakerDateReminder";
import ErrorLogger from "@/app/ServerFunctions/errorLog";
import dayjs from "@/app/utils/configuredDayJs";
import { WebinarSpeakerActionReminder } from ".";

export default async function send(props: SendMailProps) {
    const { level, fromAdress, individualContext } = props;
    if (level === "none") {
        return;
    }
    const templateName = WebinarSpeakerActionReminder.levels[level].name;
    const templateData = individualContext.reduce((acc, { event, customer, influencer }) => {
        if (!event || !customer || !influencer) {
            ErrorLogger.log("Missing context");
            return acc;
        }
        const webinar = event.parentEvent as TimelineEvent.Event;
        if (!webinar || !webinar.date) {
            ErrorLogger.log("Missing webinar context");
            return acc;
        }
        const webinarTitle = webinar.eventTitle ?? "<Kein Webinartitel angegeben>";
        const topic = event.info?.topic ?? "<Kein Thema angegeben>";
        const time = dayjs(event.date).format("H:MM");

        const recipientName = `${influencer.firstName} ${influencer.lastName}`;

        return [
            ...acc,
            {
                to: influencer.email,
                templateData: JSON.stringify({
                    name: `${influencer.firstName} ${influencer.lastName}`,
                    webinarTitle,
                    topic,
                    time,
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
