import { renderAsync } from "@react-email/render";
import { EmailLevelDefinition, Template } from "../types";
import Email, { defaultParams, subjectLineBase } from "./Email";
import send from "./send";
import { templateNames as templateLevelNames } from "./TemplateVariables";

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

const templateData: Template = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
} as const;
export default templateData;
