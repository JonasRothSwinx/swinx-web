export function encodeQueryParams(params: CampaignInviteEncodedData): string;
export function encodeQueryParams(params: InfluencerTaskEncodedData): string;
export function encodeQueryParams(params: Record<string, string>): string {
    return encodeURIComponent(btoa(JSON.stringify(params)));
}
export type CampaignInviteEncodedData = {
    assignmentId: string;
    campaignId: string;
    candidateId: string;
    candidateFullName: string;
};
export type InfluencerTaskEncodedData = {
    assignmentId: string;
    // campaignId: string;
    // influencerId: string;
    // influencerFullName: string;
};

export function getInviteResponseUrl(params: CampaignInviteEncodedData): string {
    const baseUrl = (process.env.BASE_URL as string) + "/Response?data=";
    return `${baseUrl}${encodeQueryParams(params)}`;
}

export function getTaskPageUrl({ assignmentId }: InfluencerTaskEncodedData): string {
    const baseUrl = (process.env.BASE_URL as string) + "/tasks";
    return `${baseUrl}/${assignmentId}`;
}
