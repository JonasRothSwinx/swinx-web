import { StorageManager } from "@aws-amplify/ui-react-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { preprocessFile, queryClient as query } from "../functions";
import { StorageManagerProps } from "./types";
import { onUploadSuccess } from "./functions";
import { dictionary } from "./localization";

export function VideoStorageManager({ campaignId, eventId, onSuccess }: StorageManagerProps) {
    const queryClient = useQueryClient();
    const currentFiles = useQuery({
        queryKey: [eventId, "video"],
        queryFn: async () => {
            console.log("VideoStorageManager", { campaignId, eventId });
            const res = await query.listEventVideos({
                campaignId,
                eventId,
            });
            console.log("VideoStorageManager", { res });
            return res;
        },
        retryDelay: 5000,
    });
    return (
        <StorageManager
            acceptedFileTypes={["video/*"]}
            path={`test/${campaignId}/${eventId}/video/`}
            maxFileCount={1}
            processFile={async ({ file }) => preprocessFile({ file, targetFileName: "PostVideo" })}
            // maxFileSize={20_000_000}
            isResumable
            autoUpload={false}
            onUploadSuccess={async (file) => {
                await onUploadSuccess({
                    file,
                    queryClient,
                    currentFiles,
                    campaignId,
                    eventId,
                    dataType: "video",
                });
                await onSuccess?.({ campaignId, eventId });
            }}
            displayText={dictionary}
        />
    );
}
