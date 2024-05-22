"use server";
// import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
// import templateDefinitions from "@/app/Emails/templates";
// import { SendMailProps } from "@/app/Emails/templates/types";
// import { defineContext } from "./defineContext";

// export async function handleTriggers(triggers: GroupedTrigger) {
//     console.log("Handling invite mails", triggers);
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
//                         templateDefinitions.mailTypes.invites.InviteReminder.send(sendProps),
//                     );
//                 });
//                 break;
//             }
//             case "deadlineReminder":
//                 console.log("Encountered Invite Deadline Reminder. This should not exist.");
//                 break;
//         }
//     });
//     await Promise.all(promises);
// }
