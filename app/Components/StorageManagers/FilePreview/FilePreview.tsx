import { queryServer } from "../functions";
import { Box } from "@mui/material";
import { Prettify } from "@/app/Definitions/types";
import { DataType } from "../StorageManagerDialog";
import { ImagePreview, VideoPreview, TextPreview, Controls } from "./components";
import { ListPaginateWithPathOutput } from "aws-amplify/storage";
import { ConfirmProvider } from "material-ui-confirm";

const typePreview: {
    [key in DataType]: (props: PreviewProps) => JSX.Element;
} = {
    image: (props) => <ImagePreview {...props} />,
    video: (props) => <VideoPreview {...props} />,
    text: (props) => <TextPreview {...props} />,
    mixed: (props) => (
        <Box>
            <ImagePreview {...props} />
            <VideoPreview {...props} />
            <TextPreview {...props} />
        </Box>
    ),
};
interface FilePreviewProps {
    // files: Array<Prettify<ListPaginateWithPathOutput["items"][number]> & { url: string }>;
    files: ListPaginateWithPathOutput["items"];
    dataType: DataType;
    showControls?: PreviewProps["showControls"];
}
export function FilePreview({ files, dataType, showControls }: FilePreviewProps) {
    if (files.length === 0) return null;
    return (
        <Box
            id="FilePreviewCardContainer"
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"center"}
            flexWrap={"wrap"}
            marginBottom={"20px"}
            maxHeight={"100%"}
            gap={"10px"}
            key={"FilePreviewCardContainer" + dataType}
        >
            <ConfirmProvider>
                {files.map((file, index) => {
                    const [campaignId, eventId, fileType, fileName] = file.path
                        .split("/")
                        .slice(-4);

                    const Element = typePreview[fileType as DataType];
                    try {
                        const key = `file_${file.path}_${file.lastModified?.toISOString()}`;
                        // console.log({ key });
                        return (
                            <Element
                                key={`file_${file.path}_${key}`}
                                file={file}
                                showControls={showControls}
                                campaignId={campaignId}
                                eventId={eventId}
                                // campaignId={file.path.split("/")[1]}
                                // eventId={file.path.split("/")[2]}
                            />
                        );
                    } catch (error) {
                        console.error({ error, file });
                        return null;
                    }
                })}
            </ConfirmProvider>
        </Box>
    );
}
export interface PreviewProps {
    file: { path: string; url?: string; lastModified?: Date };
    showControls?: {
        delete?: boolean;
        download?: boolean;
        approve?: boolean;
        sendToCustomer?: boolean;
        replace?: boolean;
    };
    campaignId: string;
    eventId: string;
}
