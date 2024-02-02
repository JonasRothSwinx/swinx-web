export namespace TimelineEvent {
    export type TimelineEvent =
        | TimeLineEventInvites
        | TimeLineEventPost
        | TimeLineEventVideo
        | TimeLineEventGeneric;

    type TimelineEventStub = {
        id?: string;
        timelineEventType: string;
        influencer: Influencer.InfluencerWithName;
        createdAt?: string;
        updatedAt?: string;
        date?: string;
        notes?: string | null;
        campaign: { id: string };
    };
    export function isInviteEvent(
        timelineEvent: TimelineEvent,
    ): timelineEvent is TimeLineEventInvites {
        return timelineEvent.timelineEventType === "Invites";
    }
    export type TimeLineEventInvites = {
        // timelineEventType: "Invites";
        inviteEvent?: InviteEvent;
    } & TimelineEventStub;

    export function isPostEvent(timelineEvent: TimelineEvent): timelineEvent is TimeLineEventPost {
        return timelineEvent.timelineEventType === "Post";
    }
    export type TimeLineEventPost = {
        // timelineEventType: "Post";
    } & TimelineEventStub;

    export function isVideoEvent(
        timelineEvent: TimelineEvent,
    ): timelineEvent is TimeLineEventVideo {
        return timelineEvent.timelineEventType === "Video";
    }
    export type TimeLineEventVideo = {
        // timelineEventType: "Video";
    } & TimelineEventStub;

    export type TimeLineEventGeneric = {
        // timelineEventType: "Generic";
    } & TimelineEventStub;

    export type InviteEvent = {
        id?: string;
        invites?: number;
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
        createdAt: string;
        updatedAt: string;
    } & InfluencerWithName;
    export function isInfluencerFull(influencer: Influencer): influencer is InfluencerFull {
        return ["firstName", "lastName", "details", "createdAt", "updatedAt"].every(
            (prop) => prop in influencer,
        );
    }
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
        campaignType: string;
        campaignManagerId?: string | null;
        customer: Customer;
        campaignTimelineEvents: TimelineEvent.TimelineEvent[];
        campaignStep: string;
        notes?: string | null;
    };

    export type WebinarCampaign = { campaignType: "Webinar"; webinar: Webinar } & CampaignStub;
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
