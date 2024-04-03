import { Nullable, Prettify } from "@/app/Definitions/types";
import TimelineEvent from "./timelineEvents";

namespace Influencer {
    export type Influencer = Prettify<Reference | InfluencerWithName | Full>;

    export const emailTypeValues = ["new", "reduced", "none"] as const;
    export type emailType = (typeof emailTypeValues)[number];

    //#region Data Fields
    type Basic = {
        id: string;
        isTemp?: boolean;
    };
    type NameInfo = {
        firstName: string;
        lastName: string;
    };

    type ContactInfo = {
        phoneNumber?: Nullable<string>;
        email: string;
        emailType?: emailType;
    };

    type JobInfo = {
        company?: Nullable<string>;
        companyPosition?: Nullable<string>;
        industry?: Nullable<string>;
    };

    type SocialMedia = {
        topic?: Nullable<string>[];
        linkedinProfile?: Nullable<string>;
        followers?: Nullable<number>;
    };

    type Notes = {
        notes?: Nullable<string>;
    };
    //#endregion

    //#region Influencer Types
    export type Reference = Basic & {
        id: string;
    };

    export type InfluencerWithName = Basic & NameInfo;

    export type WithContactInfo = Basic & NameInfo & ContactInfo & Notes;

    export type Full = Basic & NameInfo & ContactInfo & JobInfo & SocialMedia & Notes;

    //#endregion

    //region Property Checks
    function hasId(influencer: Influencer): boolean {
        return "id" in influencer;
    }

    function hasNameInfo(influencer: Influencer): boolean {
        return ["firstName", "lastName"].every((prop) => prop in influencer);
    }

    function hasContactInfo(influencer: Influencer): boolean {
        return ["email"].every((prop) => prop in influencer);
    }

    function hasJobInfo(influencer: Influencer): boolean {
        return true;
        return ["company", "companyPosition", "industry"].every((prop) => prop in influencer);
    }

    function hasSocialMedia(influencer: Influencer): boolean {
        return true;
        return ["topic", "followers", "linkedinProfile"].every((prop) => prop in influencer);
    }

    //#endregion
    //#region type guards
    export function isValidEmailType(type: string): type is emailType {
        return emailTypeValues.includes(type as emailType);
    }

    export function isFull(influencer: Influencer): influencer is Full {
        return (
            hasNameInfo(influencer) &&
            hasContactInfo(influencer) &&
            hasJobInfo(influencer) &&
            hasSocialMedia(influencer)
        );
    }

    export function isInfluencerWithName(influencer: Influencer): influencer is InfluencerWithName {
        return hasNameInfo(influencer);
    }
    export function isInfluencerReference(influencer: Influencer): influencer is Reference {
        return hasId(influencer);
    }
    export function isWithContactInfo(influencer: Influencer): influencer is WithContactInfo {
        return hasNameInfo(influencer) && hasContactInfo(influencer);
    }
    //#endregion

    export type AssignedInfluencer = Full & {
        inviteEvents: TimelineEvent.Invites[];
    };
}

export default Influencer;
