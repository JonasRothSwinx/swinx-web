import {
    sendEmailTemplate,
    sendEmailTemplateBulk,
    listTemplates,
    updateTemplates,
    deleteTemplates,
    getTemplate,
} from "./functions";

const sesAPIClient = {
    send: sendEmailTemplate,
    sendBulk: sendEmailTemplateBulk,
    listTemplates,
    updateTemplates,
    getTemplate,
    deleteTemplates,
};
export default sesAPIClient;
