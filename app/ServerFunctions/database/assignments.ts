"use server";

import { PartialWith } from "@/app/Definitions/types";
import { timelineEvents } from "../dbInterface";
import Assignment from "../types/assignment";
import client from "./.dbclient";
import Influencer from "../types/influencer";
import { createCandidate, deleteCandidate } from "./candidate";

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
