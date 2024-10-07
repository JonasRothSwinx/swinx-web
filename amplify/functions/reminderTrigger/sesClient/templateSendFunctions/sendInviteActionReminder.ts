import {
    TemplateVariables,
    templateNames,
    defaultParams,
} from "@/app/Emails/templates/invitesReminder/TemplateVariables";
import { Events } from "@/app/ServerFunctions/types";
import { SendMailProps, sesAPIClient } from "..";
import { SignatureTemplateVariables } from "@/app/Emails/templates/_components/SignatureTemplateVariables";
import {
    grabSignatureProps,
    defaultSignatureProps,
    getActionTime,
    getTaskPageUrl,
} from "./functions";

export async function sendInviteActionReminder(props: SendMailProps) {
    console.log("Sending invite action reminder", JSON.stringify(props, null, 2));
    const { level, fromAdress, bcc, individualContext } = props;
    if (level === "none") {
        return;
    }
    const templateName = templateNames[level];
    const templateData = individualContext.reduce(
        (acc, { event, influencer, customer, projectManager }) => {
            if (!event || !influencer || !customer || !projectManager) {
                console.log("Missing context");
                return acc;
            }
            if (!event.eventTaskAmount || event.eventTaskAmount === 0) {
                console.log("No event task amount found");
                return acc;
            }
            const webinar = event.parentEvent;
            if (!webinar) {
                throw new Error("No webinar found");
            }
            if (!Events.isMultiEvent(webinar)) {
                throw new Error("Webinar is not a full Event");
            }
            const { eventTitle: eventName, info } = webinar;
            if (!info || !info.eventLink || !eventName) {
                throw new Error("No info found");
            }
            const { eventLink } = info;

            const recipientName = `${influencer.firstName} ${influencer.lastName}`;
            const inviteAmount = event.eventTaskAmount.toString();
            const customerName = customer.company;
            const date = event.date;
            if (!date) {
                console.error("No date found");
                return acc;
            }

            const targetAudience = event.targetAudience;
            if (!targetAudience) {
                console.log("No target audience found");
                return acc;
            }

            const filterJobGroups = targetAudience.industry.map((jobGroup) => ({ jobGroup }));
            //join all country entries. Use "und" for the last entry
            const filterCountries = targetAudience.country
                .join(", ")
                .replace(/,([^,]*)$/, " und$1");
            const signatureProps = grabSignatureProps({ projectManager });
            const actionTime = getActionTime({ actionDate: date, dateOnly: true });
            return [
                ...acc,
                {
                    to: influencer.email,
                    templateData: JSON.stringify({
                        name: recipientName,
                        inviteAmount,
                        customerName,
                        eventName,
                        eventLink,
                        filterJobGroups,
                        filterCountries,
                        actionTime,
                        taskPageLink: getTaskPageUrl({ assignmentId: event.assignments[0].id }),
                        ...signatureProps,
                    } satisfies TemplateVariables & SignatureTemplateVariables),
                },
            ];
        },
        [] as { to: string; templateData: string }[],
    );

    const response = await sesAPIClient.sendBulk({
        from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
        bcc,
        templateName: templateName,
        defaultTemplateData: JSON.stringify({
            ...defaultParams,
            ...defaultSignatureProps,
        } satisfies TemplateVariables & SignatureTemplateVariables),
        bulkTemplateData: templateData,
    });
    return response;
}
