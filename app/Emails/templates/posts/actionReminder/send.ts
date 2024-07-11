import { SESClientSendMail as sesAPIClient } from "../../../sesAPI";
import { SendMailProps } from "../../types";
// import { defaultParams } from "./PostActionReminderMail";
import {
    TemplateVariables,
    templateNames,
} from "@/app/Emails/templates/posts/actionReminder/TemplateVariables";
import { dayjs } from "@/app/utils";

export default async function send(props: SendMailProps) {
    const { level, fromAdress, individualContext } = props;

    if (level === "none") {
        return;
    }
    const templateName = templateNames[level];
    const templateData = individualContext.reduce((acc, { event, influencer, customer }) => {
        if (!event || !influencer || !customer) {
            console.log("Missing context");
            return acc;
        }
        const postTime = dayjs(event.date).format("H:MM");
        const { company: customerName, profileLink: customerProfileLink } = customer;
        const postContent = event.info?.eventPostContent ?? "Kein Postinhalt gefunden";
        return [
            ...acc,
            {
                to: influencer.email,
                templateData: JSON.stringify({
                    name: `${influencer.firstName} ${influencer.lastName}`,
                    postTime,
                    customerName,
                    customerProfileLink: customerProfileLink ?? "Invalid",
                    // postContent,
                } satisfies TemplateVariables),
            },
        ];
    }, [] as { to: string; templateData: string }[]);
    const response = await sesAPIClient.sendBulk({
        from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
        templateName,
        defaultTemplateData: JSON.stringify({
            name: "TestName",
            postTime: "00:00",
            customerName: "TestCustomer",
            customerProfileLink: "https://www.swinx.de",
            // postContent: Array(10).fill("blablabla").join("\n"),
        } satisfies TemplateVariables),
        bulkTemplateData: templateData,
    });
    return response;
}
