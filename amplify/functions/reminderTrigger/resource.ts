import { defineFunction, secret } from "@aws-amplify/backend";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export const reminderTrigger = defineFunction({
    name: "reminderTrigger",
    entry: "handler.ts",
    environment: {
        BASE_URL: process.env.BASE_URL ?? "null",
        REGION: "eu-west-1",
    },
});
