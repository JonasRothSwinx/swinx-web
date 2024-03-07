import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Function } from "aws-cdk-lib/aws-lambda";
import { sesHandler } from "./functions/sesHandler/resource.js";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { Duration } from "aws-cdk-lib/core";
import { UsagePlan } from "aws-cdk-lib/aws-apigateway";

const backend = defineBackend({
    auth,
    data,
    sesHandler,
});

const stack = backend.createStack("SwinxWebResources");

const underlyingLambda = backend.sesHandler.resources.lambda as Function;
const policyStatement = new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["ses:*"],
    resources: ["*"],
});
underlyingLambda.addToRolePolicy(policyStatement);
underlyingLambda.addFunctionUrl({
    authType: lambda.FunctionUrlAuthType.AWS_IAM,
    cors: {
        allowedOrigins: ["*"],
    },
});
const api = new apigateway.RestApi(stack, "InvokeRestApi", {
    restApiName: `InvokeRestApi_swinxWeb_${process.env.AWS_BRANCH}`,
    description: "InvokeRestApi",
    apiKeySourceType: apigateway.ApiKeySourceType.HEADER,
    defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
    },
});

const lambdaIntegration = new apigateway.LambdaIntegration(underlyingLambda, {
    // Max timeout allowed by AWS is 29 seconds
    timeout: Duration.seconds(29),
    allowTestInvoke: true,
});

api.root.addMethod("POST", lambdaIntegration, {
    apiKeyRequired: true,
});

const apiKeyValue = process.env.ADMIN_API_KEY;
const apiKey = api.addApiKey(`InvokeApiKey_${process.env.AWS_BRANCH}`, {
    value: apiKeyValue,
});

const usagePlan = new UsagePlan(stack, "InvokeUsagePlan", {
    name: `Image Gen Invoke Usage Plan ${process.env.AWS_BRANCH}`,
    apiStages: [
        {
            api,
            stage: api.deploymentStage,
        },
    ],
});
usagePlan.addApiKey(apiKey);

backend.addOutput({
    custom: {
        sesHandlerUrl: api.url,
    },
});
