import {
    Assignment,
    Campaign,
    Customer,
    EmailTriggers,
    Influencer,
    ProjectManager,
    Event,
    Candidate,
    Influencers,
} from "@/app/ServerFunctions/types";

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
    campaign: Campaign;
    event: Event;
    candidates: Candidate[];
    assignment: Assignment;
    influencer: Influencers.WithContactInfo;
    customer: Customer;
    taskDescriptions: string[];
    campaignManager: ProjectManager;
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
