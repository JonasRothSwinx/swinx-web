// import { default as sendCampignInvite } from "./templates/campaignInvite/send";
import { default as impulsVideoReminder } from "./templates/impulsVideo/send";
import { default as invitesReminder } from "./templates/invitesReminder/send";
import { default as postActionReminder } from "./templates/posts/actionReminder/send";
import { default as postdeadlineReminder } from "./templates/posts/deadlineReminder/send";
import { default as videoActionReminder } from "./templates/video/actionReminder/send";
import { default as videoDeadlineReminder } from "./templates/video/deadlineReminder/send";
import { default as webinarSpeakerActionReminder } from "./templates/webinarSpeaker/actionReminder/send";

export const sendMail = {
    impulsVideo: { deadlineReminder: impulsVideoReminder },
    invites: { actionReminder: invitesReminder },
    posts: { actionReminder: postActionReminder, deadlineReminder: postdeadlineReminder },
    video: { actionReminder: videoActionReminder, deadlineReminder: videoDeadlineReminder },
    webinarSpeaker: { actionReminder: webinarSpeakerActionReminder },
};
