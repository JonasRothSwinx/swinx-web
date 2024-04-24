import { MailTemplate, SendMailProps, Template } from "../types";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../sesAPI";
import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import InvitesReminderMail, { defaultParams, subjectLineBase, TemplateVariables } from "./InvitesReminderMail";
import { renderAsync } from "@react-email/render";
import { Timeline } from "@mui/lab";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";

const templateBaseName = "InvitesReminder";

const templates: { [key in Exclude<EmailTriggers.emailLevel, "none">]: MailTemplate } = {
    new: {
        name: `${templateBaseName}New`,
        subjectLine: subjectLineBase,
        html: renderAsync(InvitesReminderMail({ emailLevel: "new" })),
        text: renderAsync(InvitesReminderMail({ emailLevel: "new" }), { plainText: true }),
    },
    reduced: {
        name: `${templateBaseName}Reduced`,
        subjectLine: subjectLineBase,
        html: renderAsync(InvitesReminderMail({ emailLevel: "reduced" })),
        text: renderAsync(InvitesReminderMail({ emailLevel: "reduced" }), { plainText: true }),
    },
} as const;
export const templateNames = [...Object.values(templates).map((template) => template.name)] as const;

const inviteReminderTemplates: Template = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
};
export default inviteReminderTemplates;

type personalVariables = Pick<TemplateVariables, "name" | "inviteAmount" | "customerName" | "eventName" | "eventLink">;
async function send(props: SendMailProps) {
    const {
        level,
        fromAdress,
        context: { eventWithInfluencer, customer },
    } = props;
    if (!eventWithInfluencer || !customer) {
        throw new Error("Missing context");
    }
    if (level === "none") {
        return;
    }
    const templateName = inviteReminderTemplates.levels[level].name;
    const requestBody: sesHandlerSendEmailTemplateBulk = {
        operation: "sendEmailTemplateBulk",
        bulkEmailData: {
            from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
            templateName: templateName,
            defaultTemplateData: JSON.stringify(defaultParams),
            emailData: eventWithInfluencer.reduce((acc, [event, influencer]) => {
                if (!event.eventTaskAmount || event.eventTaskAmount === 0) return acc;
                const webinar = event.relatedEvents.parentEvent;
                if (!webinar) {
                    throw new Error("No webinar found");
                }
                if (!TimelineEvent.isMultiEvent(webinar)) {
                    throw new Error("Webinar is not a full Event");
                }
                const { eventTitle: eventName, info } = webinar;
                if (!info || !info.eventLink || !eventName) {
                    throw new Error("No info found");
                }
                const { eventLink } = info;
                return [
                    ...acc,
                    {
                        to: influencer.email,
                        templateData: JSON.stringify({
                            name: `${influencer.firstName} ${influencer.lastName}`,
                            inviteAmount: event.eventTaskAmount.toString(),
                            customerName: customer.company,
                            eventName,
                            eventLink,
                        } satisfies personalVariables),
                    },
                ];
            }, [] as { to: string; templateData: string }[]),
        },
    };
    const response = await sesAPIClient.sendBulk(requestBody);
    return response;
}
