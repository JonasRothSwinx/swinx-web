import { StorageImage } from "@aws-amplify/ui-react-storage";
// import "@aws-amplify/ui-react/styles.css";

import { StorageManager } from "@aws-amplify/ui-react-storage";
import { preprocessFile, queryClient } from "./functions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUrl, list, remove, type ListPaginateWithPathOutput } from "aws-amplify/storage";
import { Box, SxProps, Dialog } from "@mui/material";
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

const hidePreviewConfig: { [key in DataType]: boolean } = {
    image: false,
    video: false,
    text: true,
};
interface StorageManagerWrapperProps {
    campaignId: string;
    eventId: string;
    dataType: DataType;
    onClose: () => void;
    showControls?: boolean;
}

export function StorageManagerDialog({
    campaignId,
    eventId,
    dataType,
    onClose,
    showControls = false,
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
    const hidePreview = hidePreviewConfig[dataType];
    const StorageManager = StorageManagers[dataType];
    const sx: SxProps = {
        "&": {
            width: "100%",
            ".DialogContent": {
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                padding: "20px",
                overflow: "hidden",
                height: "100%",
                // minWidth: "max(400px , 50dvw)",
                ".FilePreviewContainer": {
                    flex: 2,
                    flexBasis: "fit-content",
                    maxHeight: "100%",
                },
                ".StorageManagerContainer": {
                    flex: 1,
                    minWidth: "fit-content",
                    // flexBasis: "20%",
                    maxHeight: "100%",
                },
            },
        },
    };
    return (
        <Dialog
            id="StorageManagerWrapper"
            open
            onClose={onClose}
            sx={sx}
        >
            <Box className="DialogContent">
                {hidePreview ? null : (
                    <Box
                        id="FilePreview"
                        className="FilePreviewContainer"
                    >
                        <FilePreview
                            files={currentFiles.data ?? []}
                            dataType={dataType}
                            controls={showControls}
                        />
                    </Box>
                )}
                <Box
                    id="StorageManager"
                    className="StorageManagerContainer"
                >
                    <StorageManager
                        campaignId={campaignId}
                        eventId={eventId}
                    />
                </Box>
            </Box>
        </Dialog>
    );
}
