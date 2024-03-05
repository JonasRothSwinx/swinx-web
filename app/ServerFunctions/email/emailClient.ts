import { sendBulkCampaignInvite } from "./invites";
import {
    updateTemplates,
    deleteTemplates,
    getTemplate,
    listTemplates,
    testRenderTemplate,
} from "./templates/templateFunctions";

export const invites = { sendBulk: sendBulkCampaignInvite };

export const templates = {
    list: listTemplates,
    update: updateTemplates,
    deleteAll: deleteTemplates,
    get: getTemplate,
    testRender: testRenderTemplate,
};

export default { invites, templates };
