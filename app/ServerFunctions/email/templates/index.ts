import Assignment from "../../types/assignment.js";
import { Candidates } from "../../types/candidates.js";
import { EmailTriggers } from "../../types/emailTriggers.js";
import TimelineEvent from "../../types/timelineEvents.js";
import inviteEmails from "./campaignInvite/index.js";

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
export type Template = {
    defaultParams: MailTemplateVariables;
    send: SendMailFunction;
    levels: EmailLevelDefinition;
    templateNames: string[];
};
export type SendMailProps = { level: EmailTriggers.emailLevel; props: EmailContextProps };
export type SendMailFunction = (props: SendMailProps) => void;
type EmailContextProps = {
    event?: TimelineEvent.Event;
    candidates?: Candidates.Candidate[];
    assignment?: Assignment.AssignmentFull;
    taskDescriptions: string[];
};

const templateNames: string[] = [...inviteEmails.templateNames];

// const templateNames = { inviteTemplate: inviteTemplate.template.name } as const;
export { templateNames };
export default templateDefinitions;
