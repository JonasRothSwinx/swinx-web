import { sendImpulsVideoDeadlineReminder } from "./sendImpulsVideoDeadline";
import { sendInviteActionReminder } from "./sendInviteActionReminder";
import { sendPostActionReminder } from "./sendPostActionReminder";
import { sendPostDeadlineReminder } from "./sendPostDeadlineReminder";
import { sendVideoActionReminder } from "./sendVideoActionReminder";
import { sendVideoDeadlineReminder } from "./sendVideoDeadlineReminder";
import { sendWebinarSpeakerActionReminder } from "./sendWebinarSpeakerActionReminder";

export const sendMail = {
    invites: {
        actionReminder: sendInviteActionReminder,
    },
    impulsVideo: {
        deadlineReminder: sendImpulsVideoDeadlineReminder,
    },
    posts: {
        actionReminder: sendPostActionReminder,
        deadlineReminder: sendPostDeadlineReminder,
    },
    video: {
        actionReminder: sendVideoActionReminder,
        deadlineReminder: sendVideoDeadlineReminder,
    },
    webinarSpeaker: {
        actionReminder: sendWebinarSpeakerActionReminder,
    },
};
