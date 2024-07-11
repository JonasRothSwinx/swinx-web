import {
    TemplateVariables,
    templateNames,
    defaultParams,
} from "@/app/Emails/templates/video/deadlineReminder/TemplateVariables";
import { SendMailProps, sesAPIClient } from "..";
import { grabSignatureProps, defaultSignatureProps, getActionTime } from "./functions";
import { SignatureTemplateVariables } from "@/app/Emails/templates/_components/SignatureTemplateVariables";

export async function sendVideoDeadlineReminder(props: SendMailProps) {
    const { level, fromAdress, bcc, individualContext } = props;
    if (level === "none") {
        return;
    }
    const templateName = templateNames[level];
    const templateData = individualContext.reduce(
        (acc, { event, customer, influencer, projectManager }) => {
            if (!event || !customer || !influencer || !projectManager) {
                console.log("Missing context");
                return acc;
            }
            const recipientName = `${influencer.firstName} ${influencer.lastName}`;
            const customerName = `${customer.company}`;
            const topic = event.info?.topic ?? "<Kein Thema angegeben>";
            const actionTime = getActionTime({ actionDate: event.info?.draftDeadline });

            const signatureProps = grabSignatureProps({ projectManager });
            return [
                ...acc,
                {
                    to: influencer.email,
                    templateData: JSON.stringify({
                        name: recipientName,
                        customerName,
                        topic,
                        actionTime,
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
        templateName,
        defaultTemplateData: JSON.stringify({
            ...defaultParams,
            ...defaultSignatureProps,
        } satisfies TemplateVariables & SignatureTemplateVariables),
        bulkTemplateData: templateData,
    });
    return response;
}
