import { SendMailProps, Template } from "../../types";
import { SESClientSendMail as sesAPIClient } from "../../../sesAPI";
import {
    TemplateVariables,
    templateNames,
} from "@/app/Emails/templates/posts/deadlineReminder/TemplateVariables";

export default async function send(props: SendMailProps) {
    // const { level, fromAdress, individualContext } = props;
    // if (level === "none") {
    //     return;
    // }
    // const templateName = templateNames[level];
    // const templateData = individualContext.reduce((acc, { event, customer, influencer }) => {
    //     if (!event || !customer || !influencer) {
    //         console.log("Missing context");
    //         return acc;
    //     }
    //     const recipientName = `${influencer.firstName} ${influencer.lastName}`;
    //     const customerName = `${customer.firstName} ${customer.lastName}`;
    //     const topic = event.info?.topic ?? "<Kein Thema angegeben>";
    //     return [
    //         ...acc,
    //         {
    //             to: influencer.email,
    //             templateData: JSON.stringify({
    //                 name: recipientName,
    //                 customerName,
    //                 topic,
    //                 actionTime: "am Ende aller Tage",
    //             } satisfies TemplateVariables),
    //         },
    //     ];
    // }, [] as { to: string; templateData: string }[]);
    // const response = await sesAPIClient.sendBulk({
    //     from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
    //     templateName,
    //     defaultTemplateData: JSON.stringify({
    //         name: "TestName",
    //         customerName: "TestCustomer",
    //         topic: "TestTopic",
    //         actionTime: "am Ende aller Tage",
    //     } satisfies TemplateVariables),
    //     bulkTemplateData: templateData,
    // });
    // return response;
}
