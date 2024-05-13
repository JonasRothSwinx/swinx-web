import { defineFunction } from "@aws-amplify/backend";

export const sesHandler = defineFunction({
    name: "sesHandler",
    entry: "sesHandler.ts",
    environment: {
        REGION: "eu-west-1",
    },
    memoryMB: 512,
    timeoutSeconds: 30,
});
