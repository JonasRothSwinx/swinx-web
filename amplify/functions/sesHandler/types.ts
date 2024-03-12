export type sesHandlerEventBody =
    | sesHandlerGetTemplate
    | sesHandlerUpdateTemplate
    | sesHandlerListTemplate
    | sesHandlerDeleteTemplate
    | sesHandlerSendEmailTemplate
    | sesHandlerSendEmailTemplateBulk
    | sesHandlerSendReminders;

type sesHandlerMinimal = {
    operation:
        | "list"
        | "get"
        | "update"
        | "delete"
        | "sendEmailTemplate"
        | "sendEmailTemplateBulk"
        | "sendReminders";
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
