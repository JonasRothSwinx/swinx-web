// Full path: <project-root>/amplify/functions/sesHandler/types.ts
import {
    EmailTemplateContent,
    GetEmailTemplateCommandOutput,
    SendBulkEmailCommandOutput,
} from "@aws-sdk/client-sesv2";
export type Prettify<T> = {
    [K in keyof T]: Prettify<T[K]>;
} & {};

export type sesHandlerEventBody =
    | sesHandlerGetTemplate
    | sesHandlerUpdateTemplate
    | sesHandlerListTemplate
    | sesHandlerDeleteTemplate
    | sesHandlerSendEmailTemplate
    | sesHandlerSendEmailTemplateBulk
    | sesHandlerSendReminders;

export type operation =
    | "list"
    | "get"
    | "update"
    | "delete"
    | "sendEmailTemplate"
    | "sendEmailTemplateBulk"
    | "sendReminders";

type sesHandlerMinimal = {
    operation: operation;
    debug?: boolean;
};

export type sesHandlerGetTemplate = sesHandlerMinimal & {
    operation: "get";
    templateName: string;
};
export function isSesHandlerGetTemplate(body: sesHandlerEventBody): body is sesHandlerGetTemplate {
    return body.operation === "get";
}

export type sesHandlerUpdateTemplate = sesHandlerMinimal & {
    operation: "update";
    updateData: { name: string; subjectLine: string; html: string }[];
};
export function isSesHandlerUpdateTemplate(
    body: sesHandlerEventBody,
): body is sesHandlerUpdateTemplate {
    return body.operation === "update";
}

export type sesHandlerListTemplate = sesHandlerMinimal & {
    operation: "list";
};
export function isseshandlerListTemplate(
    body: sesHandlerEventBody,
): body is sesHandlerListTemplate {
    return body.operation === "list";
}

export type sesHandlerDeleteTemplate = sesHandlerMinimal & {
    operation: "delete";
    deleteData: { name: string }[];
};

export function issseshandlerDeleteTemplate(
    body: sesHandlerEventBody,
): body is sesHandlerDeleteTemplate {
    return body.operation === "delete";
}

export type sesHandlerSendEmailTemplate = sesHandlerMinimal & {
    operation: "sendEmailTemplate";
    emailData: {
        to: string[];
        from: string;
        templateName: string;
        templateData: string;
    };
};

export function iseshandlersendEmailTemplate(
    body: sesHandlerEventBody,
): body is sesHandlerSendEmailTemplate {
    return body.operation === "sendEmailTemplate";
}

export type sesHandlerSendEmailTemplateBulk = sesHandlerMinimal & {
    operation: "sendEmailTemplateBulk";
    bulkEmailData: {
        from: string;
        templateName: string;
        defaultTemplateData: string;
        emailData: {
            to: string;
            templateData: string;
        }[];
    };
};

export function isSesHandlerSendEmailTemplateBulk(
    body: sesHandlerEventBody,
): body is sesHandlerSendEmailTemplateBulk {
    return body.operation === "sendEmailTemplateBulk";
}

export type sesHandlerSendReminders = sesHandlerMinimal & {
    operation: "sendReminders";
};
export type sesHandlerResponse = {
    statusCode: number;
    responseData: unknown;
    event?: unknown;
    error?: unknown;
};
export type sesHandlerGetTemplateResponseBody = Prettify<
    sesHandlerResponse & {
        responseData: Prettify<
            Pick<GetEmailTemplateCommandOutput, "TemplateName" | "TemplateContent">
        >;
    }
>;
export type sesHandlerUpdateTemplateResponseBody = Prettify<
    sesHandlerResponse & {
        responseData: Prettify<EmailTemplateContent[]>;
    }
>;
export type sesHandlerSendEmailTemplateBulkResponseBody = Prettify<
    sesHandlerResponse & {
        responseData: Prettify<SendBulkEmailCommandOutput>;
    }
>;
