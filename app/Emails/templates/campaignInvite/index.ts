import { renderAsync } from "@react-email/render";
import { EmailLevelDefinition, Template } from "../types";
import CampaignInviteEmail, { defaultParams, subjectLineBase } from "./CampaignInviteEmail";
import send from "./send";
import { templateNames as templateLevelNames } from "./TemplateVariables";

export const templates: EmailLevelDefinition = {
    new: {
        name: `${templateLevelNames.new}`,
        subjectLine: subjectLineBase,
        html: renderAsync(CampaignInviteEmail({ emailLevel: "new" })),
        text: renderAsync(CampaignInviteEmail({ emailLevel: "new" }), { plainText: true }),
    },
    reduced: {
        name: `${templateLevelNames.reduced}`,
        subjectLine: subjectLineBase,
        html: renderAsync(CampaignInviteEmail({ emailLevel: "reduced" })),
        text: renderAsync(CampaignInviteEmail({ emailLevel: "reduced" }), { plainText: true }),
    },
} as const;

export const templateNames = [
    ...Object.values(templates).map((template) => template.name),
] as const;

const inviteEmails: Template = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
} as const;
export type templateVariables = typeof defaultParams;
export default inviteEmails;
