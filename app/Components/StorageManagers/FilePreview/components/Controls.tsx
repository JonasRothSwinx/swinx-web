"use client";
import { Box, Button, SxProps } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { downloadData, getUrl, remove } from "aws-amplify/storage";
import { PreviewProps } from "../FilePreview";
import { useMemo, useState } from "react";
import { DataType, StorageManagerDialog } from "../../StorageManagerDialog";
import { dataClient } from "@/app/tasks/[...slug]/Functions/Database";

interface ControlsProps {
    path: string;
    showControls?: PreviewProps["showControls"];
    onDataChange?: () => Promise<void>;
}
export function Controls(props: ControlsProps) {
    const { path, showControls = {} } = props;
    const buttonAmount = Object.keys(showControls).length;
    const sx: SxProps = useMemo(
        () => ({
            "&": {
                display: "flex",
                flexDirection: "row",
                justifyContent: buttonAmount > 1 ? "space-between" : "center",
                gap: "10px",
                width: "100%",
            },
        }),
        [buttonAmount],
    );
    if (!showControls || buttonAmount === 0) return null;
    return (
        <Box
            id={"PreviewControls"}
            sx={sx}
        >
            {showControls.download && <DownloadButton {...props} />}
            {showControls.delete && <DeleteButton {...props} />}
            {/* {showControls.approve && <ApproveButton {...props} />} */}
            {showControls.replace && <ReplaceButton {...props} />}
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
            await dataClient.updateEventStatus({
                eventId,
                status: "WAITING_FOR_DRAFT",
            });
            await queryClient.invalidateQueries({ queryKey: [eventId, fileType] });
            await queryClient.invalidateQueries({ queryKey: ["files"] });
            await queryClient.invalidateQueries({ queryKey: ["timelineEvent", eventId] });
            return;
        },
        onError: (error) => {
            alert("Error deleting file: " + error.message);
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
function ReplaceButton({ path, onDataChange }: ControlsProps) {
    const [campaignId, eventId, fileType, fileName] = path.split("/").slice(-4);
    const [open, setOpen] = useState(false);
    return (
        <>
            {open && (
                <StorageManagerDialog
                    onClose={() => setOpen(false)}
                    dataType={fileType as DataType}
                    campaignId={campaignId}
                    eventId={eventId}
                    hidePreview
                    onUploadSuccess={onDataChange}
                />
            )}
            <Button
                onClick={() => {
                    setOpen(true);
                }}
            >
                Ersetzen
            </Button>
        </>
    );
}
function ApproveButton({ path }: ControlsProps) {
    return <Button>Freigeben</Button>;
}
