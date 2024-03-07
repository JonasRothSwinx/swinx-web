"use server";

import { sesHandlerEventBody } from "@/amplify/functions/sesHandler/resource";
import templateDefinitions from "./templates";
import { fetchApi } from "../sesAPI";

export async function updateTemplates() {
    const messages = [];
    const response = await fetchApi({ operation: "update", updateData: templateDefinitions });

    // await Promise.all(
    //     templateDefinitions.map((template) => {
    //         const content: UpdateEmailTemplateCommandInput = {
    //             TemplateName: template.name,
    //             TemplateContent: {
    //                 Subject: template.subjectLine,
    //                 Html: template.html,
    //                 Text: compiledHtmlConvert(template.html),
    //             },
    //         };

    //         if (templates?.find((x) => x.TemplateName === template.name)) {
    //             return client.send(new UpdateEmailTemplateCommand(content));
    //         }
    //         return client.send(new CreateEmailTemplateCommand(content));
    //     }),
    // );

    messages.push(response.status, response.ok);
    // console.log(messages, templates)
    return messages;
}

// export async function deleteTemplates() {
//     const messages = [];
//     const { TemplatesMetadata: templates } = await client.send(new ListEmailTemplatesCommand({}));
//     if (templates) {
//         await Promise.all(
//             templates?.map(async (template) => {
//                 return client.send(
//                     new DeleteEmailTemplateCommand({ TemplateName: template.TemplateName }),
//                 );
//             }),
//         );
//     }
// }

export async function listTemplates() {
    const messages = [];
    const templates = await fetchApi({ operation: "list" });
    return templates;
}

export async function getTemplate(templateName: string, debug?: boolean) {
    await updateTemplates();
    const template = await fetchApi({ operation: "get", templateName, debug });
    console.log(template);
    const content = (await template.json()).responseData;
    return content;
}
// export async function testRenderTemplate(
//     templateName: string,
//     templateData: Record<string, string>,
// ) {
//     const response = await client.send(
//         new TestRenderEmailTemplateCommand({
//             TemplateName: templateName,
//             TemplateData: JSON.stringify(templateData),
//         }),
//     );
//     return response;
// }

export async function testLambda() {
    console.log(process.env.AWS_BRANCH);
    return;

    // const response = await fetchApi({ operation: "list" });
    // // console.log(response);
    // return {
    //     response: await response.json(),
    //     status: response.status,
    //     statusText: response.statusText,
    //     ok: response.ok,
    //     url: response.url,
    // };
}
