"use server";
import { Nullable } from "@/app/Definitions/types";
import { sendMail } from "../../../sesClient";
import { SendMailProps } from "@/app/Emails/templates/types";
import { EmailTriggers, Events } from "@/app/ServerFunctions/types";
import { SendBulkEmailResponse } from "@aws-sdk/client-sesv2";

type SendFunction = (props: SendMailProps) => Promise<SendBulkEmailResponse | void>;
type MailConfig = {
    [key in Events.eventType]: {
        [key in EmailTriggers.emailTriggerType]: Nullable<SendFunction>;
    };
};

const mailConfig: MailConfig = {
    Invites: {
        actionReminder: sendMail.invites.actionReminder,
        // actionReminder: null,
        deadlineReminder: null,
    },
    ImpulsVideo: {
        actionReminder: null,
        deadlineReminder: sendMail.impulsVideo.deadlineReminder,
        // deadlineReminder: null,
    },
    Post: {
        actionReminder: sendMail.posts.actionReminder,
        // actionReminder: null,
        deadlineReminder: sendMail.posts.deadlineReminder,
        // deadlineReminder: null,
    },
    Video: {
        actionReminder: sendMail.video.actionReminder,
        // actionReminder: null,
        deadlineReminder: sendMail.video.deadlineReminder,
        // deadlineReminder: null,
    },
    WebinarSpeaker: {
        actionReminder: sendMail.webinarSpeaker.actionReminder,
        // actionReminder: null,
        deadlineReminder: null,
    },
    Webinar: {
        actionReminder: null,
        deadlineReminder: null,
    },
};

export default async function getMailConfig() {
    return mailConfig;
}
