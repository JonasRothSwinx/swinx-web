import { Prettify } from "@/app/Definitions/types";
import { EmailContextProps } from "@/app/Emails/templates/types";
import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { getTriggerContext } from "./functions/getTriggerContext";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";

export type EmailContextPropsByLevel = {
    [key in Exclude<EmailTriggers.emailLevel, "none">]?: EmailContextProps[];
};

export type EmailTriggerWithContext = Prettify<
    NonNullable<Awaited<ReturnType<typeof getTriggerContext>>>
>;

type GroupedTriggerLevel = {
    [key in Exclude<EmailTriggers.emailLevel, "none">]?: EmailTriggerWithContext[];
};
export type GroupedTrigger = { [key in EmailTriggers.emailTriggerType]?: GroupedTriggerLevel };
export type TriggerGroup = { [key in TimelineEvent.eventType]?: GroupedTrigger };
