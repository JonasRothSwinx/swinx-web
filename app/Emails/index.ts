import sesAPIClient from "./sesAPI";
import templateDefinitions from "./templates";

const templates = {
    list: sesAPIClient.listTemplates,
    update: sesAPIClient.updateTemplates,
    get: sesAPIClient.getTemplate,
    delete: sesAPIClient.deleteTemplates,
};

const email = {
    campaignInvites: templateDefinitions.mailTypes.campaignInvite.CampaignInvite,
    campaignInvitesAccept: templateDefinitions.mailTypes.campaignInviteAccept.CampaignInviteAccept,
    campaignInvitesReject: templateDefinitions.mailTypes.campaignInviteReject.CampaignInviteReject,
} as const;

const emailClient = { email, templates };

export default emailClient;
