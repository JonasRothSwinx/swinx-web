export default function encodeQueryParams(params: CampaignInviteEncodedData): string;
export default function encodeQueryParams(params: Record<string, string>): string {
    return encodeURIComponent(btoa(JSON.stringify(params)));
}
