"use server";

import { Nullable, PartialWith } from "@/app/Definitions/types";
import { timelineEvents } from "./.dbInterface";
import Assignment from "../types/assignment";
import client from "./.dbclient";
import Influencer from "../types/influencer";
import { createCandidate, deleteCandidate } from "./candidate";
import TimelineEvent from "../types/timelineEvents";

export async function createAssignment(assignment: Assignment.AssignmentFull, campaignId: string) {
    const { placeholderName: name, budget, isPlaceholder = true } = assignment;
    if (!name) throw new Error("Missing Data");

    const { data, errors } = await client.models.InfluencerAssignment.create({
        placeholderName: name,
        budget,
        campaignAssignedInfluencersId: campaignId,
        isPlaceholder,
    });
    return data.id;
}
async function dummy() {
    const { data, errors } = await client.models.InfluencerAssignment.list({
        selectionSet: [
            //
            "id",
            "placeholderName",
            "budget",
            "isPlaceholder",
            "influencerAssignmentInfluencerId",
            "influencer.*",
            "influencer.details.*",
            "candidates.*",
            "candidates.influencer.*",
            "candidates.influencer.details.*",
            "campaignAssignedInfluencersId",
            // "timelineEvents.timelineEvent.id",
        ],
    });
}
const selectionSet = [
    //
    "id",
    "placeholderName",
    "budget",
    "isPlaceholder",
    "influencer.*",
    "influencer.details.*",
    "candidates.*",
    "candidates.influencer.*",
    "candidates.influencer.details.*",
    // "timelineEvents.timelineEvent.id",
    // "timelineEvents.timelineEvent.date",
    // "timelineEvents.timelineEvent.type
    "timelineEvents.timelineEvent.*",
] as const;
export async function listAssignments() {
    const { data, errors } = await client.models.InfluencerAssignment.list();
    return { data: JSON.parse(JSON.stringify(data)), errors: JSON.parse(JSON.stringify(errors)) };
}
/**
 * Retrieves all candidates for a given assignment.
 * @param assignmentId - The ID of the assignment.
 * @returns An array of candidate objects.
 */
export async function getAllCandidates(assignmentId: string) {
    const { data, errors } = await client.models.InfluencerAssignment.get(
        { id: assignmentId },
        { selectionSet: ["candidates.id"] }
    );
    return data.candidates;
}

/**
 * Updates an assignment in the database.
 *
 * @param assignment - The assignment object to update.
 * @returns The ID of the updated assignment.
 */
export async function updateAssignment(assignment: PartialWith<Assignment.AssignmentFull, "id">) {
    console.log(assignment);
    const { placeholderName: name, budget, isPlaceholder = true } = assignment;
    const promises: Promise<unknown>[] = [];
    if (assignment.candidates) {
        const candidates = await getAllCandidates(assignment.id);
        /* If candidate with candidateid does not exist in assignment.candidates, delete candidate*/
        candidates.forEach(async (candidate) => {
            if (!assignment.candidates?.find((x) => x.id === candidate.id)) {
                console.log("deleting", candidate);
                promises.push(deleteCandidate({ id: candidate.id }));
            }
        });

        /* If id of candidate in assignment.candidates does not exist in candidateIds, create candidate*/
        for (const candidate of assignment.candidates) {
            if (!candidates.find((x) => x.id === candidate.id)) {
                console.log("creating", candidate);
                promises.push(createCandidate(candidate, assignment.id));
            }
        }
    }

    // if (!name) throw new Error("Missing Data");
    const candidateresponses = await Promise.all(promises);
    console.log(candidateresponses);

    const { data, errors } = await client.models.InfluencerAssignment.update({
        id: assignment.id,
        placeholderName: name,
        budget,
        isPlaceholder,
        influencerAssignmentInfluencerId: assignment.influencer?.id,
    });
    return data.id;
}

export async function deletePlaceholder(assignment: Assignment.AssignmentFull) {
    const { id } = assignment;
    if (!id) throw new Error("Missing Data");

    await Promise.all(
        assignment.timelineEvents.map(async (x) => {
            timelineEvents.delete(x);
        })
    );

    await client.models.InfluencerAssignment.delete({ id });
}

export async function getAssignment(assignmentId: string) {
    //@ts-ignore
    const { data, errors } = await client.models.InfluencerAssignment.get({ id: assignmentId }, { selectionSet });
    const dataOut = validateAssignment(data);
    return dataOut;
}

type rawAssignment = {
    id: string;
    placeholderName: string;
    budget: number;
    influencer: {
        id: string;
        firstName: string;
        lastName: string;
        details: {
            id: string;
            email: string;
        };
    };
    candidates: {
        id: string;
        response: string;
        influencer: {
            id: string;
            firstName: string;
            lastName: string;
            details: {
                id: string;
                email: string;
            };
        };
    }[];
    timelineEvents: {
        timelineEvent: rawEvent;
    }[];
    isPlaceholder: boolean;
    influencerAssignmentInfluencerId: string;
    campaignAssignedInfluencersId: string;
};

