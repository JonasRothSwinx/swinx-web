import htmlNew from "./new.html";
import htmlReduced from "./reduced.html";
import { MailTemplate, SendMailProps, Template } from "../../../templates";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../../sesAPI";

type TemplateVariables = {
    name: string;
};
const templateBaseName = "PostDraftDeadlineReminder";
const subjectLineBase = "Erinnerung: Entwurf für Beitrag";

const templateNew = {
    name: `${templateBaseName}New`,
    subjectLine: subjectLineBase,
    html: htmlNew,
} as const satisfies MailTemplate;

const templateReduced = {
    name: `${templateBaseName}Reduced`,
    subjectLine: `${subjectLineBase} (reduced)`,
    html: htmlReduced,
} as const satisfies MailTemplate;

export const templateNames = [templateNew.name, templateReduced.name] as const;

const defaultParams: TemplateVariables = {
    name: "testName",
};

const PostReminder = {
    defaultParams,
    send,
    levels: {
        new: templateNew,
        reduced: templateReduced,
    },
    templateNames,
} as const satisfies Template;

export default PostReminder;

async function send(props: SendMailProps) {
    const {
        level,
        fromAdress,
        context: { eventWithInfluencer },
    } = props;
    if (!eventWithInfluencer) {
        throw new Error("Missing context");
    }
    if (level === "none") {
        return;
    }
    const templateName = PostReminder.levels[level].name;
    const requestBody: sesHandlerSendEmailTemplateBulk = {
        operation: "sendEmailTemplateBulk",
        bulkEmailData: {
            from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
            templateName: templateName,
            defaultTemplateData: JSON.stringify(defaultParams),
            emailData: eventWithInfluencer.reduce((acc, [event, influencer]) => {
                if (!event.eventTaskAmount || event.eventTaskAmount === 0) return acc;
                return [
                    ...acc,
                    {
                        to: influencer.email,
                        templateData: JSON.stringify({
                            name: `${influencer.firstName} ${influencer.lastName}`,
                        } satisfies Partial<TemplateVariables>),
                    },
                ];
            }, [] as { to: string; templateData: string }[]),
        },
    };
    const response = await sesAPIClient.sendBulk(requestBody);
    return response;
}
