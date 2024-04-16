import Assignment from "../../types/assignment.js";
import { Candidates } from "../../types/candidates.js";
import { EmailTriggers } from "../../types/emailTriggers.js";
import TimelineEvent from "../../types/timelineEvents.js";
import * as CampaignInvite from "./campaignInvite/";

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
    props: Partial<EmailContextProps>;
};
export type SendMailFunction = (props: SendMailProps) => Promise<unknown>;
type EmailContextProps = {
    event: TimelineEvent.Event;
    candidates: Candidates.Candidate[];
    assignment: Assignment.AssignmentFull;
    taskDescriptions: string[];
};

export type Template = {
    defaultParams: MailTemplateVariables;
    send: SendMailFunction;
    levels: EmailLevelDefinition;
    templateNames: readonly string[];
};

const templateNames: typeof CampaignInvite.default.templateNames = [
    ...CampaignInvite.default.templateNames,
] as const;
export type templateName = (typeof templateNames)[number];

const mailTypes = {
    CampaignInvite: CampaignInvite.default,
};

const templateDefinitions = {
    mailTypes,
    templateNames,
};

export { templateNames };
export default templateDefinitions;
