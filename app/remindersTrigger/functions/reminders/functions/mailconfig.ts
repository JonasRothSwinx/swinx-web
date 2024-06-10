"use server";
import { Nullable } from "@/app/Definitions/types";
import templateDefinitions from "@/app/Emails/templates";
import { SendMailProps } from "@/app/Emails/templates/types";
import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";

type SendFunction = (props: SendMailProps) => Promise<unknown>;
type MailConfig = {
    [key in TimelineEvent.eventType]: {
        [key in EmailTriggers.emailTriggerType]: Nullable<SendFunction>;
    };
};

const mailConfig: MailConfig = {
    Invites: {
        actionReminder: templateDefinitions.mailTypes.invites.InviteReminder.send,
        deadlineReminder: null,
    },
    ImpulsVideo: {
        actionReminder: null,
        deadlineReminder: templateDefinitions.mailTypes.impulsVideo.ImpulsVideoDeadlineReminder.send,
    },
    Post: {
        actionReminder: templateDefinitions.mailTypes.post.PostActionReminder.send,
        deadlineReminder: templateDefinitions.mailTypes.post.PostDeadlineReminder.send,
    },
    Video: {
        actionReminder: templateDefinitions.mailTypes.video.VideoActionReminder.send,
        deadlineReminder: templateDefinitions.mailTypes.video.VideoDeadlineReminder.send,
    },
    WebinarSpeaker: {
        actionReminder: templateDefinitions.mailTypes.webinarSpeaker.WebinarSpeakerActionReminder.send,
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
