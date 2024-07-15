import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as eventBridge from "aws-cdk-lib/aws-events";
import * as eventBridgeTargets from "aws-cdk-lib/aws-events-targets";
import { Function } from "aws-cdk-lib/aws-lambda";
import { sesHandler } from "./functions/sesHandler/resource.js";
import { reminderTrigger } from "./functions/reminderTrigger/resource.js";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
export const backend = defineBackend({
    auth,
    data,
    sesHandler,
    reminderTrigger,
});

const stack = backend.createStack("SwinxWebResources");

// eslint-disable-next-line @typescript-eslint/ban-types -- this is a valid use case
const reminderTriggerFunction = backend.reminderTrigger.resources.lambda as Function;
const allowSes = new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["ses:*"],
    resources: ["*"],
});
reminderTriggerFunction.addToRolePolicy(allowSes);

const dataResources = backend.data.resources;

Object.values(dataResources.cfnResources.amplifyDynamoDbTables).forEach((table) => {
    table.pointInTimeRecoveryEnabled = true;
});

//#region SES Handler Lambda & API Gateway
// // eslint-disable-next-line @typescript-eslint/ban-types -- this is a valid use case
// const sesHandlerLambda = backend.sesHandler.resources.lambda as Function;

// const policyStatement = new PolicyStatement({
//     effect: Effect.ALLOW,
//     actions: ["ses:*"],
//     resources: ["*"],
// });
// sesHandlerLambda.addToRolePolicy(policyStatement);
// sesHandlerLambda.addFunctionUrl({
//     authType: lambda.FunctionUrlAuthType.AWS_IAM,
//     cors: {
//         allowedOrigins: ["*"],
//     },
// });

// const api = new apigateway.RestApi(stack, "swinx-web-api", {
//     // restApiName: `InvokeRestApi_swinxWeb_${process.env.AWS_BRANCH ?? randomInt(0, 999999)}`,
//     restApiName: `swinx-web-api-${process.env.AWS_BRANCH ?? randomUUID()}`,
//     description: "API for Swinx Web App",
//     apiKeySourceType: apigateway.ApiKeySourceType.HEADER,
//     defaultCorsPreflightOptions: {
//         allowOrigins: apigateway.Cors.ALL_ORIGINS,
//     },
// });

// const lambdaIntegration = new apigateway.LambdaIntegration(sesHandlerLambda, {
//     // Max timeout allowed by AWS is 29 seconds
//     timeout: Duration.seconds(29),
//     allowTestInvoke: true,
// });

// api.root.addMethod("POST", lambdaIntegration, {
//     apiKeyRequired: true,
// });

// const apiKeyValue = process.env.ADMIN_API_KEY;
// const apiKey = api.addApiKey(`swinx-web-api-key`, {
//     apiKeyName: `swinx-web-api-key-${process.env.AWS_BRANCH}`,
//     value: apiKeyValue,
// });

// const usagePlan = new UsagePlan(stack, "swinxWebUsagePlan", {
//     name: `swinx-web Usage Plan for ${process.env.AWS_BRANCH}`,
//     apiStages: [
//         {
//             api,
//             stage: api.deploymentStage,
//         },
//     ],
// });
// usagePlan.addApiKey(apiKey);

// backend.addOutput({
//     custom: {
//         sesHandlerUrl: api.url,
//     },
// });

//#endregion

/**
 * Eventbridge Rule, the target is the reminderTrigger lambda
 * The rule is scheduled to run every 6 hours, starting at 6:00 AM UTC+1
 * The reminderTrigger lambda is responsible for sending reminders to users
 */
if (!(process.env.NODE_ENV === "development")) {
    // eslint-disable-next-line @typescript-eslint/ban-types -- Function is an aws-cdk-lib construct here
    const reminderTriggerLambda = backend.reminderTrigger.resources.lambda as Function;
    const rule = new eventBridge.Rule(stack, "ReminderTriggerRule", {
        enabled: false,
        schedule: eventBridge.Schedule.cron({
            minute: "0",
            hour: "6",
        }),

        description: "Rule to trigger the reminderTrigger lambda",
    });
    rule.addTarget(new eventBridgeTargets.LambdaFunction(reminderTriggerLambda));
    backend.addOutput({
        custom: {
            reminderTriggerArn: rule.ruleArn,
        },
    });
}
