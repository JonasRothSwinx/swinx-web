import Assignment from "@/app/ServerFunctions/types/assignment.js";
import Campaign from "@/app/ServerFunctions/types/campaign.js";
import { Candidates } from "@/app/ServerFunctions/types/candidates.js";
import Customer from "@/app/ServerFunctions/types/customer.js";
import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers.js";
import Influencer from "@/app/ServerFunctions/types/influencer.js";
import ProjectManagers from "@/app/ServerFunctions/types/projectManagers.jsx";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent.js";

export interface MailTemplate {
    name: string;
    subjectLine: string;
    html: string | Promise<string>;
    text: string | Promise<string>;
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
    bcc?: string[];
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
    campaignManager: ProjectManagers.ProjectManager;
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
