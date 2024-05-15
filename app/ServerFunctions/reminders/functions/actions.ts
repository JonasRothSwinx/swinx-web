"use server";

// import dataClient from "../../database";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import database from "../../database/dbOperations";
import { EmailTriggers } from "../../types/emailTriggers";
import TimelineEvent from "../../types/timelineEvents";
import templateDefinitions from "@/app/Emails/templates";
import Influencer from "../../types/influencer";
import emailClient from "@/app/Emails";
import { EmailContextProps, SendMailProps } from "@/app/Emails/templates/types";
import { EmailContextPropsByLevel } from "../types";
import Campaign from "../../types/campaign";
import Customer from "../../types/customer";
import ErrorLogger from "../../errorLog";
// import dayjs from "@/app/utils/configuredDayJs";
const triggerHandlers: {
    [key in TimelineEvent.eventType]: (triggers: GroupedTrigger) => Promise<unknown>;
} = {
    Invites: handleInviteMails,
    Post: handlePostMails,
    Video: handleVideoMails,
    WebinarSpeaker: handleWebinarSpeakerMails,
    Webinar: handleWebinarMails,
};
export async function startReminderRoutine(): Promise<boolean> {
    console.log("Starting reminder routine");
    const startTime = dayjs().startOf("day").subtract(7, "week");
    const endTime = dayjs().endOf("day").add(7, "week");
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

    const groupedTriggers = groupTriggers(emailTriggers);
    console.log("Grouped triggers", groupedTriggers);
    const handling: Promise<unknown>[] = [];
    Object.entries(groupedTriggers).forEach(([eventType, triggers]) => {
        const handler = triggerHandlers[eventType as TimelineEvent.eventType];
        if (!handler) {
            console.error("No handler found for event type", eventType);
            return;
        }
        handling.push(
            handler(triggers).catch((error: Error) => {
                console.error(`Error handling triggers for event type ${eventType}`, error.message);
            }),
        );
    });

    await Promise.all(handling).catch((error) => {
        console.error("Error handling triggers", error);
    });
    console.log("Finished reminder routine");
    return true;
}

interface GetEmailTriggerProps {
    startDate: Dayjs;
    endDate: Dayjs;
}
type DataCache = {
    campaign: { [id: string]: Campaign.Campaign };
    customer: { [id: string]: Customer.Customer };
    influencer: { [id: string]: Influencer.Influencer };
};
const DataCache: DataCache = {
    campaign: {},
    customer: {},
    influencer: {},
};

async function getEmailTriggers(props: GetEmailTriggerProps) {
    const { startDate, endDate } = props;
    console.log("Getting email triggers", startDate.toString(), endDate.toString());
    const triggers = await database.emailTrigger.byDateRange(
        startDate.toISOString(),
        endDate.toISOString(),
    );
    const fullTriggers: EmailTriggers.EmailTrigger[] = (
        await Promise.all(
            triggers.map(async (trigger) => {
                return await getEventsByEmailTrigger(trigger);
            }),
        )
    ).filter((trigger): trigger is EmailTriggers.EmailTrigger => trigger !== null);
    return fullTriggers;
}

async function getEventsByEmailTrigger(
    trigger: EmailTriggers.EmailTriggerEventRef,
): Promise<EmailTriggers.EmailTrigger | null> {
    console.log("Getting events by trigger", trigger);
    const response = await database.timelineEvent.getForEmailTrigger(trigger.event.id);
    if (response === null) return null;
    const { event, customer } = response;
    if (!event || !customer) return null;
    const triggerWithEvent = { ...trigger, event, customer };
    return triggerWithEvent;
}

type GroupedTriggerLevel = {
    [key in Exclude<EmailTriggers.emailLevel, "none">]?: EmailTriggers.EmailTrigger[];
};
type GroupedTrigger = { [key in EmailTriggers.emailTriggerType]?: GroupedTriggerLevel };
type TriggerGroup = { [key in TimelineEvent.eventType]?: GroupedTrigger };

function groupTriggers(triggers: EmailTriggers.EmailTrigger[]): TriggerGroup {
    const grouped: TriggerGroup = {};
    triggers.reduce((grouped, trigger) => {
        const {
            event: { type: eventType },
            type: mailType,
            influencer,
        } = trigger;
        if (trigger.sent || !trigger.active) return grouped;
        if (!influencer) return grouped;
        const level = trigger.emailLevelOverride ?? trigger.influencer?.emailLevel ?? "new";
        if (!level || level === "none") return grouped;
        const eventTypeGroup = grouped[eventType];
        if (!eventTypeGroup) {
            grouped[eventType] = {
                [mailType]: {
                    [level]: [trigger],
                },
            };
            return grouped;
        }
        const mailTypeGroup = eventTypeGroup[mailType];
        if (!mailTypeGroup) {
            eventTypeGroup[mailType] = { [level]: [trigger] };
            return grouped;
        }
        const levelGroup = mailTypeGroup[level];
        if (!levelGroup) {
            mailTypeGroup[level] = [trigger];
            return grouped;
        }
        levelGroup.push(trigger);

        return grouped;
    }, grouped);
    return grouped;
}

