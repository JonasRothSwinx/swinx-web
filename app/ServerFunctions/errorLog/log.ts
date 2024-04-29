"use server";

export default async function log(text: string) {
    console.error(text);
    return text;
}
