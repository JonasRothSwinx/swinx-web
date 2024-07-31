"use server";

import pdf from "pdf-parse";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function readPdf(blob: Blob): Promise<string> {
    console.log("Reading PDF", blob);
    return "PDF";
    const buffer = Buffer.from(await blob.arrayBuffer());
    return new Promise<string>((resolve, reject) => {
        console.log("Reading PDF (in promise)", buffer);
        pdf(buffer).then(function (data) {
            resolve(data.text);
        });
    });
}
