"use server";

import { Nullable, PartialWith } from "@/app/Definitions/types";
import { EmailTriggers } from "../../types/emailTriggers";
import TimelineEvent from "../../types/timelineEvents";
import client from "./.dbclient";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import { RawData } from "./types";
import { SelectionSet } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";

const selectionSet = [
    "id",
    "date",
    "type",
    "event.id",
    "event.assignments.assignment.influencer.id",
    "event.assignments.assignment.influencer.firstName",
    "event.assignments.assignment.influencer.lastName",
    "event.assignments.assignment.influencer.email",
    "event.assignments.assignment.influencer.emailType",
] as const;
type RawEmailTrigger = SelectionSet<Schema["EmailTrigger"], typeof selectionSet>;
async function testDummy() {
    const { data } = await client.models.EmailTrigger.list({
        selectionSet: [
            "id",
            "date",
            "event.id",
            "type",

            // "event.assignments.influencerAssignment.influencer.emailType",
        ],
    });
}
/**
 * List all email triggers
 * @returns The list of email triggers
 */
export async function listEmailTriggers(): Promise<EmailTriggers.EmailTriggerEventRef[]> {
    const { data, errors } = await client.models.EmailTrigger.list({
        selectionSet,
    });
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }
    const validated: Nullable<ReturnType<typeof validateEmailTrigger>>[] = data.map((trigger) => {
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
    trigger: Omit<EmailTriggers.EmailTriggerEventRef, "id" | "influencer">,
): Promise<string> {
    console.log("Creating email trigger", trigger);
    const { date, event, type } = trigger;
    const { data, errors } = await client.models.EmailTrigger.create({
        date,
        type,
        eventId: event.id,
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
    trigger: Partial<EmailTriggers.EmailTriggerEventRef> & { id: string },
): Promise<string> {
    const { id, date, event } = trigger;
    const { data, errors } = await client.models.EmailTrigger.update({
        id,
        date: date,
        event: event ? { id: event.id } : undefined,
    });
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }
    return data.id;
}

/**
 * Delete an email trigger
 * @param trigger The email trigger object to delete
 */
export async function deleteEmailTrigger(trigger: { id: string }): Promise<void> {
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
        filter: { eventId: { eq: event.id } },
        selectionSet,
    });
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }
    const validated: Nullable<ReturnType<typeof validateEmailTrigger>>[] = data.map((trigger) => {
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
 * @param start The start date of the range as ISO string
 * @param end The end date of the range as ISO string
 */
export async function getEmailTriggersForDateRange(
    start: string,
    end: string,
): Promise<EmailTriggers.EmailTriggerEventRef[]> {
    const { data, errors } = await client.models.EmailTrigger.list({
        filter: { date: { between: [start, end] } },
        selectionSet,
    });
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }
    const validated: Nullable<ReturnType<typeof validateEmailTrigger>>[] = data.map((trigger) => {
        try {
            return validateEmailTrigger(trigger);
        } catch (error) {
            // console.log(error);
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
function validateEmailTrigger(raw: RawEmailTrigger): EmailTriggers.EmailTriggerEventRef {
    const { id, date, event, type } = raw;
    if (!id || !date || !event) {
        throw new Error("Invalid Email Trigger");
    }
    const influencer = event.assignments[0].assignment.influencer;
    if (!influencer || !influencer.email) {
        throw new Error("Invalid Email Trigger");
    }
    const { email } = influencer;
    const emailLevel = influencer.emailType as EmailTriggers.emailLevel;
    const trigger: EmailTriggers.EmailTriggerEventRef = {
        id,
        type: type as EmailTriggers.emailTriggerType,
        ...(influencer && influencer.email
            ? { influencer: { ...influencer, emailLevel, email } }
            : {}),
        date,
        event,
    };
    return trigger;
}
