import { StorageManager } from "@aws-amplify/ui-react-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { preprocessFile, queryClient as query } from "../functions";
import { StorageManagerProps } from "./types";
import { onUploadSuccess } from "./functions";
import { useEffect, useRef, useState } from "react";
import { Box, Button, SxProps, TextField } from "@mui/material";
import { downloadData, uploadData } from "aws-amplify/storage";

export function TextStorageManager({ campaignId, eventId }: StorageManagerProps) {
    const queryClient = useQueryClient();
    const currentFiles = useQuery({
        queryKey: [eventId, "text"],
        queryFn: async () => {
            const res = await query.listEventTexts({
                campaignId,
                eventId,
            });
            return res;
        },
        retryDelay: 5000,
    });
    return (
        <TextBoxInputManager
            campaignId={campaignId}
            eventId={eventId}
        />
    );
    return (
        <StorageManager
            acceptedFileTypes={["text/plain", "application/pdf"]}
            path={`test/${campaignId}/${eventId}/text/`}
            maxFileCount={1}
            processFile={async ({ file }) => preprocessFile({ file, targetFileName: "PostText" })}
            maxFileSize={5000000}
            isResumable
            onUploadSuccess={async (file) => {
                return onUploadSuccess({
                    file,
                    queryClient,
                    currentFiles,
                    campaignId,
                    eventId,
                    dataType: "text",
                });
            }}
        />
    );
}

function TextBoxInputManager({ campaignId, eventId }: StorageManagerProps) {
    const queryClient = useQueryClient();
    const currentFiles = useQuery({
        queryKey: [eventId, "textContent"],
        queryFn: async () => {
            const res = await query.listEventTexts({
                campaignId,
                eventId,
            });
            if (res.length === 0) return null;
            const textContent = await downloadData({
                path: res[0].path,
            }).result.then((res) => res.body.text());
            return textContent;
        },
        retryDelay: 5000,
    });
    const [text, setText] = useState<string | null>(null);
    const upload = useMutation({
        onMutate: async (text: string) => {
            const res = await uploadTextAsFile({
                text,
                path: `test/${campaignId}/${eventId}/text/`,
            });
            return res;
        },
    });
    useEffect(() => {
        console.log({ currentFiles: currentFiles.data });
        if (currentFiles.data) setText(currentFiles.data);
    }, [currentFiles.data]);
    const sx: SxProps = {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    };
    return (
        <Box sx={sx}>
            <TextField
                type="text"
                multiline
                value={text}
                placeholder="Geben sie hier ihren Beitragstext ein"
                onChange={(e) => setText(e.target.value)}
            />
            <Button
                disabled={text === null || upload.isPending}
                onClick={async () => {
                    if (!text) return;
                    upload.mutate(text);
                }}
                variant="contained"
            >
                {currentFiles.data !== null ? "Hochladen" : "Änderungen speichern"}
            </Button>
        </Box>
    );
}

type OnProgressFunctionParams = {
    transferredBytes: number;
    totalBytes: number;
};
interface UploadTextAsFile {
    text: string;
    path: string;
    onProgress?: (params: OnProgressFunctionParams) => void;
}
async function uploadTextAsFile({ text, path, onProgress }: UploadTextAsFile) {
    const file = new File([text], "PostText.txt", {
        type: "text/plain",
    });
    const res = uploadData({
        data: file,
        path: `${path}${file.name}`,
        options: {
            onProgress,
            contentType: "text/plain",
            metadata: {
                state: "INFLUENCER_SUBMITTED",
            },
        },
    });
    await res.result;
    console.log("Upload complete", { res });
    return;
}
