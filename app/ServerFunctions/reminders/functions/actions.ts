"use server";

// import dataClient from "../../database";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import database from "../../database/dbOperations";
import { EmailTriggers } from "../../types/emailTriggers";
// import dayjs from "@/app/utils/configuredDayJs";

export async function startReminderRoutine(): Promise<boolean> {
    console.log("Starting reminder routine");
    const startTime = dayjs().startOf("day");
    const endTime = dayjs().endOf("day");
    const emailTriggers = await getEmailTriggers({ startDate: startTime, endDate: endTime });
    console.log(`Found ${emailTriggers.length} triggers for today`);
    for (const trigger of emailTriggers) {
        console.log("Processing trigger", trigger);
        // Process the trigger
    }
    return true;
}

interface GetEmailTriggerProps {
    startDate: Dayjs;
    endDate: Dayjs;
}

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
    const event = await database.timelineEvent.get(trigger.event.id);
    if (event === null) return null;
    const triggerWithEvent = { ...trigger, event };
    return triggerWithEvent;
}
