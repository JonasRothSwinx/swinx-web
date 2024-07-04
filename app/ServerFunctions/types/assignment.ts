import { Nullable, Prettify } from "@/app/Definitions/types";
import { Influencers, Event, Events } from ".";
import { Candidate, Candidates } from ".";

export type Assignment = Prettify<Full>;

export type AssignmentReference = {
    id: string;
};
export type Min = {
    id: string;
    isPlaceholder?: boolean;
    budget?: Nullable<number>;
    placeholderName: Nullable<string>;
    campaign: { id: string };
    influencer: Nullable<Influencers.InfluencerWithName>;
    candidates?: Candidate[];
    timelineEvents: Event[];
};
export type Full = Prettify<
    Min & {
        // candidates?: Candidates.Candidate[];
        // timelineEvents: TimelineEvent.Event[];
        influencer: Nullable<Influencers.Full>;
    }
>;
export type AssignmentWithReferences = Min & {
    influencer: Nullable<Influencers.Reference>;
    candidates: Candidates.CandidateReference[];
    timelineEvents: Events.EventReference[];
};
