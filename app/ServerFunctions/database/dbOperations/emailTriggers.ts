"use server";

import { PartialWith } from "@/app/Definitions/types";
import { EmailTriggers } from "../../types/emailTriggers";
import TimelineEvent from "../../types/timelineEvents";
import client from "./.dbclient";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import { RawData } from "./types";

/**
 * List all email triggers
 * @returns The list of email triggers
 */
export async function listEmailTriggers(): Promise<EmailTriggers.EmailTriggerEventRef[]> {
    const { data, errors } = await client.models.EmailTrigger.list({
        selectionSet: ["date", "event.id"],
    });
    if (errors) {
        throw new Error(errors.map((error) => error.message).join("\n"));
    }
    const validated = data.map((trigger: unknown) => {
        try {
            return validateEmailTrigger(trigger);
        } catch (error) {
            console.log(error);
            return null;
        }
    });

    return validated.filter(
        (trigger): trigger is EmailTriggers.EmailTriggerEventRef => trigger !== null,
    );
}

/**
 * Create a new email trigger
 * @param trigger The email trigger object to create
 * @returns The ID of the created email trigger
 */
export async function createEmailTrigger(
    trigger: Omit<EmailTriggers.EmailTriggerEventRef, "id">,
): Promise<string> {
    const { date, event, type } = trigger;
    const { data, errors } = await client.models.EmailTrigger.create({
        date: date.toISOString(),
        type,
        event: { id: event.id },
    });
    if (errors) {
        throw new Error(errors.map((error) => error.message).join("\n"));
    }
    return data.id;
}

/**
 * Update an existing email trigger
 * @param trigger - The email trigger object to update
 * @param trigger.id - The ID of the email trigger to update
 * @returns The ID of the updated email trigger
 */
export async function updateEmailTrigger(
    trigger: PartialWith<EmailTriggers.EmailTriggerEventRef, "id">,
): Promise<string> {
    const { id, date, event } = trigger;
    const { data, errors } = await client.models.EmailTrigger.update({
        id,
        date: date?.toISOString(),
        event: event ? { id: event.id } : undefined,
    });
    if (errors) {
        throw new Error(errors.map((error) => error.message).join("\n"));
    }
    return data.id;
}

/**
 * Delete an email trigger
 * @param trigger The email trigger object to delete
 */
export async function deleteEmailTrigger(
    trigger: Pick<EmailTriggers.EmailTriggerEventRef, "id">,
): Promise<void> {
    const { id } = trigger;
    await client.models.EmailTrigger.delete({ id });
}

/**
 * Get all email triggers for a specific event
 * @param event The event object to get triggers for
 * @returns The list of email triggers
 */
export async function getEmailTriggersForEvent(
    event: Pick<TimelineEvent.Event, "id">,
): Promise<EmailTriggers.EmailTriggerEventRef[]> {
    const { data, errors } = await client.models.EmailTrigger.list({
        filter: { timelineEventEmailTriggersId: { eq: event.id } },
        selectionSet: ["date", "event.id"],
    });
    if (errors) {
        throw new Error(errors.map((error) => error.message).join("\n"));
    }
    const validated = data.map((trigger: unknown) => {
        try {
            return validateEmailTrigger(trigger);
        } catch (error) {
            console.log(error);
            return null;
        }
    });
    return validated.filter(
        (trigger): trigger is EmailTriggers.EmailTriggerEventRef => trigger !== null,
    );
}

/**
 * Get all email triggers for a date range
 * @param start The start date of the range
 * @param end The end date of the range
 */
export async function getEmailTriggersForDateRange(
    start: Dayjs,
    end: Dayjs,
): Promise<EmailTriggers.EmailTriggerEventRef[]> {
    const { data, errors } = await client.models.EmailTrigger.list({
        filter: { date: { between: [start.toISOString(), end.toISOString()] } },
        selectionSet: ["date", "event.id"],
    });
    if (errors) {
        throw new Error(errors.map((error) => error.message).join("\n"));
    }
    const validated = data.map((trigger: unknown) => {
        try {
            return validateEmailTrigger(trigger);
        } catch (error) {
            console.log(error);
            return null;
        }
    });
    return validated.filter(
        (trigger): trigger is EmailTriggers.EmailTriggerEventRef => trigger !== null,
    );
}

/**
 * Convert raw data from the database to a valid email trigger object
 * @param raw The raw data from the database
 * @returns The email trigger object
 */
export function validateEmailTrigger(raw: unknown): EmailTriggers.EmailTriggerEventRef {
    if (typeof raw !== "object" || raw === null) {
        throw new Error("Invalid Email Trigger");
    }
    const { id, date, event, type } = raw as RawData.RawEmailTrigger;
    if (!id || !date || !event) {
        throw new Error("Invalid Email Trigger");
    }
    return {
        id,
        type: type as EmailTriggers.emailTriggerType,
        date: dayjs(date),
        event,
    };
}
