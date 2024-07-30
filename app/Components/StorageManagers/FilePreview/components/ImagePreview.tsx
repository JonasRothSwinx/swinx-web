import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Skeleton,
    SxProps,
    Typography,
} from "@mui/material";
import { PreviewProps } from "../FilePreview";
import { useQuery } from "@tanstack/react-query";
import { getUrl } from "aws-amplify/storage";
import { Controls } from "./Controls";

export function ImagePreview({ file, showControls }: PreviewProps) {
    try {
        // console.log(file);
        const url = useQuery({
            queryKey: [file.path, "url"],
            queryFn: async () => {
                const url = await getUrl({ path: file.path });
                return url.url.toString();
            },
        });
        const fileName = file.path.split("/").pop();
        if (!url.data)
            return (
                <Skeleton key={"skeleton" + file.path + file.lastModified} variant="rounded" width={100} height={200} />
            );
        const sx: SxProps = {
            "&": {},
        };
        return (
            <Card raised key={"card" + file.path + file.lastModified} sx={sx}>
                {/* <CardActionArea> */}
                <CardMedia
                    component={"img"}
                    src={url.data}
                    width={200}
                    style={{ maxHeight: "200px" }}
                    // controls
                    title={fileName}
                />
                <CardContent>
                    {/* <Typography textAlign={"center"}>{fileName}</Typography> */}
                    {/* <Typography textAlign={"center"}>Beitragsbild</Typography> */}
                    <Controls path={file.path} showControls={showControls} />
                </CardContent>
                {/* </CardActionArea> */}
            </Card>
        );
    } catch (error) {
        console.error("ImageStorageManager", { file, error });
        return null;
    }
}
