import Assignment from "../../types/assignment.js";
import { Candidates } from "../../types/candidates.js";
import { EmailTriggers } from "../../types/emailTriggers.js";
import Influencer from "../../types/influencer.js";
import TimelineEvent from "../../types/timelineEvents.js";
import * as CampaignInvite from "./campaignInvite/";
import * as InviteEvents from "./invitesReminder/";
import * as PostReminder from "./posts/actionReminder/";
import * as PostDeadlineReminder from "./posts/deadlineReminder/";
import * as VideoReminder from "./video/actionReminder/";
import * as VideoDeadlineReminder from "./video/deadlineReminder/";

export interface MailTemplate {
    name: string;
    subjectLine: string;
    html: string;
}

export interface MailTemplateVariables {
    [key: string]: string | { [key: string]: string }[];
}

export type EmailLevelDefinition = {
    [key in Exclude<EmailTriggers.emailLevel, "none">]: MailTemplate;
};
export type SendMailProps = {
    level: EmailTriggers.emailLevel;
    fromAdress?: string;
    context: Partial<EmailContextProps>;
};
export type SendMailFunction = (props: SendMailProps) => Promise<unknown>;
type EmailContextProps = {
    event: TimelineEvent.Event;
    candidates: Candidates.Candidate[];
    assignment: Assignment.AssignmentFull;
    influencer: Influencer.WithContactInfo;
    eventWithInfluencer: [event: TimelineEvent.Event, influencer: Influencer.WithContactInfo][];
    taskDescriptions: string[];
};

export type Template = {
    defaultParams: MailTemplateVariables;
    send: SendMailFunction;
    levels: EmailLevelDefinition;
    templateNames: readonly string[];
};

const templateNames = [
    ...CampaignInvite.templateNames,
    ...InviteEvents.templateNames,
    ...PostReminder.templateNames,
    ...PostDeadlineReminder.templateNames,
    ...VideoReminder.templateNames,
    ...VideoDeadlineReminder.templateNames,
] as const satisfies string[];
export type templateName = (typeof templateNames)[number];

const mailTypes = {
    CampaignInvite: CampaignInvite.default,
    InviteEvents: InviteEvents.default,
    PostActionReminder: PostReminder.default,
    PostDeadlineReminder: PostDeadlineReminder.default,
    VideoActionReminder: VideoReminder.default,
    VideoDeadlineReminder: VideoDeadlineReminder.default,
};

const templateDefinitions = {
    mailTypes,
    templateNames,
};

export { templateNames };
export default templateDefinitions;
