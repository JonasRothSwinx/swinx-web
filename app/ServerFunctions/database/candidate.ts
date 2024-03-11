"use server";

import { PartialWith } from "@/app/Definitions/types";
import Influencer from "../types/influencer";
import client from "./.dbclient";

export async function createCandidate(
    candidate: Influencer.Candidate,
    influencerAssignmentCandidatesId: string,
) {
    const { data, errors } = await client.models.InfluencerCandidate.create({
        influencerAssignmentCandidatesId,
        influencerCandidateInfluencerId: candidate.influencer.id,
        response: "pending",
    });

    return { data: { id: data.id, influencerId: data.influencerCandidateInfluencerId }, errors };
}
export async function deleteCandidate(candidate: PartialWith<Influencer.Candidate, "id">) {
    if (!candidate.id) throw new Error("Missing Id");

    // ts-ignore
    const { data, errors } = await client.models.InfluencerCandidate.delete({ id: candidate.id });

    return { errors };
}

export async function publicProcessResponse(
    candidate: PartialWith<Influencer.Candidate, "id" | "response">,
) {
    const { id, response } = candidate;

    if (typeof id !== "string") throw new Error("Missing Id");
    if (typeof response !== "string") throw new Error("Missing Response");

    const { data, errors } = await client.models.InfluencerCandidate.update(
        { id, response },
        {
            authMode: "apiKey",
        },
    );

    return { errors };
}
