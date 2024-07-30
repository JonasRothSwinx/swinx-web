import { Box, Button, SxProps } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { downloadData, getUrl, remove } from "aws-amplify/storage";
import { PreviewProps } from "../FilePreview";

interface ControlsProps {
    path: string;
    showControls?: PreviewProps["showControls"];
}
export function Controls({ path, showControls = {} }: ControlsProps) {
    const sx: SxProps = {
        "&": {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "10px",
        },
    };
    return (
        <Box>
            <DownloadButton path={path} />
            <DeleteButton path={path} />
        </Box>
    );
}

function DownloadButton({ path }: ControlsProps) {
    // console.log("Download", path);
    const downloadFile = useMutation({
        onMutate: async () => {
            console.log("Download mutate", path);
            // if (!url.data) return;
            const response = await downloadData({ path }).result;
            const blob = await response.body?.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            const fileName = path.split("/").pop() ?? "file";
            a.href = url;
            a.download = fileName;
            a.click();
            a.remove();
        },
    });
    if (downloadFile.isPending) {
        return <Button onClick={() => downloadFile.mutate()}>Downloading...</Button>;
    }
    return (
        <Button
            onClick={() => {
                console.log("DownloadButton", path);
                downloadFile.mutate();
            }}
        >
            Download
        </Button>
    );
}
function DeleteButton({ path }: ControlsProps) {
    const [campaignId, eventId, fileType, fileName] = path.split("/").slice(-4);
    // console.log("DeleteButton", { path, campaignId, eventId, fileType, fileName });
    const queryClient = useQueryClient();
    const deleteFile = useMutation({
        mutationFn: async () => {
            console.log("Delete mutate", path);
            // if (!url.data) return;
            const response = await remove({ path });
            await queryClient.invalidateQueries({ queryKey: [eventId, fileType] });
            return;
        },
        onError: (error) => {
            alert("Error deleting file: " + error);
        },
    });
    return (
        <Button
            disabled={deleteFile.isPending}
            onClick={() => {
                console.log("DeleteButton", path);
                deleteFile.mutate();
            }}
        >
            Löschen
        </Button>
    );
}
