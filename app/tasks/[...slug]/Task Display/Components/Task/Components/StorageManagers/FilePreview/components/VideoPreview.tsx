import { Card, CardActionArea, CardContent, CardMedia, Skeleton, Typography } from "@mui/material";
import { PreviewProps } from "../FilePreview";

export function VideoPreview({ file }: PreviewProps) {
    try {
        // console.log(file);
        const url = file.url;
        const fileName = file.path.split("/").pop();
        if (!url)
            return (
                <Skeleton
                    key={"skeleton" + file.path + file.lastModified}
                    variant="rounded"
                    width={100}
                    height={200}
                />
            );
        return (
            <Card
                raised
                key={"card" + file.path + file.lastModified}
            >
                <CardActionArea>
                    <CardMedia
                        component={"video"}
                        src={url}
                        width={200}
                        style={{ maxHeight: "200px" }}
                        controls
                        title={fileName}
                    />
                    <CardContent>
                        <Typography textAlign={"center"}>{fileName}</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    } catch (error) {
        console.error("ImageStorageManager", { file, error });
        return null;
    }
}
