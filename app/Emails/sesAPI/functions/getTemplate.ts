"use server";
import getSESClient from "../client";
import { GetEmailTemplateCommand } from "@aws-sdk/client-sesv2";

//MARK: Get Template
interface GetTemplateParams {
    templateName: string;
}
export default async function getTemplate({ templateName }: GetTemplateParams) {
    if (!templateName) return null;
    const client = await getSESClient();

    const command = new GetEmailTemplateCommand({
        TemplateName: templateName,
    });
    const response = await client.send(command);
    const returnData: { Html?: string; Text?: string; Subject?: string } =
        response.TemplateContent ?? {};
    return returnData;
}
