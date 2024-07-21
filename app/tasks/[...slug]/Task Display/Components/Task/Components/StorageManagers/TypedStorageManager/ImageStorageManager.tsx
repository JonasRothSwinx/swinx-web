// import "@aws-amplify/ui-react/styles.css";

import { StorageManager } from "@aws-amplify/ui-react-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { preprocessFile, queryClient as query } from "../functions";
import { StorageManagerProps } from "./types";
import { onUploadSuccess } from "./functions";

export function ImageStorageManager({ campaignId, eventId }: StorageManagerProps) {
    const queryClient = useQueryClient();
    const currentFiles = useQuery({
        queryKey: [eventId, "image"],
        queryFn: async () => {
            console.log("ImageStorageManager", { campaignId, eventId });
            console.log("using serverRunner listServer");
            const res = await query.listEventImages({
                campaignId,
                eventId,
            });
            console.log("ImageStorageManager", { res });
            return res;
        },
        retryDelay: 5000,
    });
    return (
        <StorageManager
            acceptedFileTypes={["image/*"]}
            path={`test/${campaignId}/${eventId}/image/`}
            maxFileCount={1}
            processFile={async ({ file }) => preprocessFile({ file, targetFileName: "PostImage" })}
            maxFileSize={5000000}
            isResumable
            onUploadSuccess={async (file) => {
                return onUploadSuccess({
                    file,
                    queryClient,
                    currentFiles,
                    campaignId,
                    eventId,
                    dataType: "image",
                });
            }}
        />
    );
}
