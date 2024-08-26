export const campaignQueries = {
    all: ["campaign"],
    byId: (campaignId: string) => [...campaignQueries.all, campaignId],
};
