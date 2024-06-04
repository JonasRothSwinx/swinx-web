"use server";

import { Nullable, PartialWith } from "@/app/Definitions/types";
import { EmailTriggers } from "../../types/emailTriggers";
import TimelineEvent from "../../types/timelineEvent";
import client from "./.dbclient";
import { SelectionSet } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import Influencer from "../../types/influencer";

const selectionSet = [
    //General Info
    "id",
    "date",
    "type",
    //State
    "active",
    "sent",
    //Overrides
    "emailLevelOverride",
    "subjectLineOverride",
    "emailBodyOverride",
    //Event Info
    "event.id",
    "event.isCompleted",
    "event.assignments.assignment.isPlaceholder",
    "event.assignments.assignment.influencer.id",
    "event.assignments.assignment.influencer.firstName",
    "event.assignments.assignment.influencer.lastName",
    "event.assignments.assignment.influencer.email",
    "event.assignments.assignment.influencer.emailType",
] as const;
type RawEmailTrigger = SelectionSet<Schema["EmailTrigger"]["type"], typeof selectionSet>;
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

//MARK: List
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

    return validated.filter((trigger): trigger is EmailTriggers.EmailTriggerEventRef => trigger !== null);
}

//MARK: Delete
/**
 * Create a new email trigger
 * @param trigger The email trigger object to create
 * @returns The ID of the created email trigger
 */
export async function createEmailTrigger(
    trigger: Omit<EmailTriggers.EmailTriggerEventRef, "id" | "influencer">
): Promise<Nullable<string>> {
    console.log("Creating email trigger", trigger);
    const { date, event, type, emailLevelOverride, emailBodyOverride, subjectLineOverride } = trigger;
    const { data, errors } = await client.models.EmailTrigger.create({
        date,
        type,
        eventId: event.id,
        emailLevelOverride,
        emailBodyOverride,
        subjectLineOverride,
        active: true,
        sent: false,
    });
    if (errors) {
        throw new Error(errors.map((error) => error.message).join("\n"));
    }
    return data?.id ?? null;
}

//MARK: Update
/**
 * Update an existing email trigger
 * @param trigger - The email trigger object to update
 * @param trigger.id - The ID of the email trigger to update
 * @returns The ID of the updated email trigger
 */
export async function updateEmailTrigger(
    trigger: Partial<EmailTriggers.EmailTriggerEventRef> & { id: string }
): Promise<Nullable<string>> {
    const { id, date, event, active, emailBodyOverride, emailLevelOverride, type, sent, subjectLineOverride } = trigger;
    const { data, errors } = await client.models.EmailTrigger.update({
        id,
        date: date,
        // eventID: event.id, //Event ID is not updatable, reassigning trigger to another event makes no sense
        active,
        emailBodyOverride,
        emailLevelOverride,
        type,
        sent,
        subjectLineOverride,
    });
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }
    return data?.id ?? null;
}

//MARK: Delete
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
    event: Pick<TimelineEvent.Event, "id">
): Promise<EmailTriggers.EmailTriggerEventRef[]> {
    const { id: eventId } = event;
    if (!eventId) throw new Error("Event ID is required");
    const { data, errors } = await client.models.EmailTrigger.listByEvent(
        { eventId },
        {
            selectionSet,
        }
    );
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }
    const validated = validateArray(data);
    return validated;
}

/**
 * Get all email triggers for a date range
 * @param start The start date of the range as ISO string
 * @param end The end date of the range as ISO string
 */
export async function getEmailTriggersForDateRange(
    start: string,
    end: string
): Promise<EmailTriggers.EmailTriggerEventRef[]> {
    const { data, errors } = await client.models.EmailTrigger.list({
        filter: { date: { between: [start, end] } },
        selectionSet,
    });
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }
    const validated = validateArray(data);
    return validated;
}

//#region validation
/**
 * Convert raw data from the database to a valid email trigger object
 * @param raw The raw data from the database
 * @returns The email trigger object
 */
function validateEmailTrigger(raw: Nullable<RawEmailTrigger>): Nullable<EmailTriggers.EmailTriggerEventRef> {
    if (!raw) return null;
    const { id, date, event, type, emailLevelOverride, emailBodyOverride, subjectLineOverride, active, sent } = raw;
    if (!id || !date || !event) {
        throw new Error("Invalid Email Trigger");
    }
    const assignment = event.assignments[0].assignment;
    const influencer = assignment.influencer;
    let influencerWithContactInfo: Influencer.WithContactInfo | undefined = undefined;
    if (!assignment.isPlaceholder) {
        if (!influencer || !influencer.email || !influencer.emailType) {
            throw new Error("Invalid Email Trigger");
        } else {
            const { email } = influencer ?? {};
            const emailLevel = influencer.emailType as EmailTriggers.emailLevel;
            influencerWithContactInfo = {
                ...influencer,
                email: email ?? "",
                emailLevel,
            };
        }
    }
    const eventRef: EmailTriggers.EmailTriggerEventRef["event"] = {
        id: event.id,
        isCompleted: event.isCompleted ?? false,
    };
    const trigger: EmailTriggers.EmailTriggerEventRef = {
        id,
        type: type as EmailTriggers.emailTriggerType,
        ...(influencerWithContactInfo ? { influencer: influencerWithContactInfo } : {}),
        date,
        active,
        sent,
        event: eventRef,
        emailLevelOverride: emailLevelOverride as EmailTriggers.emailLevel,
        emailBodyOverride,
        subjectLineOverride,
    };
    return trigger;
}

function validateArray(rawArray: Nullable<RawEmailTrigger>[]): EmailTriggers.EmailTriggerEventRef[] {
    return rawArray
        .map(validateEmailTrigger)
        .filter((trigger): trigger is EmailTriggers.EmailTriggerEventRef => trigger !== null);
}

//#endregion
