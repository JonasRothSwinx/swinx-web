import { Event, Events } from "@/app/ServerFunctions/types";
import {
    TemplateVariables,
    templateNames,
} from "@/app/Emails/templates/webinarSpeaker/actionReminder/TemplateVariables";
import { dayjs } from "@/app/utils";

import { SendMailProps, sesAPIClient } from "..";

export async function sendWebinarSpeakerActionReminder(props: SendMailProps) {
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
        const webinar = event.parentEvent as Event;
        if (!webinar || !webinar.date) {
            console.log("Missing webinar context");
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
        defaultTemplateData: JSON.stringify({
            name: "TestName",
            webinarTitle: "TestWebinar",
            topic: "TestTopic",
            time: "00:00",
        } satisfies TemplateVariables),
        bulkTemplateData: templateData,
    });
}
