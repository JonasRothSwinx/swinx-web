import { dayjs } from "@/app/utils";

import { getEmailTriggers } from "./getEmailTriggers";
import groupTriggers from "./groupTriggers";
import handleTriggers from "./handleTriggers";
import { schemaIntrospection } from "../../database/dbOperations";

const devBranches = ["sandbox", "dev"];
export default async function startReminderRoutine(): Promise<boolean> {
    console.log("Starting reminder routine");
    console.log(
        `In environment ${process.env.NODE_ENV}. Current time: ${dayjs().format(
            "YYYY-MM-DD HH:mm",
        )}`,
    );
    // console.log(process.env);
    // return true;
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
    console.log("Triggers", JSON.stringify(emailTriggers, null, 2));
    if (emailTriggers.length === 0) {
        console.log("No triggers found for today, stopping reminder routine");
        return true;
    }
    const groupedTriggers = await groupTriggers(emailTriggers);
    console.log("Grouped triggers", JSON.stringify(groupedTriggers, null, 2));
    const tasks = await handleTriggers({ triggers: groupedTriggers });
    console.log(`Tasks created: ${tasks.length}`);
    await Promise.all(tasks);
    console.log("Tasks completed");

    console.log("Finished reminder routine");
    return true;
}
export async function introspection() {
    await schemaIntrospection();
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
