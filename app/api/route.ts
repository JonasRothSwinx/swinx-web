import { NextRequest } from "next/server";
import { readPdf } from "./parsePDF";
import PdfParser from "pdf2json";
// import pdf from "pdf-parse";

export async function POST(req: NextRequest) {
    const pdfParser = new PdfParser(null, true);
    console.log("POST /api/parsePDF");
    console.log({ req });
    const blob = await req.blob();
    console.log({ blob });
    const arrayBuffer = await blob.arrayBuffer();
    console.log({ arrayBuffer });
    const buffer = Buffer.from(arrayBuffer);
    console.log({ buffer });
    const promise = new Promise<string>((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (errData) => {
            console.error("Error", errData);
            reject(errData);
        });
        pdfParser.on("pdfParser_dataReady", (pdfData) => {
            const text = pdfParser.getRawTextContent();
            pdfData.Pages.forEach((page) => {
                console.log("Page", page);
            });
            console.log(pdfParser.getRawTextContent());
            console.log("Data", text);
            resolve(text);
        });
        // pdfParser.loadPDF("./app/api/Rechnung Strom.pdf");
        pdfParser.parseBuffer(buffer);
    });
    const text = (await promise)
        .split("\n")
        .filter((line) => !line.match(/Page \([0-9]?\) Break/))
        .join("\n");
    // await pdf(buffer).then((data) => {
    //     console.log("pdf-parse", { data });
    // });

    // const text = await readPdf(blob);
    // console.log({ text });
    return new Response(text, {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
        },
    });
}
