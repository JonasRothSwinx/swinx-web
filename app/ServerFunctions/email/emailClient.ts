import { sendBulkCampaignInvite, sendBulkCampaignInviteAPI } from "./invites";
import { updateTemplates, getTemplate, listTemplates } from "./templates/templateFunctions";

export const invites = { sendBulk: sendBulkCampaignInviteAPI };

export const templates = {
    list: listTemplates,
    update: updateTemplates,
    // deleteAll: deleteTemplates,
    get: getTemplate,
    // testRender: testRenderTemplate,
};

export default { invites, templates };
