import {
    TemplateVariables,
    templateNames,
} from "@/app/Emails/templates/posts/actionReminder/TemplateVariables";
import { dayjs } from "@/app/utils";
import { SendMailProps, sesAPIClient } from "..";
import { SignatureTemplateVariables } from "@/app/Emails/templates/_components/SignatureTemplateVariables";
import { grabSignatureProps, defaultSignatureProps, getActionTime } from "./functions";

export async function sendPostActionReminder(props: SendMailProps) {
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
            const postTime = getActionTime({ actionDate: event.date });
            const { company: customerName, profileLink: customerProfileLink } = customer;
            const postContent = event.info?.eventPostContent ?? "Kein Postinhalt gefunden";

            const signatureProps = grabSignatureProps({ projectManager });
            return [
                ...acc,
                {
                    to: influencer.email,
                    templateData: JSON.stringify({
                        name: `${influencer.firstName} ${influencer.lastName}`,
                        postTime,
                        customerName,
                        customerProfileLink: customerProfileLink ?? "Invalid",
                        ...signatureProps,
                        // postContent,
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
            name: "TestName",
            postTime: "00:00",
            customerName: "TestCustomer",
            customerProfileLink: "https://www.swinx.de",
            // postContent: Array(10).fill("blablabla").join("\n"),
            ...defaultSignatureProps,
        } satisfies TemplateVariables & SignatureTemplateVariables),
        bulkTemplateData: templateData,
    });
    return response;
}
