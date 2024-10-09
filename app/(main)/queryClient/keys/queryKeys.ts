import { projectManager } from "@/app/ServerFunctions/database/dataClients/projectManager";

export const campaignKeys = {
    all: ["campaigns"] as const,
    one: (campaignId: string) => [...campaignKeys.all, campaignId] as const,
    events: {
        all: (campaignId: string) => [...campaignKeys.one(campaignId), "events"] as const,
        event: (campaignId: string, eventId: string) =>
            [...campaignKeys.events.all(campaignId), eventId] as const,
        byType: (campaignId: string, type: string) =>
            [...campaignKeys.events.all(campaignId), "byType", type] as const,
    },
    influencers: {
        all: (campaignId: string) => [...campaignKeys.one(campaignId), "influencers"] as const,
        one: (campaignId: string, influencerId: string) =>
            [...influencerKeys.all, influencerId] as const,
    },
    relations: {
        customers: {
            all: (campaignId: string) => [...campaignKeys.one(campaignId), "customers"] as const,
        },
    },
};

export const projectManagerKeys = {
    all: ["projectManagers"] as const,
    one: (projectManagerId: string) => [...projectManagerKeys.all, projectManagerId] as const,
};

export const customerKeys = {
    all: ["customers"] as const,
    one: (customerId: string) => [...customerKeys.all, customerId] as const,
};

export const currentUserKeys = {
    user: () => ["currentUser"] as const,
    userAttributes: () => [...currentUserKeys.user(), "userAttributes"] as const,
    userGroups: () => [...currentUserKeys.user(), "userGroups"] as const,
    projectManager: () => [...currentUserKeys.user(), "projectManager"] as const,
};

export const influencerKeys = {
    all: ["influencers"] as const,
    one: (influencerId: string) => [...influencerKeys.all, influencerId] as const,
    byCampaign: (campaignId: string) => [...campaignKeys.one(campaignId), "influencers"] as const,
};

export const eventKeys = {
    all: ["events"] as const,
    one: (eventId: string) => [...eventKeys.all, eventId] as const,
};

export const assignmentKeys = {
    all: ["assignments"] as const,
    one: (assignmentId: string) => [...assignmentKeys.all, assignmentId] as const,
    byCampaign: (campaignId: string) => [...campaignKeys.one(campaignId), "assignments"] as const,
    byInfluencer: (influencerId: string) =>
        [...influencerKeys.one(influencerId), "assignments"] as const,
};

export const campaignListKeys = {
    settings: () => ["campaignList", "settings"] as const,
    displayed: (settings: { showOwnOnly: boolean }) => ["campaignList", settings] as const,
};
