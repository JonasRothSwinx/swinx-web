"use server";

import { PartialWith } from "@/app/Definitions/types";
import Influencer from "@/app/ServerFunctions/types/influencer";
import client from "./.dbclient";
import { Candidates } from "../../types/candidates";

export async function createCandidate(
    candidate: Omit<Candidates.Candidate, "id">,
    influencerAssignmentCandidatesId: string
) {
    const { data, errors } = await client.models.InfluencerCandidate.create({
        influencerAssignmentCandidatesId,
        influencerCandidateInfluencerId: candidate.influencer.id ?? undefined,
        response: "pending",
    });

    return data.id;
}
export async function deleteCandidate(candidate: PartialWith<Candidates.Candidate, "id">) {
    if (!candidate.id) throw new Error("Missing Id");

    // ts-ignore
    const { data, errors } = await client.models.InfluencerCandidate.delete({ id: candidate.id });

    return { errors };
}

export async function publicProcessResponse(candidate: PartialWith<Candidates.Candidate, "id" | "response">) {
    const { id, response } = candidate;

    if (typeof id !== "string") throw new Error("Missing Id");
    if (typeof response !== "string") throw new Error("Missing Response");

    const { data, errors } = await client.models.InfluencerCandidate.update(
        { id, response },
        {
            authMode: "apiKey",
        }
    );

    return { errors };
}
