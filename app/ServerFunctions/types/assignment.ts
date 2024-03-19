import { Nullable, Prettify } from "@/app/Definitions/types";
import Influencer from "./influencer";
import TimelineEvent from "./timelineEvents";

export default Assignment;

namespace Assignment {
    export type Assignment = Prettify<AssignmentFull>;

    export type AssignmentMin = {
        id: string;
        isPlaceholder?: boolean;
        placeholderName: Nullable<string>;
        influencer: Nullable<Influencer.InfluencerWithName>;
    };
    export type AssignmentFull = Prettify<
        AssignmentMin & {
            candidates?: Influencer.Candidate[];
            budget?: Nullable<number>;
            timelineEvents: TimelineEvent.Event[];
            influencer: Nullable<Influencer.InfluencerFull>;
        }
    >;
}