function getContext(triggers: EmailTriggers.EmailTrigger[]): Partial<EmailContextProps>[] {
    const context: Partial<EmailContextProps>[] = triggers.reduce((context, trigger) => {
        const { event, influencer, customer } = trigger;
        if (!event || !influencer || !customer) {
            ErrorLogger.log("Missing context");
            return context;
        }
        context.push({
            event,
            influencer,
            customer,
        });
        return context;
    }, [] as Partial<EmailContextProps>[]);
    return context;
}

async function handleInviteMails(triggers: GroupedTrigger) {
    console.log("Handling invite mails", triggers);
    const promises: Promise<unknown>[] = [];
    Object.entries(triggers).forEach(([emailType, eventTriggers]) => {
        emailType = emailType as EmailTriggers.emailTriggerType;
        switch (emailType) {
            case "actionReminder": {
                Object.entries(eventTriggers).forEach(([level, levelTriggers]) => {
                    const contextProps = getContext(levelTriggers);
                    const sendProps: SendMailProps = {
                        level: level as EmailTriggers.emailLevel,
                        commonContext: {},
                        individualContext: contextProps,
                    };
                    promises.push(
                        templateDefinitions.mailTypes.invites.InviteReminder.send(sendProps),
                    );
                });
                break;
            }
            case "deadlineReminder":
                console.log("Encountered Invite Deadline Reminder. This should not exist.");
                break;
        }
    });
    await Promise.all(promises);
}

async function handlePostMails(triggers: GroupedTrigger) {
    console.log("Handling post mails", triggers);
    const promises: Promise<unknown>[] = [];
    Object.entries(triggers).forEach(([emailType, eventTriggers]) => {
        emailType = emailType as EmailTriggers.emailTriggerType;
        switch (emailType) {
            case "actionReminder": {
                Object.entries(eventTriggers).forEach(([level, levelTriggers]) => {
                    const contextProps = getContext(levelTriggers);
                    const sendProps: SendMailProps = {
                        level: level as EmailTriggers.emailLevel,
                        commonContext: {},
                        individualContext: contextProps,
                    };
                    promises.push(
                        templateDefinitions.mailTypes.post.PostActionReminder.send(sendProps),
                    );
                });
                break;
            }
            case "deadlineReminder": {
                Object.entries(eventTriggers).forEach(([level, levelTriggers]) => {
                    const contextProps = getContext(levelTriggers);
                    const sendProps: SendMailProps = {
                        level: level as EmailTriggers.emailLevel,
                        commonContext: {},
                        individualContext: contextProps,
                    };
                    promises.push(
                        templateDefinitions.mailTypes.post.PostDeadlineReminder.send(sendProps),
                    );
                });
                break;
            }
        }
    });
    await Promise.all(promises);
}

async function handleVideoMails(triggers: GroupedTrigger) {
    console.log("Handling video mails", triggers);
    const promises: Promise<unknown>[] = [];
    Object.entries(triggers).forEach(([emailType, eventTriggers]) => {
        emailType = emailType as EmailTriggers.emailTriggerType;
        switch (emailType) {
            case "actionReminder": {
                Object.entries(eventTriggers).forEach(([level, levelTriggers]) => {
                    const contextProps = getContext(levelTriggers);
                    const sendProps: SendMailProps = {
                        level: level as EmailTriggers.emailLevel,
                        commonContext: {},
                        individualContext: contextProps,
                    };
                    promises.push(
                        templateDefinitions.mailTypes.video.VideoActionReminder.send(sendProps),
                    );
                });
                break;
            }
            case "deadlineReminder": {
                Object.entries(eventTriggers).forEach(([level, levelTriggers]) => {
                    const contextProps = getContext(levelTriggers);
                    const sendProps: SendMailProps = {
                        level: level as EmailTriggers.emailLevel,
                        commonContext: {},
                        individualContext: contextProps,
                    };
                    promises.push(
                        templateDefinitions.mailTypes.video.VideoDeadlineReminder.send(sendProps),
                    );
                });
                break;
            }
        }
    });
    await Promise.all(promises);
}

async function handleWebinarSpeakerMails(triggers: GroupedTrigger) {
    console.log("Handling webinar speaker mails", triggers);
    const promises: Promise<unknown>[] = [];
    Object.entries(triggers).forEach(([emailType, eventTriggers]) => {
        emailType = emailType as EmailTriggers.emailTriggerType;
        switch (emailType) {
            case "actionReminder": {
                Object.entries(eventTriggers).forEach(([level, levelTriggers]) => {
                    const contextProps = getContext(levelTriggers);
                    const sendProps: SendMailProps = {
                        level: level as EmailTriggers.emailLevel,
                        commonContext: {},
                        individualContext: contextProps,
                    };
                    promises.push(
                        templateDefinitions.mailTypes.webinarSpeaker.WebinarSpeakerActionReminder.send(
                            sendProps,
                        ),
                    );
                });
                break;
            }
            case "deadlineReminder":
                console.log(
                    "Encountered Webinar Speaker Deadline Reminder. This should not exist.",
                );
                break;
        }
    });
    await Promise.all(promises);
}

async function handleWebinarMails(triggers: GroupedTrigger) {
    console.error("Handling webinar mails is not implemented yet", triggers);
}
