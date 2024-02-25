import { Nullable } from "@/app/Definitions/types";
import TimelineEvent from "./timelineEvents";

namespace Influencer {
    export type Influencer = InfluencerMin | InfluencerWithName | InfluencerFull;
    type InfluencerMin = {
        id: string;
        isTemp?: boolean;
    };
    export type InfluencerWithName = {
        firstName: string;
        lastName: string;
    } & InfluencerMin;
    export function isInfluencerWithName(influencer: Influencer): influencer is InfluencerWithName {
        return ["firstName", "lastName"].every((prop) => prop in influencer);
    }
    export type InfluencerFull = {
        details: { id: string; email: string };
        createdAt?: string;
        updatedAt?: string;
    } & InfluencerWithName;

    export function isInfluencerFull(influencer: Influencer): influencer is InfluencerFull {
        return ["firstName", "lastName", "details", "createdAt", "updatedAt"].every(
            (prop) => prop in influencer,
        );
    }

    export type AssignedInfluencer = InfluencerFull & {
        inviteEvents: TimelineEvent.TimelineEventInvites[];
    };
    export type candidateResponse = "pending" | "accepted" | "rejected";
    export type Candidate = {
        id: Nullable<string>;
        influencer: InfluencerFull;
        response: Nullable<string>;
    };
}

export default Influencer;
