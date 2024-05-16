import { EmailContextProps } from "@/app/Emails/templates/types";
import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";

export type EmailContextPropsByLevel = {
    [key in Exclude<EmailTriggers.emailLevel, "none">]?: EmailContextProps[];
};
