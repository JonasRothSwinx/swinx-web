import Assignment from "../../types/assignment.js";
import Campaign from "../../types/campaign.js";
import { Candidates } from "../../types/candidates.js";
import Customer from "../../types/customer.js";
import { EmailTriggers } from "../../types/emailTriggers.js";
import Influencer from "../../types/influencer.js";
import TimelineEvent from "../../types/timelineEvents.js";

export interface MailTemplate {
    name: string;
    subjectLine: string;
    html: string | Promise<string>;
    text?: string | Promise<string>;
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
    commonContext: Partial<EmailContextProps>;
    individualContext: Partial<EmailContextProps>[];
};
export type SendMailFunction = (props: SendMailProps) => Promise<unknown>;

export type EmailContextProps = {
    campaign: Campaign.Campaign;
    event: TimelineEvent.Event;
    candidates: Candidates.Candidate[];
    assignment: Assignment.AssignmentFull;
    influencer: Influencer.WithContactInfo;
    customer: Customer.Customer;
    taskDescriptions: string[];
};

export type Template = {
    defaultParams: MailTemplateVariables;
    send: SendMailFunction;
    levels: EmailLevelDefinition;
    templateNames: readonly string[];
};

export type EmailProps = {
    emailLevel: Exclude<EmailTriggers.emailLevel, "none">;
    debug?: boolean;
};
export type DebugToggle = {
    debug?: boolean;
};
