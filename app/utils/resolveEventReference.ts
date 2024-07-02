import { useQueryClient } from "@tanstack/react-query";
import { Events, Event } from "@/app/ServerFunctions/types";

/**
 * Resolve event reference
 * @param event - The event to resolve
 * @param queryClient - The queryClient to use for resolving the event
 * @returns The resolved event
 * @throws {Error} If the event reference is not implemented
 */

export function resolveEventReference(
    event: Events.EventReference,
    queryClient: ReturnType<typeof useQueryClient>,
): Event {
    //TODO resolve EventReference
    throw new Error("EventReference not implemented in DateSelector");
}
