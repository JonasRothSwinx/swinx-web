import { DataType, FilePreview } from "@/app/Components";
import { Box, SxProps, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ListPaginateWithPathOutput, getProperties, list } from "aws-amplify/storage";

interface MediaPreview {
    campaignId: string;
}
export function MediaPreview({ campaignId }: MediaPreview) {
    const allFiles = useQuery({
        queryKey: [campaignId, "files"],
        queryFn: async () => {
            const items = (await list({ path: `test/${campaignId}/` })).items;
            const grouped = await groupFilesByEvent({ files: items });
            console.log(grouped);
            return grouped;
        },
    });
    const sx: SxProps = {
        "&.MediaColumn": {
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1rem",
            ".EventMediaContainer": {
                border: "1px solid black",
                borderRadius: "20px",
                padding: "10px",
            },
        },
    };
    return (
        <Box id="MediaColumn" className="MediaColumn" sx={sx}>
            <Typography>Media</Typography>
            {allFiles.isLoading && <Typography>Loading...</Typography>}
            {allFiles.data &&
                Object.entries(allFiles.data).map(([event, entry]) => {
                    return (
                        <Box key={event} className="EventMediaContainer">
                            <Typography variant="subtitle1">Event: {event}</Typography>
                            {Object.entries(entry).map(([dataType, data]) => {
                                switch (dataType as DataType) {
                                    case "image": {
                                        // return "Image";
                                        return FilePreview({ files: data, dataType: "image" });
                                    }
                                    case "video": {
                                        // return "Video";
                                        return FilePreview({ files: data, dataType: "video" });
                                    }
                                    case "text": {
                                        // return "Text";
                                        return FilePreview({ files: data, dataType: "text" });
                                    }
                                    default: {
                                        return <></>;
                                    }
                                }
                            })}
                        </Box>
                    );
                })}
            {/* {JSON.stringify(allFiles.data, null, 2)} */}
        </Box>
    );
}

interface GroupFilesByEvent {
    files: ListPaginateWithPathOutput["items"];
}
interface GroupFilesByEventOutput {
    [key: string]: { [dataKey in DataType]?: ListPaginateWithPathOutput["items"] };
}
async function groupFilesByEvent({ files }: GroupFilesByEvent): Promise<GroupFilesByEventOutput> {
    const out: GroupFilesByEventOutput = {};
    await Promise.all(
        files.map(async (file) => {
            const properties = await getProperties({ path: file.path });
            console.log({ properties });
            const [eventId, data, fileName] = file.path.split("/").slice(-3);
            const dataKey = data as DataType;
            console.log({ file, eventId, dataKey });
            if (!eventId || !dataKey) return;
            if (!out[eventId]) {
                out[eventId] = {};
            }
            if (!out[eventId][dataKey]) {
                out[eventId][dataKey] = [file];
            } else {
                out[eventId]?.[dataKey]?.push(file);
            }
            return;
        })
    );
    return out;
}
