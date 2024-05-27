"use server";

// import dataClient from "@/app/ServerFunctions/database";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
// import database from "@/app/ServerFunctions/database/dbOperations";
import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";
import templateDefinitions from "@/app/Emails/templates";
import Influencer from "@/app/ServerFunctions/types/influencer";
import emailClient from "@/app/Emails";
import { SendMailProps } from "@/app/Emails/templates/types";
import { EmailContextPropsByLevel, EmailTriggerWithContext, GroupedTrigger } from "../types";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Customer from "@/app/ServerFunctions/types/customer";
import ErrorLogger from "@/app/ServerFunctions/errorLog";
import { Prettify } from "@/app/Definitions/types";
import { getEmailTriggers } from "./getEmailTriggers";
import defineContext from "./defineContext";
import groupTriggers from "./groupTriggers";
import handleTriggers from "./handleTriggers";
// import dayjs from "@/app/utils/configuredDayJs";
// const triggerHandlers: {
//     [key in TimelineEvent.eventType]: (triggers: GroupedTrigger) => Promise<unknown>;
// } = {
//     Invites: handleInviteMails,
//     Post: handlePostMails,
//     Video: handleVideoMails,
//     WebinarSpeaker: handleWebinarSpeakerMails,
//     Webinar: handleWebinarMails,
// };
const devBranches = ["sandbox", "dev"];
export default async function startReminderRoutine(): Promise<boolean> {
    console.log("Starting reminder routine");
    console.log(`In environment ${process.env.NODE_ENV}. Current time: ${dayjs().format("YYYY-MM-DD HH:mm")}`);
    console.log(process.env);

    const awsBranch = process.env.AWS_BRANCH;
    if (!awsBranch || typeof awsBranch !== "string") {
        console.error("No AWS_BRANCH found");
        return false;
    }
    const isDev = devBranches.includes(awsBranch ?? "<error>");
    const [startTime, endTime] = isDev
        ? [dayjs().subtract(10, "year"), dayjs().add(10, "year")]
        : [dayjs(), dayjs().endOf("day").add(1, "day")];
    const emailTriggers = await getEmailTriggers({ startDate: startTime, endDate: endTime });
    console.log(`Found ${emailTriggers.length} triggers for today`);
    if (emailTriggers.length === 0) {
        console.log("No triggers found for today, stopping reminder routine");
        return true;
    }
    console.log("Updating email templates");
    await emailClient.templates.update().catch((error) => {
        console.error("Error updating email templates", error);
    });

    const groupedTriggers = await groupTriggers(emailTriggers);
    console.log("Grouped triggers", groupedTriggers);
    await handleTriggers({ triggers: groupedTriggers });
    // const handling: Promise<unknown>[] = [];
    // Object.entries(groupedTriggers).forEach(([eventType, triggers]) => {
    //     const handler = triggerHandlers[eventType as TimelineEvent.eventType];
    //     if (!handler) {
    //         console.error("No handler found for event type", eventType);
    //         return;
    //     }
    //     handling.push(
    //         handler(triggers).catch((error: Error) => {
    //             console.error(`Error handling triggers for event type ${eventType}`, error.message);
    //         }),
    //     );
    // });

    // await Promise.all(handling).catch((error) => {
    //     console.error("Error handling triggers", error);
    // });
    console.log("Finished reminder routine");
    return true;
}

// type DataCache = {
//     campaign: { [id: string]: Campaign.Campaign };
//     customer: { [id: string]: Customer.Customer };
//     influencer: { [id: string]: Influencer.Influencer };
// };

// async function handlePostMails(triggers: GroupedTrigger) {
//     console.log("Handling post mails", triggers);
//     const promises: Promise<unknown>[] = [];
//     Object.entries(triggers).forEach(([emailType, eventTriggers]) => {
//         emailType = emailType as EmailTriggers.emailTriggerType;
//         switch (emailType) {
//             case "actionReminder": {
//                 Object.entries(eventTriggers).forEach(([level, levelTriggers]) => {
//                     const contextProps = defineContext(levelTriggers);
//                     const sendProps: SendMailProps = {
//                         level: level as EmailTriggers.emailLevel,
//                         commonContext: {},
//                         individualContext: contextProps,
//                     };
//                     promises.push(
//                         templateDefinitions.mailTypes.post.PostActionReminder.send(sendProps),
//                     );
//                 });
//                 break;
//             }
//             case "deadlineReminder": {
//                 Object.entries(eventTriggers).forEach(([level, levelTriggers]) => {
//                     const contextProps = defineContext(levelTriggers);
//                     const sendProps: SendMailProps = {
//                         level: level as EmailTriggers.emailLevel,
//                         commonContext: {},
//                         individualContext: contextProps,
//                     };
//                     promises.push(
//                         templateDefinitions.mailTypes.post.PostDeadlineReminder.send(sendProps),
//                     );
//                 });
//                 break;
//             }
//         }
//     });
//     await Promise.all(promises);
// }

// async function handleVideoMails(triggers: GroupedTrigger) {
//     console.log("Handling video mails", triggers);
//     const promises: Promise<unknown>[] = [];
//     Object.entries(triggers).forEach(([emailType, eventTriggers]) => {
//         emailType = emailType as EmailTriggers.emailTriggerType;
//         switch (emailType) {
//             case "actionReminder": {
//                 Object.entries(eventTriggers).forEach(([level, levelTriggers]) => {
//                     const contextProps = defineContext(levelTriggers);
//                     const sendProps: SendMailProps = {
//                         level: level as EmailTriggers.emailLevel,
//                         commonContext: {},
//                         individualContext: contextProps,
//                     };
//                     promises.push(
//                         templateDefinitions.mailTypes.video.VideoActionReminder.send(sendProps),
//                     );
//                 });
//                 break;
//             }
//             case "deadlineReminder": {
//                 Object.entries(eventTriggers).forEach(([level, levelTriggers]) => {
//                     const contextProps = defineContext(levelTriggers);
//                     const sendProps: SendMailProps = {
//                         level: level as EmailTriggers.emailLevel,
//                         commonContext: {},
//                         individualContext: contextProps,
//                     };
//                     promises.push(
//                         templateDefinitions.mailTypes.video.VideoDeadlineReminder.send(sendProps),
//                     );
//                 });
//                 break;
//             }
//         }
//     });
//     await Promise.all(promises);
// }

// async function handleWebinarSpeakerMails(triggers: GroupedTrigger) {
//     console.log("Handling webinar speaker mails", triggers);
//     const promises: Promise<unknown>[] = [];
//     Object.entries(triggers).forEach(([emailType, eventTriggers]) => {
//         emailType = emailType as EmailTriggers.emailTriggerType;
//         switch (emailType) {
//             case "actionReminder": {
//                 Object.entries(eventTriggers).forEach(([level, levelTriggers]) => {
//                     const contextProps = defineContext(levelTriggers);
//                     const sendProps: SendMailProps = {
//                         level: level as EmailTriggers.emailLevel,
//                         commonContext: {},
//                         individualContext: contextProps,
//                     };
//                     promises.push(
//                         templateDefinitions.mailTypes.webinarSpeaker.WebinarSpeakerActionReminder.send(
//                             sendProps,
//                         ),
//                     );
//                 });
//                 break;
//             }
//             case "deadlineReminder":
//                 console.log(
//                     "Encountered Webinar Speaker Deadline Reminder. This should not exist.",
//                 );
//                 break;
//         }
//     });
//     await Promise.all(promises);
// }

// async function handleWebinarMails(triggers: GroupedTrigger) {
//     console.error("Handling webinar mails is not implemented yet", triggers);
// }
