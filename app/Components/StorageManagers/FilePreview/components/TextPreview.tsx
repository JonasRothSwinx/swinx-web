import { useQuery } from "@tanstack/react-query";
import { downloadData, getUrl } from "aws-amplify/storage";
import { Card, CardActionArea, CardContent, Skeleton, TextField, Typography } from "@mui/material";
import { PreviewProps } from "../FilePreview";
import { NextRequest } from "next/server";
import { Controls } from "./Controls";
// import PDFParser from "pdf2json";

export function TextPreview({ file, showControls }: PreviewProps) {
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

        const fileName = file.path.split("/").pop();
        if (text.isLoading) {
            const key = "skeleton" + file.path + file.lastModified;
            return (
                <Skeleton
                    key={key}
                    variant="rounded"
                    width={100}
                    height={200}
                />
            );
        }
        const key = "card" + file.path + file.lastModified;
        return (
            <Card
                id="TextPreviewCard"
                raised
                key={key}
                sx={{
                    "&": {
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        minWidth: "600px",
                    },
                }}
            >
                <CardContent
                    sx={{
                        "&": { overflow: "auto" },
                    }}
                >
                    {/* <Typography
                        textAlign={"left"}
                        whiteSpace={"pre-wrap"}
                        style={{ wordBreak: "break-word" }}
                    >
                        {text.isError ? `Error: ${text.error.message}` : text.data ?? "Loading..."}
                    </Typography> */}
                    <TextField
                        id="outlined-multiline-static"
                        multiline
                        minRows={10}
                        maxRows={30}
                        value={text.data ?? ""}
                        fullWidth
                    />
                </CardContent>
                <CardContent>
                    {/* <Typography textAlign={"center"}>{fileName}</Typography> */}
                    {/* <Typography textAlign={"center"}>Beitragstext</Typography> */}
                    <Controls
                        path={file.path}
                        showControls={showControls}
                    />
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
            const res = await fetch("/api/parsePdf", {
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
