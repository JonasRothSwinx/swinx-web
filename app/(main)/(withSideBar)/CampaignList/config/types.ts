export type CampaignListSettings = {
    showOwnOnly: boolean;
    showManagerIds: string[];
};
export function CampaignListSettingsDefault(currentPmId?: string): CampaignListSettings {
    return {
        showOwnOnly: false,
        showManagerIds: currentPmId ? [currentPmId] : [],
    };
}
