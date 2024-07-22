import { metadata } from "@/app/layout";

interface PreprocessFile {
    file: File;
    targetFileName: string;
}
export async function preprocessFile({ file, targetFileName }: PreprocessFile) {
    const fileExtension = file.name.split(".").pop();
    // if (fileExtension === "pdf") {
    //     const fileBlob = new Blob([file], { type: "application/pdf" });
    //     const text = await convertPDFToText({ file: fileBlob });
    //     const newFile = new File([text], `${targetFileName}.txt`, { type: "text/plain" });
    //     console.log("preprocessFile", { file, newFile });
    //     return {
    //         file: newFile,
    //         key: `${targetFileName}.txt`,
    //         metadata: {
    //             "Content-Type": "text/plain",
    //         },
    //     };
    // }
    return {
        file,
        key: `${targetFileName}.${fileExtension}`,
        metadata: {
            step: "INFLUENCER_SUBMITTED",
        },
    };
}

async function convertPDFToText({ file }: { file: Blob }) {
    const res = await fetch("/api", {
        method: "POST",
        body: file,
    });
    const text = await res.text();
    console.log("convertPDFToText", { res, text });
    return text;
}
