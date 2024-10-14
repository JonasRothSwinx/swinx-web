/** Keys for events */
const eventKeys = {
    one: (id: string) => ["event", id] as const,
    parent: (id: string) => ["event", id, "parent"] as const,
};

/** Keys for campaigns */
const campaignKeys = {
    one: (id: string) => ["campaign", id] as const,
};

/** Keys for assignments */
const assignmentKeys = {
    one: (id: string) => ["assignment", id],
    events: {
        all: (id: string) => [...assignmentKeys.one(id), "events"] as const,
        sorted: (id: string) => [...assignmentKeys.events.all(id), "sorted"] as const,
    },
};

/** Keys for candidates */
const candidateKeys = {
    one: (id: string) => ["candidate", id] as const,
};

/** Tanstack Query key factories */
export const queryKeys = {
    campaign: campaignKeys,
    event: eventKeys,
    assignment: assignmentKeys,
    candidate: candidateKeys,
};