type rawEvent = {
    id: string;
    campaignCampaignTimelineEventsId: string;
    timelineEventType: string;
    eventAssignmentAmount: Nullable<number>;
    eventTaskAmount: Nullable<number>;
    eventTitle: Nullable<string>;
    date: string;
    notes: Nullable<string>;
};
function validateAssignment(rawData: unknown): Assignment.AssignmentFull {
    const rawDataTyped = rawData as rawAssignment;
    const assignment: Assignment.AssignmentMin = {
        id: rawDataTyped.id,
        placeholderName: rawDataTyped.placeholderName,
        isPlaceholder: rawDataTyped.isPlaceholder,
        influencer: rawDataTyped.influencer,
    };
    const dataOut: Assignment.AssignmentFull = {
        id: rawDataTyped.id,
        placeholderName: rawDataTyped.placeholderName,
        budget: rawDataTyped.budget,
        isPlaceholder: rawDataTyped.isPlaceholder,
        influencer: rawDataTyped.influencer,
        timelineEvents: rawDataTyped.timelineEvents.map((x) => {
            const testEvent = { ...x.timelineEvent, type: x.timelineEvent.timelineEventType };
            switch (true) {
                case TimelineEvent.isSingleEvent(testEvent): {
                    const validatedEvent: TimelineEvent.SingleEvent = {
                        id: testEvent.id,
                        date: testEvent.date,
                        type: testEvent.type,
                        eventAssignmentAmount: 1,
                        eventTaskAmount: testEvent.eventTaskAmount,
                        eventTitle: testEvent.eventTitle,
                        campaign: { id: rawDataTyped.campaignAssignedInfluencersId },
                        assignment: assignment,
                    };
                    return validatedEvent;
                }
                case TimelineEvent.isMultiEvent(testEvent): {
                    const validatedEvent: TimelineEvent.MultiEvent = {
                        id: testEvent.id,
                        date: testEvent.date,
                        type: testEvent.type,
                        eventAssignmentAmount: testEvent.eventAssignmentAmount,
                        eventTaskAmount: testEvent.eventTaskAmount,
                        eventTitle: testEvent.eventTitle,
                        campaign: { id: rawDataTyped.campaignAssignedInfluencersId },
                        assignments: [],
                    };
                    return validatedEvent;
                }
                default: {
                    console.log(x);
                    TimelineEvent.isSingleEvent(x.timelineEvent, true);
                    TimelineEvent.isMultiEvent(x.timelineEvent, true);
                    throw new Error("Invalid Type");
                }
            }
        }),
        candidates: rawDataTyped.candidates,
    };
    return dataOut;
}

export async function getAssignmentTimelineEvents(assignment: Assignment.AssignmentMin) {
    const fetchStart = performance.now();
    const { data, errors } = await client.models.InfluencerAssignment.get(
        { id: assignment.id },
        //@ts-ignore
        { selectionSet: ["timelineEvents.timelineEvent.*"] }
    );
    const fetchEnd = performance.now();
    console.log("Fetch Time", fetchEnd - fetchStart);
    const validateStart = performance.now();
    const dataOut: TimelineEvent.Event[] = await Promise.all(
        data.timelineEvents.map(async (x: { timelineEvent: rawEvent }) =>
            validateTimelineEvent(x.timelineEvent, assignment)
        )
    );
    const validateEnd = performance.now();
    console.log("Validate Time", validateEnd - validateStart);
    return dataOut;
}

function validateTimelineEvent(rawData: unknown, assignment: Assignment.AssignmentMin): TimelineEvent.Event {
    const rawDataTyped = rawData as rawEvent;
    const testEvent = { ...rawDataTyped, type: rawDataTyped.timelineEventType };
    switch (true) {
        case TimelineEvent.isSingleEvent(testEvent): {
            const validatedEvent: TimelineEvent.SingleEvent = {
                id: testEvent.id,
                date: testEvent.date,
                type: testEvent.type,
                eventAssignmentAmount: 1,
                eventTaskAmount: testEvent.eventTaskAmount,
                eventTitle: testEvent.eventTitle,
                campaign: { id: rawDataTyped.campaignCampaignTimelineEventsId },
                assignment: assignment,
            };
            return validatedEvent;
        }
        case TimelineEvent.isMultiEvent(testEvent): {
            const validatedEvent: TimelineEvent.MultiEvent = {
                id: testEvent.id,
                date: testEvent.date,
                type: testEvent.type,
                eventAssignmentAmount: testEvent.eventAssignmentAmount,
                eventTaskAmount: testEvent.eventTaskAmount,
                eventTitle: testEvent.eventTitle,
                campaign: { id: rawDataTyped.campaignCampaignTimelineEventsId },
                assignments: [],
            };
            return validatedEvent;
        }
        default: {
            console.log({ rawDataTyped, testEvent });
            TimelineEvent.isSingleEvent(testEvent, true);
            TimelineEvent.isMultiEvent(testEvent, true);
            throw new Error("Invalid Type");
        }
    }
}
