import { Nullable, Prettify } from "@/app/Definitions/types";
import Influencer from "./influencer";
import TimelineEvent from "./timelineEvents";
import { Candidates } from "./candidates";

export default Assignment;

namespace Assignment {
    export type Assignment = Prettify<AssignmentFull>;

    export type AssignmentReference = {
        id: string;
    };
    export type AssignmentMin = {
        id: string;
        isPlaceholder?: boolean;
        budget?: Nullable<number>;
        placeholderName: Nullable<string>;
        campaign: { id: string };
        influencer: Nullable<Influencer.InfluencerWithName>;
        candidates?: Candidates.Candidate[];
        timelineEvents: TimelineEvent.Event[];
    };
    export type AssignmentFull = Prettify<
        AssignmentMin & {
            // candidates?: Candidates.Candidate[];
            // timelineEvents: TimelineEvent.Event[];
            influencer: Nullable<Influencer.Full>;
        }
    >;
    export type AssignmentWithReferences = AssignmentMin & {
        influencer: Nullable<Influencer.Reference>;
        candidates: Candidates.CandidateReference[];
        timelineEvents: TimelineEvent.EventReference[];
    };
}
