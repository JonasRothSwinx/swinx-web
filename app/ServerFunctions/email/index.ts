import sesAPIClient from "./sesAPI";
import templateDefinitions from "./templates";

const templates = {
    list: sesAPIClient.listTemplates,
    update: sesAPIClient.updateTemplates,
    get: sesAPIClient.getTemplate,
    delete: sesAPIClient.deleteTemplates,
};

const email = {
    campaignInvites: templateDefinitions.mailTypes.CampaignInvite,
} as const;

const emailClient = { email, templates };

export default emailClient;
