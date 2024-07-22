import { queryServer } from "../functions";
import { Box } from "@mui/material";
import { Prettify } from "@/app/Definitions/types";
import { DataType } from "../StorageManagerWrapper";
import { ImagePreview, VideoPreview, TextPreview } from "./components";
import { ListPaginateWithPathOutput } from "aws-amplify/storage";

const typePreview: {
    [key in DataType]: (props: PreviewProps) => JSX.Element;
} = {
    image: (props) => <ImagePreview {...props} />,
    video: (props) => <VideoPreview {...props} />,
    text: (props) => <TextPreview {...props} />,
};
interface FilePreviewProps {
    // files: Array<Prettify<ListPaginateWithPathOutput["items"][number]> & { url: string }>;
    files: ListPaginateWithPathOutput["items"];
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
            key={"FilePreviewCardContainer" + dataType}
        >
            {files.map((file, index) => {
                const Element = typePreview[dataType];
                try {
                    const key = `file_${file.path}_${file.lastModified?.toISOString()}`;
                    // console.log({ key });
                    return <Element key={`file_${file.path}_${key}`} file={file} />;
                } catch (error) {
                    console.error({ error, file });
                    return null;
                }
            })}
        </Box>
    );
}
export interface PreviewProps {
    file: { path: string; url?: string; lastModified?: Date };
}
