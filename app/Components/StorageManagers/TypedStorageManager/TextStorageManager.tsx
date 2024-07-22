import { StorageManager } from "@aws-amplify/ui-react-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { preprocessFile, queryClient as query } from "../functions";
import { StorageManagerProps } from "./types";
import { onUploadSuccess } from "./functions";
import { Divider, Flex, Text, DropZoneProps } from "@aws-amplify/ui-react";
import { useRef } from "react";

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
