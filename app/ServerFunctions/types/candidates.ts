import { Nullable } from "@/app/Definitions/types";
import Influencer from "./influencer";

export namespace Candidates {
    const candidateResponseValues = ["pending", "accepted", "rejected"] as const;
    export type candidateResponse = (typeof candidateResponseValues)[number];
    export type Candidate = {
        id: Nullable<string>;
        influencer: Influencer.WithContactInfo;
        response: Nullable<string>;
        feedback: Nullable<string>;
        invitationSent: boolean;
    };

    export function isValidResponse(response: string): response is candidateResponse {
        return candidateResponseValues.includes(response as candidateResponse);
    }

    export type CandidateReference = {
        id: Nullable<string>;
    };
}
