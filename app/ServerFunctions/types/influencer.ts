import { Nullable, Prettify } from "@/app/Definitions/types";
import { Event, Events, EmailTriggers } from ".";

export type Influencer = Prettify<Reference | InfluencerWithName | Full>;

//#region Data Fields
type Basic = {
    id: string;
    isTemp?: boolean;
    createdAt?: string;
};
type NameInfo = {
    firstName: string;
    lastName: string;
};

type ContactInfo = {
    phoneNumber?: Nullable<string>;
    email: string;
    emailLevel?: EmailTriggers.emailLevel;
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

//#region Property Checks
function hasId(influencer: unknown, debug = false): boolean {
    const castData = influencer as Influencer;
    if (typeof castData !== "object" || castData === null) {
        if (debug) console.log("Influencer is not an object");
        return false;
    }
    return "id" in castData;
}

function hasNameInfo(influencer: unknown, debug = false): boolean {
    const castData = influencer as InfluencerWithName;
    if (typeof castData !== "object" || castData === null) {
        if (debug) console.log("Influencer is not an object");
        return false;
    }
    return ["firstName", "lastName"].every((prop) => prop in castData);
}

function hasContactInfo(influencer: unknown, debug = false): boolean {
    const castData = influencer as WithContactInfo;
    if (typeof castData !== "object" || castData === null) {
        if (debug) console.log("Influencer is not an object");
        return false;
    }
    return ["email"].every((prop) => prop in castData);
}

function hasJobInfo(influencer: unknown, debug = false): boolean {
    const castData = influencer as Full;
    if (typeof castData !== "object" || castData === null) {
        if (debug) console.log("Influencer is not an object");
        return false;
    }
    return true;
    return ["company", "companyPosition", "industry"].every((prop) => prop in castData);
}

function hasSocialMedia(influencer: unknown, debug = false): boolean {
    const castData = influencer as Full;
    if (typeof castData !== "object" || castData === null) {
        if (debug) console.log("Influencer is not an object");
        return false;
    }
    return true;
    return ["topic", "linkedinProfile", "followers"].every((prop) => prop in castData);
}

//#endregion
//#region type guards

export function isFull(influencer: unknown, requireId = true, debug = false): influencer is Full {
    if (typeof influencer !== "object" || influencer === null) {
        if (debug) console.log("Influencer is not an object");
        return false;
    }
    if (requireId && !hasId(influencer, debug)) {
        console.log("Influencer is missing id");
        return false;
    }
    const testData = influencer as Full;
    return (
        hasNameInfo(testData, debug) &&
        hasContactInfo(testData, debug) &&
        hasJobInfo(testData, debug) &&
        hasSocialMedia(testData, debug)
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
    inviteEvents: Events.Invites[];
};
export function getFullName(influencer: InfluencerWithName): string {
    return `${influencer.firstName} ${influencer.lastName}`;
}
