/**
 * Database Client for Email Triggers
 */

import { config, influencer } from ".";
import dbOperations from "../dbOperations";
import { EmailTrigger, EmailTriggers, Event } from "../../types/";
import { dataClient } from "..";
import { PartialWith } from "@/app/Definitions/types";
import { dayjs, Dayjs } from "@/app/utils";

export const emailTrigger = {
    create: createEmailTrigger,
    list: listEmailTriggers,
    update: updateEmailTrigger,
    delete: deleteEmailTrigger,
    byEvent: getEmailTriggersForEvent,
    inRange: getEmailTriggersForDateRange,
};

//###############################
//#region Operations

/**
 * Create a new email trigger
 * @param trigger The email trigger object to create
 * @returns The created email trigger object
 */
async function createEmailTrigger(
    trigger: Omit<EmailTrigger, "id"> & { event: { id: string } },
): Promise<EmailTrigger> {
    try {
        // console.log("In datacclient emailTrigger createEmailTrigger", trigger);
        const queryClient = config.getQueryClient();

        const id = await dbOperations.emailTrigger.create({ ...trigger });
        if (!id) throw new Error("Failed to create email trigger");
        const createdTrigger = { ...trigger, id };
        queryClient.setQueryData(["emailTrigger", id], { ...trigger, id });
        queryClient.setQueryData(["emailTriggers"], (prev: EmailTrigger[]) => {
            if (!prev) {
                return [createdTrigger];
            }
            return [...prev, createdTrigger];
        });
        queryClient.refetchQueries({ queryKey: ["emailTriggers"] });
        queryClient.refetchQueries({ queryKey: ["emailTrigger", id] });
        return createdTrigger;
    } catch (error) {
        console.error("Error creating email trigger", error);
        throw error;
    }
}

/**
 * List all email triggers
 * @returns The list of email triggers
 */
export async function listEmailTriggers(): Promise<EmailTrigger[]> {
    const queryClient = config.getQueryClient();
    const emailTriggers = queryClient.getQueryData<EmailTrigger[]>(["emailTriggers"]);
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
    updatedData: Partial<Omit<EmailTriggers.EmailTriggerEventRef, "event">>,
    previousTrigger: Omit<EmailTrigger, "id"> & { id: string },
): Promise<EmailTrigger> {
    const queryClient = config.getQueryClient();

    await dbOperations.emailTrigger.update({
        ...updatedData,
        id: previousTrigger.id,
    });
    const updated = {
        ...previousTrigger,
        ...updatedData,
        event: previousTrigger.event,
        influencer: previousTrigger.influencer,
    };
    queryClient.setQueryData(["emailTrigger", updated.id], updated);
    queryClient.setQueryData(["emailTriggers"], (prev: EmailTrigger[]) => {
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
    trigger: Pick<EmailTrigger, "id"> & { id: string },
): Promise<void> {
    const queryClient = config.getQueryClient();
    await dbOperations.emailTrigger.delete(trigger);
    queryClient.setQueryData(["emailTrigger", trigger.id], undefined);
    queryClient.setQueryData(["emailTriggers"], (prev: EmailTrigger[]) => {
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
export async function getEmailTriggersForEvent(event: Pick<Event, "id">): Promise<EmailTrigger[]> {
    const queryClient = config.getQueryClient();
    // const triggers = queryClient.getQueryData<EmailTrigger[]>(["emailTriggers"]);
    // if (triggers) {
    //     return triggers.filter((trigger) => trigger.event.id === event.id);
    // }
    const eventTriggers = await dbOperations.emailTrigger.byEvent(event);
    const validatedTriggers = await Promise.all(eventTriggers.map(validateEmailTrigger));
    validatedTriggers.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
    queryClient.setQueryData(["emailTriggers", event.id], validatedTriggers);
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
}): Promise<EmailTrigger[]> {
    const { startDate, endDate, useCache = false } = props;
    const queryClient = config.getQueryClient();
    const triggers = queryClient.getQueryData<EmailTrigger[]>(["emailTriggers"]);
    if (triggers && useCache) {
        return triggers.filter((trigger) =>
            dayjs(trigger.date).isBetween(dayjs(startDate), dayjs(endDate), null, "[]"),
        );
    }
    const dateTriggers = await dbOperations.emailTrigger.byDateRange(
        startDate.toISOString(),
        endDate.toISOString(),
    );
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
): Promise<EmailTrigger> {
    const {
        id,
        date,
        event,
        type,
        influencer,
        emailBodyOverride,
        emailLevelOverride,
        subjectLineOverride,
        active,
        sent,
    } = trigger;
    if (!event?.id) {
        throw new Error(`Event ID is required for email trigger with ID ${id}`);
    }
    const fullEvent = await dataClient.timelineEvent.get(event.id);
    if (!fullEvent) {
        throw new Error(`Event with ID ${event.id} not found`);
    }

    const fullTrigger: EmailTrigger = {
        id,
        date,
        type,
        event: fullEvent,
        influencer,
        emailBodyOverride,
        emailLevelOverride,
        subjectLineOverride,
        active,
        sent,
    };

    return fullTrigger;
}
