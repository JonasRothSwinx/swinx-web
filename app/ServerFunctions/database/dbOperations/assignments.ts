"use server";

import { Nullable, PartialWith } from "@/app/Definitions/types";
import { timelineEvents } from ".";
import Assignment from "@/app/ServerFunctions/types/assignment";
import client from "./.dbclient";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { createCandidate, deleteCandidate } from "./candidate";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";
import { Candidates } from "../../types/candidates";
import { EmailTriggers } from "../../types/emailTriggers";
import { SelectionSet } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";

export async function createAssignment(
    assignment: Omit<Assignment.AssignmentFull, "id">,
    campaignId: string,
) {
    const { placeholderName: name, budget, isPlaceholder = true } = assignment;
    if (!name) throw new Error("Missing Data");

    const { data, errors } = await client.models.InfluencerAssignment.create({
        placeholderName: name,
        budget,
        campaignId,
        isPlaceholder,
    });
    if (data === null) return null;
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
            "campaignId",
            "influencerId",
            "influencer.*",
            "candidates.*",
            "candidates.influencer.*",
            // "timelineEvents.timelineEvent.id",
        ],
    });
}
//MARK: SelectionSet
const selectionSet = [
    //
    "id",
    "placeholderName",
    "budget",
    "isPlaceholder",
    "influencer.*",
    "candidates.*",
    "candidates.influencer.*",
    "campaignId",
    // "timelineEvents.timelineEvent.id",
    // "timelineEvents.timelineEvent.date",
    // "timelineEvents.timelineEvent.type
    // "timelineEvents.timelineEvent.id",
] as const;
type RawAssignment = SelectionSet<Schema["InfluencerAssignment"]["type"], typeof selectionSet>;

export async function listAssignments() {
    const { data, errors } = await client.models.InfluencerAssignment.list({ selectionSet });
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
    if (data === null) return [];
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
                promises.push(createCandidate({ candidate, candidateAssignmentId: assignment.id }));
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
        influencerId: assignment.influencer?.id ?? undefined,
    });
    if (data === null) throw new Error("No Data");
    return data.id;
}

export async function deletePlaceholder(assignment: PartialWith<Assignment.AssignmentFull, "id">) {
    const { id } = assignment;
    if (!id) throw new Error("Missing Data");
    const events = assignment.timelineEvents ?? [];

    await Promise.all(
        events.map(async (x) => {
            if (!x.id) return;
            timelineEvents.delete({ id: x.id });
        }),
    );

    await client.models.InfluencerAssignment.delete({ id });
}

export async function getAssignment(assignmentId: string) {
    const { data, errors } = await client.models.InfluencerAssignment.get(
        { id: assignmentId },
        { selectionSet },
    );
    if (data === null) throw new Error(`No data for assignment ${assignmentId}`);
    const dataOut = validateAssignment(data);
    return dataOut;
}

function validateAssignment(rawData: RawAssignment): Assignment.AssignmentMin {
    const influencer: Nullable<Influencer.InfluencerWithName> = rawData.influencer
        ? {
              id: rawData.influencer.id,
              firstName: rawData.influencer.firstName,
              lastName: rawData.influencer.lastName,
          }
        : null;
    const candidates: Candidates.Candidate[] = rawData.candidates.map((x) => {
        if (!x.influencer.email) throw new Error("Email is required");
        let emailType: EmailTriggers.emailLevel = "new";
        if (x.influencer.emailType && EmailTriggers.isValidEmailType(x.influencer.emailType)) {
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
                emailLevel: emailType,
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
        id: rawData.id,
        placeholderName: rawData.placeholderName ?? null,
        budget: rawData.budget,
        isPlaceholder: rawData.isPlaceholder,
        influencer,
        timelineEvents: [],
        candidates,
        campaign: { id: rawData.campaignId },
    };
    return dataOut;
}

const eventSelectionSet = [
    "timelineEvents.timelineEvent.*",
    "timelineEvents.timelineEvent.campaign.id",
] as const;
export async function getAssignmentTimelineEvents(assignment: Assignment.AssignmentMin) {
    const fetchStart = performance.now();
    const { data, errors } = await client.models.InfluencerAssignment.get(
        { id: assignment.id },
        {
            selectionSet: eventSelectionSet,
        },
    );
    const fetchEnd = performance.now();
    console.log("Fetch Time", fetchEnd - fetchStart);
    if (data === null) return [];
    const validateStart = performance.now();
    const dataOut: TimelineEvent.Event[] = await Promise.all(
        data.timelineEvents.map((x) => {
            return validateTimelineEvent(x, assignment);
        }),
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
        filter: { campaignId: { eq: campaignId } },
        selectionSet,
    });
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }
    const validatedAssignments: Assignment.AssignmentMin[] = data.map(validateAssignment);
    return validatedAssignments;
}

function validateTimelineEvent(
    rawData: SelectionSet<
        Schema["InfluencerAssignment"]["type"],
        typeof eventSelectionSet
    >["timelineEvents"][number],
    assignment: Assignment.AssignmentMin,
): TimelineEvent.Event {
    const {
        timelineEvent: {
            id,
            date,
            timelineEventType: type,
            eventAssignmentAmount,
            eventTaskAmount,
            eventTitle,
            campaign,
            isCompleted = false,
        },
    } = rawData;
    const validatedEvent: TimelineEvent.Event = {
        id: id,
        date,
        type: type as TimelineEvent.eventType,
        eventAssignmentAmount: 1,
        eventTaskAmount,
        eventTitle,
        campaign,
        assignments: [assignment],
        emailTriggers: [],
        parentEvent: null,
        childEvents: [],
        info: {},
        isCompleted: isCompleted ?? false,
    };
    return validatedEvent;
}
