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
    isSesHandlerGetTemplate,
    isSesHandlerSendEmailTemplateBulk,
    isSesHandlerUpdateTemplate,
    sesHandlerEventBody,
    sesHandlerGetTemplate,
    sesHandlerSendEmailTemplate,
    sesHandlerSendEmailTemplateBulk,
    sesHandlerUpdateTemplate,
} from "./resource.js";

export const client = new SESv2Client({
    region: "eu-west-1",
});

// import { compile } from "html-to-text";
// const compiledHtmlConvert = compile({ wordwrap: 130 });

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

async function handleEvent(body: sesHandlerEventBody) {
    // console.log("Handling event", body, body.operation);
    if (!body.operation) {
        return "No operation provided";
    }
    switch (body.operation ?? "") {
        case "list":
            return listTemplates();
        case "get":
            // if (!isSesHandlerGetTemplate(body)) throw new Error("Invalid body for get operation");
            body = body as sesHandlerGetTemplate;
            return getTemplate(body.templateName ?? "");
        case "update":
            body = body as sesHandlerUpdateTemplate;
            return updateTemplates(body.updateData ?? []);
        case "delete":
            return "not implemented";
        case "sendEmailTemplate":
            body = body as sesHandlerSendEmailTemplate;
            return sendEmailTemplate(body);
        case "sendEmailTemplateBulk":
            body = body as sesHandlerSendEmailTemplateBulk;
            return sendEmailTemplateBulk(body);
        default:
            return "Invalid operation";
    }
}
async function getTemplate(templateName: string) {
    if (templateName === "") {
        return "No template name provided";
    }
    const response = await client.send(new GetEmailTemplateCommand({ TemplateName: templateName }));
    return { ...response, $metadata: undefined };
}

async function listTemplates() {
    const response = await client.send(new ListEmailTemplatesCommand({}));
    return response.TemplatesMetadata;
}

async function updateTemplates(updateData: { name: string; subjectLine: string; html: string }[]) {
    const messages = [];
    const { TemplatesMetadata: templates } = await client.send(new ListEmailTemplatesCommand({}));

    await Promise.all(
        updateData.map((template) => {
            const content: UpdateEmailTemplateCommandInput = {
                TemplateName: template.name,
                TemplateContent: {
                    Subject: template.subjectLine,
                    Html: template.html,
                    // Text: compiledHtmlConvert(template.html),
                },
            };

            if (templates?.find((x) => x.TemplateName === template.name)) {
                return client.send(new UpdateEmailTemplateCommand(content));
            }
            return client.send(new CreateEmailTemplateCommand(content));
        }),
    );

    messages.push(templates);
    return messages;
}

async function sendEmailTemplateBulk(props: sesHandlerSendEmailTemplateBulk) {
    const {
        bulkEmailData: { from, emailData, templateName, defaultTemplateData },
    } = props;
    const response = await client.send(
        new SendBulkEmailCommand({
            BulkEmailEntries: emailData.map((entry) => {
                return {
                    Destination: {
                        ToAddresses: [entry.to],
                    },
                    ReplacementEmailContent: {
                        ReplacementTemplate: {
                            ReplacementTemplateData: entry.templateData,
                        },
                    },
                } satisfies BulkEmailEntry;
            }),
            FromEmailAddress: from,
            DefaultContent: {
                Template: {
                    TemplateName: templateName,
                    TemplateData: defaultTemplateData,
                },
            },
        }),
    );
    return response;
}

async function sendEmailTemplate(props: sesHandlerSendEmailTemplate) {
    const { to, from, templateName, templateData } = props.emailData;
    console.log({ to, from, templateName, templateData });
    const response = await client.send(
        new SendEmailCommand({
            Destination: {
                ToAddresses: to,
            },
            FromEmailAddress: from,
            Content: {
                Template: {
                    TemplateName: templateName,
                    TemplateData: templateData,
                },
            },
        }),
    );
    return response;
}
