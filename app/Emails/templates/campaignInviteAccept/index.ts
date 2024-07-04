import { renderAsync } from "@react-email/render";
import { EmailLevelDefinition, Template } from "../types";
import send from "./send";
import Email, { subjectLineBase, defaultParams } from "./Email";

const templateNameBase = "CampaignInviteAccept";
export const templates: EmailLevelDefinition = {
    new: {
        name: `${templateNameBase}New`,
        subjectLine: subjectLineBase,
        html: renderAsync(Email({ emailLevel: "new" })),
        text: renderAsync(Email({ emailLevel: "new" }), { plainText: true }),
    },
    reduced: {
        name: `${templateNameBase}Reduced`,
        subjectLine: subjectLineBase,
        html: renderAsync(Email({ emailLevel: "reduced" })),
        text: renderAsync(Email({ emailLevel: "reduced" }), { plainText: true }),
    },
} as const;

export const templateNames = [
    ...Object.values(templates).map((template) => template.name),
] as const;

export { type TemplateVariables, defaultParams } from "./Email";

export const template: Template = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
} as const;
