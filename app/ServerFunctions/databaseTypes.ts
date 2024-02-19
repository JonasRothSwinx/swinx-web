export namespace TimelineEvent {
    export type TimelineEvent =
        | TimelineEventInvites
        | TimelineEventPost
        | TimelineEventVideo
        | TimelineEventGeneric
        | TimelineEventWebinar;

    type TimelineEventStub = {
        id?: string;
        timelineEventType: string;
        influencerPlaceholder?: Influencer.Placeholder;
        influencer?: Influencer.InfluencerWithName;
        createdAt?: string;
        updatedAt?: string;
        date?: string;
        notes?: string | null;
        campaign: { id: string };
    };
    export function isInviteEvent(
        timelineEvent: TimelineEvent,
    ): timelineEvent is TimelineEventInvites {
        return timelineEvent.timelineEventType === "Invites";
    }
    export type TimelineEventInvites = {
        inviteEvent?: InviteEvent;
    } & TimelineEventStub;

    export function isPostEvent(timelineEvent: TimelineEvent): timelineEvent is TimelineEventPost {
        return timelineEvent.timelineEventType === "Post";
    }
    export type TimelineEventPost = {} & TimelineEventStub;

    export function isVideoEvent(
        timelineEvent: TimelineEvent,
    ): timelineEvent is TimelineEventVideo {
        return timelineEvent.timelineEventType === "Video";
    }
    export type TimelineEventVideo = {} & TimelineEventStub;

    export type TimelineEventGeneric = {} & TimelineEventStub;

    export type InviteEvent = {
        id?: string;
        invites?: number;
    };
    export function isWebinarEvent(
        timelineEvent: TimelineEvent,
    ): timelineEvent is TimelineEventWebinar {
        return timelineEvent.timelineEventType === "Webinar";
    }
    export type TimelineEventWebinar = TimelineEventStub & {
        webinar?: WebinarEvent;
    };
    export type WebinarEvent = {
        id?: string;
        date: string;
        title: string;
    };
}

export namespace Influencer {
    export type Influencer = InfluencerMin | InfluencerWithName | InfluencerFull;
    type InfluencerMin = {
        id: string;
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

    export type Placeholder = {
        id: string;
        name: string;
        candidates: Influencer[];
        budget: number;
        timelineEvents: TimelineEvent.TimelineEvent[];
    };
}
//#region Customer
export type Customer = {
    id?: string;
    company: string;
    firstName: string;
    lastName: string;
    email: string;
    companyPosition?: string | null;
    notes?: string;
};
//#endregion
//#region Campaigns
export namespace Campaign {
    export type Campaign = CampaignStub | WebinarCampaign;

    type CampaignStub = {
        id: string;
        // campaignType: string;
        campaignManagerId?: string | null;
        customer: Customer;
        campaignTimelineEvents: TimelineEvent.TimelineEvent[];
        assignedInfluencers: Influencer.InfluencerFull[];
        influencerPlaceholders: Influencer.Placeholder[];
        // campaignStep: string;
        notes?: string | null;
    };

    export type WebinarCampaign = {
        webinar: Webinar;
    } & CampaignStub;
    export function isWebinar(campaign: Campaign): campaign is WebinarCampaign {
        return ["webinar"].every((x) => x in campaign);
    }
}
//#endregion

//#region Webinar
export type Webinar = {
    id?: string;
    title: string;
    date: string;
    notes?: string;
};
//#endregion
