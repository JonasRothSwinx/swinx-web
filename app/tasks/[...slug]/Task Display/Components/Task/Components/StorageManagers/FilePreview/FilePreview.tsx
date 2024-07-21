import { queryServer } from "../functions";
import { Box } from "@mui/material";
import { Prettify } from "@/app/Definitions/types";
import { DataType } from "../StorageManagerWrapper";
import { ImagePreview, VideoPreview, TextPreview } from "./components";

const typePreview: {
    [key in DataType]: (props: PreviewProps) => JSX.Element;
} = {
    image: (props) => <ImagePreview {...props} />,
    video: (props) => <VideoPreview {...props} />,
    text: (props) => <TextPreview {...props} />,
};
interface FilePreviewProps {
    // files: Array<Prettify<ListPaginateWithPathOutput["items"][number]> & { url: string }>;
    files: Prettify<Awaited<ReturnType<typeof queryServer.listEventImages>>>;
    dataType: DataType;
}
export function FilePreview({ files, dataType }: FilePreviewProps) {
    if (files.length === 0) return null;
    return (
        <Box
            id="FilePreviewCardContainer"
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"center"}
            marginBottom={"20px"}
            maxHeight={"100%"}
        >
            {files.map((file) => {
                return typePreview[dataType]({ file });
            })}
        </Box>
    );
}
export interface PreviewProps {
    file: { path: string; url?: string; lastModified?: Date };
}
