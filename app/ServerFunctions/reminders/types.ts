import { EmailContextProps } from "../email/templates/types";
import { EmailTriggers } from "../types/emailTriggers";

export type EmailContextPropsByLevel = {
    [key in Exclude<EmailTriggers.emailLevel, "none">]?: EmailContextProps[];
};
