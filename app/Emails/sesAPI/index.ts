import updateTemplates from "./functions/updateTemplates";
import deleteTemplates from "./functions/deleteTemplates";
import getTemplate from "./functions/getTemplate";
import sendEmailTemplateBulk from "./functions/sendEmailTemplateBulk";
import listTemplates from "./functions/listTemplates";
import sendEmailTemplate from "./functions/SendEmailTemplate";
import sendMail from "./functions/sendMail";

const sesAPIClient = {
    send: sendMail,
    sendTemplate: sendEmailTemplate,
    sendBulk: sendEmailTemplateBulk,
    listTemplates,
    updateTemplates,
    getTemplate,
    deleteTemplates,
};

export const SESClientSendMail = {
    send: sendMail,
    sendTemplate: sendEmailTemplate,
    sendBulk: sendEmailTemplateBulk,
};
export default sesAPIClient;

export { templateSender } from "../templates";
