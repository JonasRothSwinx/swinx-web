/* eslint-disable @typescript-eslint/ban-ts-comment */
"use server";

import { Nullable, PartialWith } from "@/app/Definitions/types";
import { timelineEvents } from "./.database";
import Assignment from "@/app/ServerFunctions/types/assignment";
import client from "./.dbclient";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { createCandidate, deleteCandidate } from "./candidate";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { RawData } from "./types";
import { Candidates } from "../../types/candidates";

export async function createAssignment(
    assignment: Omit<Assignment.AssignmentFull, "id">,
    campaignId: string,
) {
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
            "campaignAssignedInfluencersId",
            "influencerAssignmentInfluencerId",

            "influencer.*",
            "candidates.*",
            "candidates.influencer.*",
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
    "candidates.*",
    "candidates.influencer.*",
    // "timelineEvents.timelineEvent.id",
    // "timelineEvents.timelineEvent.date",
    // "timelineEvents.timelineEvent.type
    // "timelineEvents.timelineEvent.id",
] as const;
export async function listAssignments() {
    const { data, errors } = await client.models.InfluencerAssignment.list();
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }
    const validatedAssignments: Assignment.AssignmentMin[] = data.map(validateAssignment);
    return validatedAssignments;
}
/**
 * Retrieves all candidates for a given assignment.
 * @param assignmentId - The ID of the assignment.
 * @returns An array of candidate objects.
 */
export async function getAllCandidates(assignmentId: string) {
    const { data, errors } = await client.models.InfluencerAssignment.get(
        { id: assignmentId },
        { selectionSet: ["candidates.id"] },
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
        influencerAssignmentInfluencerId: assignment.influencer?.id ?? undefined,
    });
    return data.id;
}

export async function deletePlaceholder(assignment: PartialWith<Assignment.AssignmentFull, "id">) {
    const { id } = assignment;
    if (!id) throw new Error("Missing Data");
    const events = assignment.timelineEvents ?? [];

    await Promise.all(
        events.map(async (x) => {
            timelineEvents.delete(x);
        }),
    );

    await client.models.InfluencerAssignment.delete({ id });
}

export async function getAssignment(assignmentId: string) {
    //@ts-ignore
    const { data, errors } = await client.models.InfluencerAssignment.get(
        { id: assignmentId },
        //@ts-ignore
        { selectionSet },
    );
    const dataOut = validateAssignment(data);
    return dataOut;
}

function validateAssignment(rawData: unknown): Assignment.AssignmentMin {
    const rawDataTyped = rawData as RawData.RawAssignmentFull;
    const influencer: Influencer.InfluencerWithName = {
        id: rawDataTyped.influencer.id,
        firstName: rawDataTyped.influencer.firstName,
        lastName: rawDataTyped.influencer.lastName,
    };
    const candidates: Candidates.Candidate[] = rawDataTyped.candidates.map((x) => {
        if (!x.influencer.email) throw new Error("Email is required");
        let emailType: Influencer.emailType = "new";
        if (x.influencer.emailType && Influencer.isValidEmailType(x.influencer.emailType)) {
            emailType = x.influencer.emailType;
        }
        const candidate: Candidates.Candidate = {
            id: x.id,
            response: x.response,
            influencer: {
                id: x.influencer.id,
                firstName: x.influencer.firstName,
                lastName: x.influencer.lastName,
                email: x.influencer.email,
                emailType,
            },
        };
        return candidate;
    });

    // const timelineEvents: TimelineEvent.EventReference[] = rawDataTyped.timelineEvents.map((x) => {
    //     return {
    //         id: x.id,
    //     };
    // });
    const dataOut: Assignment.AssignmentMin = {
        id: rawDataTyped.id,
        placeholderName: rawDataTyped.placeholderName,
        budget: rawDataTyped.budget,
        isPlaceholder: rawDataTyped.isPlaceholder,
        influencer,
        timelineEvents: [],
        candidates,
        campaign: { id: rawDataTyped.campaignAssignedInfluencersId },
    };
    return dataOut;
}

export async function getAssignmentTimelineEvents(assignment: Assignment.AssignmentMin) {
    const fetchStart = performance.now();
    //@ts-expect-error This is a valid selection
    const { data, errors } = await client.models.InfluencerAssignment.get(
        { id: assignment.id },
        {
            selectionSet: [
                //@ts-expect-error This is a valid selection
                "timelineEvents.timelineEvent.*",
                //@ts-ignore
                "timelineEvents.timelineEvent.campaign.id",
            ],
        },
    );
    const fetchEnd = performance.now();
    console.log("Fetch Time", fetchEnd - fetchStart);
    const validateStart = performance.now();
    const dataOut: TimelineEvent.Event[] = await Promise.all(
        data.timelineEvents.map(async (x: { timelineEvent: RawData.RawTimelineEvent }) =>
            validateTimelineEvent(x.timelineEvent, assignment),
        ),
    );
    const validateEnd = performance.now();
    console.log("Validate Time", validateEnd - validateStart);
    return dataOut;
}

/**
 * List all assignments, belonging to a campaign
 * @param campaignId The id of the campaign to list assignments for
 *
 * @returns The list of assignments
 */

export async function listAssignmentsByCampaign(campaignId: string) {
    const { data, errors } = await client.models.InfluencerAssignment.list({
        filter: { campaignAssignedInfluencersId: { eq: campaignId } },
        selectionSet,
    });
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }
    const validatedAssignments: Assignment.AssignmentMin[] = data.map(validateAssignment);
    return validatedAssignments;
}

function validateTimelineEvent(
    rawData: unknown,
    assignment: Assignment.AssignmentMin,
): TimelineEvent.Event {
    const rawDataTyped = rawData as RawData.RawTimelineEvent;
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
                campaign: rawDataTyped.campaign,
                assignments: [assignment],
                relatedEvents: {
                    parentEvent: null,
                    childEvents: [],
                },
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
                campaign: rawDataTyped.campaign,
                assignments: [],
                relatedEvents: {
                    parentEvent: null,
                    childEvents: [],
                },
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
