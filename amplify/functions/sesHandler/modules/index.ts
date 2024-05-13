import SESclient from "./clients/SESclient.js";
import deleteTemplate from "./deleteTemplate.js";
import getTemplate from "./getTemplate.js";
import listTemplates from "./listTemplates.js";
import sendEmailTemplate from "./sendEmailTemplate.js";
import sendEmailTemplateBulk from "./sendEmailTemplateBulk.js";
import sendReminders from "./sendReminders.js";
import updateTemplates from "./updateTemplates.js";

export default {
    SESclient,
    getTemplate,
    listTemplates,
    sendEmailTemplate,
    sendEmailTemplateBulk,
    sendReminders,
    updateTemplates,
    deleteTemplate,
};
// Path: amplify/functions/sesHandler/modules/client.ts
