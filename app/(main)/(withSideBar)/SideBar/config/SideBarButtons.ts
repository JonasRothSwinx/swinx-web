export enum sideBarButtonId {
    campaigns,
    influencers,
    inviteAnalysis,
}
export const sideBarButtons = [
    {
        id: sideBarButtonId.campaigns,
        title: "Kampagnen",
        description: "Campaign Menu Description placeholder",
        allowedGroups: ["admin", "projektmanager"],
        url: "/CampaignList",
    },
    {
        id: sideBarButtonId.influencers,
        title: "Influencer",
        description: "Influencer Menu Description placeholder",
        allowedGroups: ["admin", "projektmanager"],
        url: "/InfluencerList",
    },
    {
        id: sideBarButtonId.inviteAnalysis,
        title: "Invite Analysis",
        description: "Invite Analysis Menu Description placeholder",
        allowedGroups: ["admin"],
        url: "/InviteAnalysis",
    },
];
