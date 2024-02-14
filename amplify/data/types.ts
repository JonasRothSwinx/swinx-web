export const campaignSteps: string[] = ["new", "selectInfluencers"] as const;
export const campaignTypes: string[] = ["Webinar"] as const;
export const influencerAssignments: string[] = ["Einladungen", "Video", "Beitrag"] as const;
export const timelineEventTypes: string[] = ["Invites", "Video", "Post", "Webinar"] as const;
export type timelineEventTypesType = "Generic" | "Invites" | "Video" | "Post";
