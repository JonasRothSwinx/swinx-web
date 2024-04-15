/**
 * Database Client for Email Triggers
 */

import config from "./config";
import dbOperations from "../dbOperations";
import { EmailTriggers } from "../../types/emailTriggers";
import dataClient from "..";
import { PartialWith } from "@/app/Definitions/types";
import TimelineEvent from "../../types/timelineEvents";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";

const emailTriggerClient = {
    create: createEmailTrigger,
    list: listEmailTriggers,
    update: updateEmailTrigger,
    delete: deleteEmailTrigger,
    getEmailTriggersForEvent,
    getEmailTriggersForDateRange,
};

export default emailTriggerClient;

//###############################
//#region Operations

/**
 * Create a new email trigger
 * @param trigger The email trigger object to create
 * @returns The created email trigger object
 */
async function createEmailTrigger(
    trigger: Omit<EmailTriggers.EmailTrigger, "id">,
): Promise<EmailTriggers.EmailTrigger> {
    const queryClient = config.getQueryClient();
    const id = await dbOperations.emailTrigger.create(trigger);
    const createdTrigger = { ...trigger, id };
    queryClient.setQueryData(["emailTrigger", id], { ...trigger, id });
    queryClient.setQueryData(["emailTriggers"], (prev: EmailTriggers.EmailTrigger[]) => {
        if (!prev) {
            return [createdTrigger];
        }
        return [...prev, createdTrigger];
    });
    queryClient.refetchQueries({ queryKey: ["emailTriggers"] });
    queryClient.refetchQueries({ queryKey: ["emailTrigger", id] });
    return createdTrigger;
}

/**
 * List all email triggers
 * @returns The list of email triggers
 */
export async function listEmailTriggers(): Promise<EmailTriggers.EmailTrigger[]> {
    const queryClient = config.getQueryClient();
    const emailTriggers = queryClient.getQueryData<EmailTriggers.EmailTrigger[]>(["emailTriggers"]);
    if (emailTriggers) {
        return emailTriggers;
    }
    const triggers = await dbOperations.emailTrigger.list();

    const validatedTriggers = await Promise.all(triggers.map(validateEmailTrigger));
    queryClient.setQueryData(["emailTriggers"], validatedTriggers);
    return validatedTriggers;
}

/**
 * Update an existing email trigger
 * @param updatedData - The updated email trigger data
 * @param previousTrigger - The previous email trigger data
 * @returns The updated email trigger object
 */
export async function updateEmailTrigger(
    updatedData: PartialWith<EmailTriggers.EmailTrigger, "id">,
    previousTrigger: EmailTriggers.EmailTrigger,
): Promise<EmailTriggers.EmailTrigger> {
    const queryClient = config.getQueryClient();
    await dbOperations.emailTrigger.update(updatedData);
    const updated = { ...previousTrigger, ...updatedData };
    queryClient.setQueryData(["emailTrigger", updated.id], updated);
    queryClient.setQueryData(["emailTriggers"], (prev: EmailTriggers.EmailTrigger[]) => {
        if (!prev) {
            return [updated];
        }
        return prev.map((trigger) => (trigger.id === updated.id ? updated : trigger));
    });
    queryClient.refetchQueries({ queryKey: ["emailTriggers"] });
    queryClient.refetchQueries({ queryKey: ["emailTrigger", updated.id] });
    return updated;
}

/**
 * Delete an email trigger
 * @param trigger The email trigger object to delete
 */
export async function deleteEmailTrigger(
    trigger: Pick<EmailTriggers.EmailTrigger, "id">,
): Promise<void> {
    const queryClient = config.getQueryClient();
    await dbOperations.emailTrigger.delete(trigger);
    queryClient.setQueryData(["emailTrigger", trigger.id], undefined);
    queryClient.setQueryData(["emailTriggers"], (prev: EmailTriggers.EmailTrigger[]) => {
        if (!prev) {
            return [];
        }
        return prev.filter((t) => t.id !== trigger.id);
    });
    queryClient.refetchQueries({ queryKey: ["emailTriggers"] });
    queryClient.refetchQueries({ queryKey: ["emailTrigger", trigger.id] });
}

/**
 * Get all email triggers for a specific event
 * @param event The event object to get triggers for
 * @returns The list of email triggers
 */
export async function getEmailTriggersForEvent(
    event: Pick<TimelineEvent.Event, "id">,
): Promise<EmailTriggers.EmailTrigger[]> {
    const queryClient = config.getQueryClient();
    const triggers = queryClient.getQueryData<EmailTriggers.EmailTrigger[]>(["emailTriggers"]);
    if (triggers) {
        return triggers.filter((trigger) => trigger.event.id === event.id);
    }
    const eventTriggers = await dbOperations.emailTrigger.byEvent(event);
    const validatedTriggers = await Promise.all(eventTriggers.map(validateEmailTrigger));
    queryClient.setQueryData(["emailTriggers"], validatedTriggers);
    return validatedTriggers;
}

/**
 * Get all email triggers for a specific date range
 * @param props - The date range to get triggers for
 * @param props.startDate - The start date of the range
 * @param props.endDate - The end date of the range
 * @param props.useCache - Whether to use the cache or not
 * @returns The list of email triggers
 */
export async function getEmailTriggersForDateRange(props: {
    startDate: Dayjs;
    endDate: Dayjs;
    useCache?: boolean;
}): Promise<EmailTriggers.EmailTrigger[]> {
    const { startDate, endDate, useCache = false } = props;
    const queryClient = config.getQueryClient();
    const triggers = queryClient.getQueryData<EmailTriggers.EmailTrigger[]>(["emailTriggers"]);
    if (triggers && useCache) {
        return triggers.filter((trigger) => trigger.date.isBetween(startDate, endDate, null, "[]"));
    }
    const dateTriggers = await dbOperations.emailTrigger.byDateRange(startDate, endDate);
    const validatedTriggers = await Promise.all(dateTriggers.map(validateEmailTrigger));
    queryClient.setQueryData(["emailTriggers"], validatedTriggers);
    return validatedTriggers;
}

//#endregion Operations
//###############################

//###############################
//#region Validation
/**
 * Validate an email trigger object and resolve id references
 * @param trigger The email trigger object to validate
 * @returns The validated email trigger object
 */
async function validateEmailTrigger(
    trigger: EmailTriggers.EmailTriggerEventRef,
): Promise<EmailTriggers.EmailTrigger> {
    const { id, date, event, type } = trigger;
    if (!event?.id) {
        throw new Error(`Event ID is required for email trigger with ID ${id}`);
    }
    const fullEvent = await dataClient.timelineEvent.get(event.id);
    if (!fullEvent) {
        throw new Error(`Event with ID ${event.id} not found`);
    }
    return {
        id,
        date,
        type,
        event: fullEvent,
    };
}
