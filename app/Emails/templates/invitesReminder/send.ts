"use server";
import { SendMailProps } from "../types";
import { SESClientSendMail as sesAPIClient } from "../../sesAPI";
// import { defaultParams } from "./InvitesReminderMail";
import { TemplateVariables, templateNames } from "./TemplateVariables";
import { Event, Events } from "@/app/ServerFunctions/types";

//Moved to remindertrigger lambda
export default async function send(props: SendMailProps) {
    //     const { level, fromAdress, individualContext } = props;
    //     if (level === "none") {
    //         return;
    //     }
    //     const templateName = templateNames[level];
    //     const templateData = individualContext.reduce((acc, { event, influencer, customer }) => {
    //         if (!event || !influencer || !customer) {
    //             console.log("Missing context");
    //             return acc;
    //         }
    //         if (!event.eventTaskAmount || event.eventTaskAmount === 0) {
    //             console.log("No event task amount found");
    //             return acc;
    //         }
    //         const webinar = event.parentEvent;
    //         if (!webinar) {
    //             throw new Error("No webinar found");
    //         }
    //         if (!Events.isMultiEvent(webinar)) {
    //             throw new Error("Webinar is not a full Event");
    //         }
    //         const { eventTitle: eventName, info } = webinar;
    //         if (!info || !info.eventLink || !eventName) {
    //             throw new Error("No info found");
    //         }
    //         const { eventLink } = info;
    //         const recipientName = `${influencer.firstName} ${influencer.lastName}`;
    //         const inviteAmount = event.eventTaskAmount.toString();
    //         const customerName = customer.company;
    //         const targetAudience = event.targetAudience;
    //         if (!targetAudience) {
    //             console.log("No target audience found");
    //             return acc;
    //         }
    //         const filterJobGroups = targetAudience.industry.map((jobGroup) => ({ jobGroup }));
    //         //join all country entries. Use "und" for the last entry
    //         const filterCountries = targetAudience.country.join(", ").replace(/,([^,]*)$/, " und$1");
    //         return [
    //             ...acc,
    //             {
    //                 to: influencer.email,
    //                 templateData: JSON.stringify({
    //                     name: recipientName,
    //                     inviteAmount,
    //                     customerName,
    //                     eventName,
    //                     eventLink,
    //                     filterJobGroups,
    //                     filterCountries,
    //                     actionTime: "am Ende aller Tage",
    //                 } satisfies TemplateVariables),
    //             },
    //         ];
    //     }, [] as { to: string; templateData: string }[]);
    //     const response = await sesAPIClient.sendBulk({
    //         from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
    //         templateName: templateName,
    //         defaultTemplateData: JSON.stringify({
    //             customerName: "TestCustomer",
    //             eventName: "TestEvent",
    //             eventLink: "https://www.swinx.de",
    //             filterJobGroups: [
    //                 { jobGroup: "TestJobGroup1" },
    //                 { jobGroup: "TestJobGroup2" },
    //                 { jobGroup: "TestJobGroup3" },
    //             ],
    //             filterCountries: "TestCountry",
    //             name: "testName",
    //             inviteAmount: "5 Millionen",
    //             actionTime: "am Ende aller Tage",
    //         } satisfies TemplateVariables),
    //         bulkTemplateData: templateData,
    //     });
    //     return response;
}
//API version
// export default async function send(props: SendMailProps) {
//     const { level, fromAdress, individualContext } = props;
//     if (level === "none") {
//         return;
//     }
//     const templateName = inviteReminderTemplates.levels[level].name;
//     const requestBody: sesHandlerSendEmailTemplateBulk = {
//         operation: "sendEmailTemplateBulk",
//         bulkEmailData: {
//             from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
//             templateName: templateName,
//             defaultTemplateData: JSON.stringify(defaultParams),
//             emailData: individualContext.reduce((acc, { event, influencer, customer }) => {
//                 if (!event || !influencer || !customer) {
//                     ErrorLogger.log("Missing context");
//                     return acc;
//                 }
//                 if (!event.eventTaskAmount || event.eventTaskAmount === 0) {
//                     ErrorLogger.log("No event task amount found");
//                     return acc;
//                 }
//                 const webinar = event.parentEvent;
//                 if (!webinar) {
//                     throw new Error("No webinar found");
//                 }
//                 if (!TimelineEvent.isMultiEvent(webinar)) {
//                     throw new Error("Webinar is not a full Event");
//                 }
//                 const { eventTitle: eventName, info } = webinar;
//                 if (!info || !info.eventLink || !eventName) {
//                     throw new Error("No info found");
//                 }
//                 const { eventLink } = info;

//                 const recipientName = `${influencer.firstName} ${influencer.lastName}`;
//                 const inviteAmount = event.eventTaskAmount.toString();
//                 const customerName = customer.company;

//                 const targetAudience = event.targetAudience;
//                 if (!targetAudience) {
//                     ErrorLogger.log("No target audience found");
//                     return acc;
//                 }

//                 const filterJobGroups = targetAudience.industry.map((jobGroup) => ({ jobGroup }));
//                 //join all country entries. Use "und" for the last entry
//                 const filterCountries = targetAudience.country.join(", ").replace(/,([^,]*)$/, " und$1");
//                 return [
//                     ...acc,
//                     {
//                         to: influencer.email,
//                         templateData: JSON.stringify({
//                             name: recipientName,
//                             inviteAmount,
//                             customerName,
//                             eventName,
//                             eventLink,
//                             filterJobGroups,
//                             filterCountries,
//                         } satisfies TemplateVariables),
//                     },
//                 ];
//             }, [] as { to: string; templateData: string }[]),
//         },
//     };
//     const response = await sesAPIClient.sendBulk(requestBody);
//     return response;
// }
