import { Prettify } from "@/app/Definitions/types";
import { EmailContextProps } from "@/app/Emails/templates/types";
import { EmailTriggers, Events } from "@/app/ServerFunctions/types";
import { EmailTriggerData } from "../database/types";
// import { getTriggerContext } from "./functions/getTriggerContext";

export type EmailContextPropsByLevel = {
    [key in Exclude<EmailTriggers.emailLevel, "none">]?: EmailContextProps[];
};

// export type EmailTriggerWithContext = Prettify<
//     NonNullable<Awaited<ReturnType<typeof getTriggerContext>>>
// >;

type GroupedTriggerLevel = {
    [key in Exclude<EmailTriggers.emailLevel, "none">]?: EmailTriggerData[];
};
export type GroupedTrigger = { [key in EmailTriggers.emailTriggerType]?: GroupedTriggerLevel };
export type TriggerGroup = { [key in Events.EventType]?: GroupedTrigger };
