import { Nullable } from "@/app/Definitions/types";
import { candidates } from "../database/dbOperations";
import Influencer from "./influencer";

export namespace Candidates {
    export type candidateResponse = "pending" | "accepted" | "rejected";
    export type Candidate = {
        id: Nullable<string>;
        influencer: Influencer.WithContactInfo;
        response: Nullable<string>;
    };

    export type CandidateReference = {
        id: Nullable<string>;
    };
}
