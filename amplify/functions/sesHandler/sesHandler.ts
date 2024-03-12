import { Handler } from "aws-lambda";
import {
    BulkEmailEntry,
    CreateEmailTemplateCommand,
    GetEmailTemplateCommand,
    ListEmailTemplatesCommand,
    SESv2Client,
    SendBulkEmailCommand,
    SendEmailCommand,
    UpdateEmailTemplateCommand,
    UpdateEmailTemplateCommandInput,
} from "@aws-sdk/client-sesv2";
import {
    sesHandlerEventBody,
    sesHandlerGetTemplate,
    sesHandlerSendEmailTemplate,
    sesHandlerSendEmailTemplateBulk,
    sesHandlerSendReminders,
    sesHandlerUpdateTemplate,
} from "./types.js";
import modules from "./modules/index.js";

// export const client = new SESv2Client({
//     region: "eu-west-1",
// });

export const handler: Handler = async (event) => {
    console.log(event);
    const body: sesHandlerEventBody | undefined = JSON.parse(event.body);
    const apiresponse = {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {},
        body: "",
    };
    if (!body) {
        apiresponse.statusCode = 400;
        apiresponse.body = "No body provided";
    } else {
        // console.log("Received event", body);
        let responseData;
        try {
            responseData = await handleEvent(body);
            apiresponse.body = JSON.stringify({
                responseData,
                event: body.debug ? event : undefined,
            });
        } catch (error) {
            console.error("Error handling event", error);
            apiresponse.statusCode = 400;
            apiresponse.body = JSON.stringify({
                error,
                event: body.debug ? event : undefined,
            });
        }
    }
    console.log("Sending Response:", apiresponse);
    return apiresponse;
};
export async function handleEvent(body: sesHandlerEventBody) {
    // console.log("Handling event", body, body.operation);
    if (!body.operation) {
        return "No operation provided";
    }
    switch (body.operation ?? "") {
        case "list":
            return modules.listTemplates();
        case "get":
            // if (!isSesHandlerGetTemplate(body)) throw new Error("Invalid body for get operation");
            body = body as sesHandlerGetTemplate;
            return modules.getTemplate(body.templateName ?? "");
        case "update":
            body = body as sesHandlerUpdateTemplate;
            return modules.updateTemplates(body.updateData ?? []);
        case "delete":
            return "not implemented";
        case "sendEmailTemplate":
            body = body as sesHandlerSendEmailTemplate;
            return modules.sendEmailTemplate(body);
        case "sendEmailTemplateBulk":
            body = body as sesHandlerSendEmailTemplateBulk;
            return modules.sendEmailTemplateBulk(body);
        case "sendReminders":
            body = body as sesHandlerSendReminders;
            return modules.sendReminders();
        default:
            return "Invalid operation";
    }
}
