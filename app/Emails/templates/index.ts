import { type Template } from "./types";
import * as CampaignInvite from "./campaignInvite/";
import * as InviteEvents from "./invitesReminder/";
import * as PostReminder from "./posts/actionReminder/";
import * as PostDeadlineReminder from "./posts/deadlineReminder/";
import * as VideoReminder from "./video/actionReminder/";
import * as VideoDeadlineReminder from "./video/deadlineReminder/";
import * as WebinarSpeakerActionReminder from "./webinarSpeaker/actionReminder/";
import * as ImpulsVideoReminder from "./impulsVideo";
import * as CampaignInviteAccept from "./campaignInviteAccept";
import * as CampaignInviteReject from "./campaignInviteReject";

const templateNames = [
    ...CampaignInvite.templateNames,
    ...InviteEvents.templateNames,
    ...PostReminder.templateNames,
    ...PostDeadlineReminder.templateNames,
    ...VideoReminder.templateNames,
    ...VideoDeadlineReminder.templateNames,
    ...WebinarSpeakerActionReminder.templateNames,
    ...ImpulsVideoReminder.templateNames,
    ...CampaignInviteAccept.templateNames,
    ...CampaignInviteReject.templateNames,
] as const satisfies string[];
export type templateName = (typeof templateNames)[number];

const mailTypes = {
    campaignInvite: {
        CampaignInvite: CampaignInvite.default,
    },
    impulsVideo: {
        ImpulsVideoDeadlineReminder: ImpulsVideoReminder.default,
    },
    invites: {
        InviteReminder: InviteEvents.default,
    },
    post: {
        PostActionReminder: PostReminder.default,
        PostDeadlineReminder: PostDeadlineReminder.default,
    },
    video: {
        VideoActionReminder: VideoReminder.default,
        VideoDeadlineReminder: VideoDeadlineReminder.default,
    },
    webinarSpeaker: {
        WebinarSpeakerActionReminder: WebinarSpeakerActionReminder.default,
    },
    campaignInviteAccept: {
        CampaignInviteAccept: CampaignInviteAccept.template,
    },
    campaignInviteReject: {
        CampaignInviteReject: CampaignInviteReject.template,
    },
};

const mailTypesFlat: { [key: string]: Template } = Object.values(mailTypes).reduce(
    (acc, mailType) => {
        return { ...acc, ...mailType };
    },
    {},
);

const templateDefinitions = {
    mailTypes,
    mailTypesFlat,
    templateNames,
};

export { templateNames };
export * as Types from "./types";
export default templateDefinitions;
