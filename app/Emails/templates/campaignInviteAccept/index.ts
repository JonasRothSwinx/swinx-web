import { renderAsync } from "@react-email/render";
import { EmailLevelDefinition, Template } from "../types";
import send from "./send";
import Email, { subjectLineBase } from "./Email";
import { templateNames as templateLevelNames, defaultParams } from "./TemplateVariables";

export const templates: EmailLevelDefinition = {
    new: {
        name: `${templateLevelNames.new}`,
        subjectLine: subjectLineBase,
        html: renderAsync(Email({ emailLevel: "new" })),
        text: renderAsync(Email({ emailLevel: "new" }), { plainText: true }),
    },
    reduced: {
        name: `${templateLevelNames.reduced}`,
        subjectLine: subjectLineBase,
        html: renderAsync(Email({ emailLevel: "reduced" })),
        text: renderAsync(Email({ emailLevel: "reduced" }), { plainText: true }),
    },
} as const;

export const templateNames = [
    ...Object.values(templates).map((template) => template.name),
] as const;

export {} from "./Email";
export { type TemplateVariables, defaultParams } from "./TemplateVariables";

export const template: Template = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
} as const;
