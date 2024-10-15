import type { CampaignListSettings } from "../../(withSideBar)/CampaignList/config/types";

export const campaignListKeys = {
    base: ["campaignList"] as const,
    settings: () => [...campaignListKeys.base, "settings"] as const,
    displayed: {
        all: () => [...campaignListKeys.base, "displayed"] as const,
        withSetting: (settings: CampaignListSettings) => [...campaignListKeys.displayed.all(), settings] as const,
    },
};
