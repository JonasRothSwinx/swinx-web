import { StorageImage } from "@aws-amplify/ui-react-storage";
// import "@aws-amplify/ui-react/styles.css";

import { StorageManager } from "@aws-amplify/ui-react-storage";
import { preprocessFile, queryClient } from "./functions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUrl, list, remove, type ListPaginateWithPathOutput } from "aws-amplify/storage";
import { Box } from "@mui/material";
import {
    ImageStorageManager,
    StorageManagerProps,
    TextStorageManager,
    VideoStorageManager,
} from "./TypedStorageManager";
import { FilePreview } from "./FilePreview";
export type DataType = "image" | "video" | "text";

const StorageManagers: { [key in DataType]: (props: StorageManagerProps) => JSX.Element } = {
    image: (props) => ImageStorageManager(props),
    video: (props) => VideoStorageManager(props),
    text: (props) => TextStorageManager(props),
};
const listFunctions: {
    [key in DataType]: (props: {
        campaignId: string;
        eventId: string;
    }) => queryClient.ListEventFilesOutput;
} = {
    image: ({ campaignId, eventId }) => queryClient.listEventImages({ campaignId, eventId }),
    video: ({ campaignId, eventId }) => queryClient.listEventVideos({ campaignId, eventId }),
    text: ({ campaignId, eventId }) => queryClient.listEventTexts({ campaignId, eventId }),
};
interface StorageManagerWrapperProps {
    campaignId: string;
    eventId: string;
    dataType: DataType;
}

export function StorageManagerWrapper({
    campaignId,
    eventId,
    dataType,
}: StorageManagerWrapperProps) {
    const queryClient = useQueryClient();
    const currentFiles = useQuery({
        queryKey: [eventId, dataType],
        queryFn: async () => {
            return await listFunctions[dataType]({
                campaignId,
                eventId,
            });
        },
    });
    return (
        <Box
            id="StorageManagerWrapper"
            display={"flex"}
            flexDirection={"row"}
            maxWidth={"100%"}
            gap={"20px"}
            overflow={"hidden"}
            height={"100%"}

            // minWidth={"max(400px , 50dvw)"}
        >
            <Box
                // flexBasis={"80%"}
                flex={2}
                maxHeight={"100%"}
                id="FilePreview"
            >
                <FilePreview
                    files={currentFiles.data ?? []}
                    dataType={dataType}
                />
            </Box>
            <Box
                id="StorageManager"
                height={"100%"}
                maxHeight={"100%"}
                flex={1}
                display={"flex"}
            >
                {StorageManagers[dataType]({
                    campaignId,
                    eventId,
                })}
            </Box>
        </Box>
    );
}
