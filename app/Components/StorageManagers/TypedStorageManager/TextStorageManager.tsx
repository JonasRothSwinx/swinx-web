import { StorageManager } from "@aws-amplify/ui-react-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { preprocessFile, queryClient as query } from "../functions";
import { StorageManagerProps } from "./types";
import { onUploadSuccess } from "./functions";
import { useEffect, useRef, useState } from "react";
import { Box, Button, SxProps, TextField } from "@mui/material";
import { downloadData, uploadData } from "aws-amplify/storage";

export function TextStorageManager({
    campaignId,
    eventId,
    onSuccess: successCallback,
}: StorageManagerProps) {
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
            onSuccess={successCallback}
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

function TextBoxInputManager({ campaignId, eventId, onSuccess }: StorageManagerProps) {
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
    const [text, setText] = useState<string>("");
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const upload = useMutation({
        onMutate: async (text: string) => {
            const res = await uploadTextAsFile({
                text,
                path: `test/${campaignId}/${eventId}/text/`,
                campaignId,
                eventId,
                onSuccess,
            });
            return res;
        },
    });
    useEffect(() => {
        console.log({ currentFiles: currentFiles.data });
        if (currentFiles.data) setText(currentFiles.data);
        else setText("");
    }, [currentFiles.data]);
    useEffect(() => {
        console.log({ text });
        if (currentFiles.data !== text) setHasChanges(true);
        else setHasChanges(false);
    }, [text, currentFiles.data]);
    const sx: SxProps = {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        // maxHeight: "100%",
        ".text-input": {
            flex: 1,
            flexBasis: "fit-content",
            minWidth: "min(600px, 80vw)",
            maxWidth: "80vw",
            // ".MuiTextField-root": {
            //     overflow: "auto",
            // },
        },
    };
    return (
        <Box
            id="TextStorageManager"
            sx={sx}
        >
            <TextField
                type="text"
                className="text-input"
                multiline
                minRows={10}
                maxRows={20}
                value={text}
                placeholder="Geben sie hier ihren Beitragstext ein"
                onChange={(e) => setText(e.target.value)}
                error={text.length > 2000}
                helperText={
                    text.length > 2000 ? `Der Text ist zu lang: ${text.length}/2000 Zeichen` : ""
                }
            />
            <Button
                disabled={text === null || upload.isPending || !hasChanges}
                onClick={async () => {
                    if (!text) return;
                    upload.mutate(text);
                }}
                variant="contained"
            >
                {currentFiles.data === "" ? "Hochladen" : "Änderungen speichern"}
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
    onSuccess?: StorageManagerProps["onSuccess"];
    campaignId: string;
    eventId: string;
}
async function uploadTextAsFile({
    text,
    path,
    onProgress,
    onSuccess,
    campaignId,
    eventId,
}: UploadTextAsFile) {
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
    await onSuccess?.({ campaignId, eventId });
    return;
}
