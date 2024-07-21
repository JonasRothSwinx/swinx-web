import { useQuery } from "@tanstack/react-query";
import { downloadData } from "aws-amplify/storage";
import { Card, CardActionArea, CardContent, Skeleton, Typography } from "@mui/material";
import { PreviewProps } from "../FilePreview";
import { NextRequest } from "next/server";
// import PDFParser from "pdf2json";

export function TextPreview({ file }: PreviewProps) {
    const text = useQuery({
        queryKey: [file.path],
        queryFn: async () => {
            console.log("TextPreview", { file });
            const { body, contentType = "text/plain" } = await downloadData({ path: file.path })
                .result;
            console.log("TextPreview", { body, contentType });
            const text = await getTextContentFromBlob({ blob: await body.blob(), contentType });
            return text;
        },
    });
    try {
        // console.log(file);
        const url = file.url;
        const fileName = file.path.split("/").pop();
        if (text.isLoading)
            return (
                <Skeleton
                    key={"skeleton" + file.path + file.lastModified}
                    variant="rounded"
                    width={100}
                    height={200}
                />
            );
        return (
            <Card
                id="TextPreviewCard"
                raised
                key={"card" + file.path + file.lastModified}
                sx={{
                    "&": { overflow: "hidden", display: "flex", flexDirection: "column" },
                }}
            >
                <CardContent
                    sx={{
                        "&": { overflow: "auto" },
                    }}
                >
                    <Typography
                        textAlign={"left"}
                        whiteSpace={"pre-wrap"}
                        style={{ wordBreak: "break-word" }}
                    >
                        {text.isError ? `Error: ${text.error.message}` : text.data ?? "Loading..."}
                        {/* {text.data ?? "Loading..."} */}
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography textAlign={"center"}>{fileName}</Typography>
                </CardContent>
            </Card>
        );
    } catch (error) {
        console.error("ImageStorageManager", { file, error });
        return null;
    }
}

type GetTextContentFromBlob = {
    blob: Blob;
    contentType: string;
};
async function getTextContentFromBlob({ blob, contentType }: GetTextContentFromBlob) {
    switch (contentType) {
        case "text/plain": {
            return await readPlainText(blob);
        }
        case "application/pdf": {
            const res = await fetch("/api", {
                method: "POST",
                body: blob,
            });
            const text = await res.text();
            console.log("getTextContentFromBlob", { res, text });
            return text;
        }
        default: {
            return await readPlainText(blob);
        }
    }
}

async function readPlainText(blob: Blob) {
    const text = await blob.text();
    return text;
}
