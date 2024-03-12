import { defineFunction, secret } from "@aws-amplify/backend";

export const reminderTrigger = defineFunction({
    name: "reminderTrigger",
    entry: "handler.ts",
    environment: {
        BASE_URL: secret("BASE_URL"),
        REGION: "eu-west-1",
    },
});
