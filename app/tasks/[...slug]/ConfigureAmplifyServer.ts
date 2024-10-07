"use server";
import { Amplify } from "aws-amplify";
import config from "@/amplify_outputs.json";

export async function configureAmplifyServer() {
    // console.log("configuring amplify server");
    Amplify.configure(config, { ssr: true });
}
