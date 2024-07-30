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
import { FilePreview, type PreviewProps } from "./FilePreview";
import { onUploadSuccess } from "./TypedStorageManager/functions";

export type DataType = "image" | "video" | "text" | "mixed";

const StorageManagers: { [key in DataType]: (props: StorageManagerProps) => JSX.Element } = {
    image: (props) => ImageStorageManager(props),
    video: (props) => VideoStorageManager(props),
    text: (props) => TextStorageManager(props),
    mixed: () => <div>Not Implemented</div>,
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
    mixed: ({ campaignId, eventId }) => queryClient.listAllEventFiles({ campaignId, eventId }),
};

const hidePreviewConfig: { [key in DataType]: boolean } = {
    image: false,
    video: false,
    text: true,
    mixed: false,
};
interface StorageManagerDialogProps {
    campaignId: string;
    eventId: string;
    dataType: DataType;
    hidePreview?: boolean;
    hideUploader?: boolean;
    showControls?: PreviewProps["showControls"];

    onClose: () => void;
    onUploadSuccess?: StorageManagerProps["onSuccess"];
}

export function StorageManagerDialog({
    campaignId,
    eventId,
    dataType,
    showControls,
    hidePreview = false,
    hideUploader = false,

    onClose,
    onUploadSuccess,
}: StorageManagerDialogProps) {
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
    const hidePreviewSetting = hidePreview || hidePreviewConfig[dataType];
    const StorageManager = StorageManagers[dataType];
    const sx: SxProps = {
        "&": {
            width: "100%",
            ".MuiPaper-root": {
                maxHeight: "100dvh",
                maxWidth: "100dvw",
                ".DialogContent": {
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                    padding: "20px",
                    overflow: "hidden",
                    // overflowY: "auto",
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
                        display: "flex",
                        ".amplify-storagemanager * ": {
                            maxWidth: "70vw",
                            height: "100%",
                            // animation: "rotate .2s linear infinite",
                            // "@keyframes rotate": {
                            //     from: {
                            //         transform: "rotate(0deg)",
                            //     },
                            //     to: {
                            //         transform: "rotate(360deg)",
                            //     },
                            // },
                        },
                    },
                },
            },
            "@media (max-width: 800px)": {
                ".MuiPaper-root": {
                    margin: "20px",
                    ".DialogContent": {
                        flexDirection: "column-reverse",
                        gap: "20px",
                        ".FilePreviewContainer": {
                            flex: 1,
                            flexBasis: "fit-content",
                            maxHeight: "50%",
                            ".MuiCard-root": {
                                // display: "flex",
                                justifyContent: "center",
                                ".MuiCardMedia-root": {
                                    width: "unset",
                                    maxWidth: "100%",
                                    height: "100px",
                                    margin: "auto",
                                },
                            },
                        },
                        ".StorageManagerContainer": {
                            flex: 1,
                            flexBasis: "fit-content",
                            maxHeight: "50%",
                            maxWidth: "100%",
                        },
                    },
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
                {hidePreviewSetting ||
                !currentFiles.data ||
                currentFiles.data.length === 0 ? null : (
                    <Box
                        id="FilePreview"
                        className="FilePreviewContainer"
                    >
                        <FilePreview
                            files={currentFiles.data ?? []}
                            dataType={dataType}
                            showControls={showControls}
                        />
                    </Box>
                )}
                {!hideUploader && (
                    <Box
                        id="StorageManager"
                        className="StorageManagerContainer"
                    >
                        <StorageManager
                            campaignId={campaignId}
                            eventId={eventId}
                            onSuccess={onUploadSuccess}
                        />
                    </Box>
                )}
            </Box>
        </Dialog>
    );
}
