import { Event, Events } from "@/app/ServerFunctions/types";
import {
    TemplateVariables,
    templateNames,
} from "@/app/Emails/templates/webinarSpeaker/actionReminder/TemplateVariables";
import { dayjs } from "@/app/utils";

import { SendMailProps, sesAPIClient } from "..";
import { grabSignatureProps, defaultSignatureProps, getTaskPageUrl } from "./functions";
import { SignatureTemplateVariables } from "@/app/Emails/templates/_components/SignatureTemplateVariables";

export async function sendWebinarSpeakerActionReminder(props: SendMailProps) {
    const { level, fromAdress, bcc, individualContext } = props;
    if (level === "none") {
        return;
    }
    const templateName = templateNames[level];
    const templateData = individualContext.reduce(
        (acc, { event, customer, influencer, projectManager }) => {
            if (!event || !customer || !influencer || !projectManager) {
                console.log("Missing context");
                return acc;
            }
            const webinar = event.parentEvent as Event;
            if (!webinar || !webinar.date) {
                console.log("Missing webinar context");
                return acc;
            }
            const webinarTitle = webinar.eventTitle ?? "<Kein Webinartitel angegeben>";
            const topic = event.eventTitle ?? "<Kein Thema angegeben>";
            const time = dayjs(event.date).format("H:MM");

            const recipientName = `${influencer.firstName} ${influencer.lastName}`;

            const signatureProps = grabSignatureProps({ projectManager });

            return [
                ...acc,
                {
                    to: influencer.email,
                    templateData: JSON.stringify({
                        name: recipientName,
                        webinarTitle,
                        topic,
                        time,
                        taskPageLink: getTaskPageUrl({ assignmentId: event.assignments[0].id }),
                        ...signatureProps,
                    } satisfies TemplateVariables & SignatureTemplateVariables),
                },
            ];
        },
        [] as { to: string; templateData: string }[],
    );

    const response = await sesAPIClient.sendBulk({
        from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
        bcc,
        templateName,
        defaultTemplateData: JSON.stringify({
            name: "TestName",
            webinarTitle: "TestWebinar",
            topic: "TestTopic",
            time: "00:00",
            taskPageLink: "https://www.swinx.de",
            ...defaultSignatureProps,
        } satisfies TemplateVariables & SignatureTemplateVariables),
        bulkTemplateData: templateData,
    });
    return response;
}
