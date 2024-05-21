import { useQueryClient } from "@tanstack/react-query";
import TimelineEvent from "../ServerFunctions/types/timelineEvent";

/**
 * Resolve event reference
 * @param event - The event to resolve
 * @param queryClient - The queryClient to use for resolving the event
 * @returns The resolved event
 * @throws {Error} If the event reference is not implemented
 */

export function resolveEventReference(
    event: TimelineEvent.EventReference,
    queryClient: ReturnType<typeof useQueryClient>,
): TimelineEvent.SingleEvent | TimelineEvent.MultiEvent {
    //TODO resolve EventReference
    throw new Error("EventReference not implemented in DateSelector");
}
