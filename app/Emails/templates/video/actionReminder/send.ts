import { SendMailProps } from "../../types";
import { SESClientSendMail as sesAPIClient } from "../../../sesAPI";
// import { defaultParams } from "./VideoActionReminderEmail";
import { TemplateVariables, templateNames } from "./TemplateVariables";
import { dayjs } from "@/app/utils";

export default async function send(props: SendMailProps) {
    // const { level, fromAdress, individualContext } = props;
    // if (level === "none") {
    //     return;
    // }
    // const templateName = templateNames[level];
    // const templateData = individualContext.reduce((acc, { event, influencer, customer }) => {
    //     if (!event || !influencer || !customer) {
    //         console.log("Missing context");
    //         return acc;
    //     }
    //     const postTime = dayjs(event.date).format("H:MM");
    //     const recipientName = `${influencer.firstName} ${influencer.lastName}`;
    //     const customerName = `${customer.firstName} ${customer.lastName}`;
    //     const customerLink = customer.profileLink ?? "<No profile link found>";
    //     const postContent = event.info?.eventPostContent ?? "<No post content found>";
    //     return [
    //         ...acc,
    //         {
    //             to: influencer.email,
    //             templateData: JSON.stringify({
    //                 name: recipientName,
    //                 customerName,
    //                 customerLink,
    //                 // postContent,
    //                 postTime,
    //             } satisfies TemplateVariables),
    //         },
    //     ];
    // }, [] as { to: string; templateData: string }[]);
    // const response = await sesAPIClient.sendBulk({
    //     from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
    //     templateName,
    //     defaultTemplateData: JSON.stringify({
    //         customerLink: "https://www.swinx.de",
    //         customerName: "TestCustomer",
    //         name: "TestName",
    //         postTime: "00:00",
    //     } satisfies TemplateVariables),
    //     bulkTemplateData: templateData,
    // });
    // return response;
}
