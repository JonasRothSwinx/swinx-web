"use server";
export async function log(content: string) {
    "use server";
    console.log("I've been called");
    sleep(1000);
}
function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
