"use server";

export async function getEnv() {
    const env = process.env;
    console.log("env", env);
    return JSON.stringify(env);
}
