import { dataClient } from "@/app/tasks/[...slug]/Functions/Database";
import { Task, TimelineEvent } from "@/app/tasks/[...slug]/Functions/Database/types";
import { Box, Button, Dialog, SxProps } from "@mui/material";
import { UseMutationResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { config } from "..";
import { useMemo, useState } from "react";
import { StorageManagerWrapper } from "./StorageManagers";
import { queryClient, queryServer } from "./StorageManagers/functions";

//#region Definitions
const ActionNames = [
    // "Aufgabe Erledigt",
    "Text hochladen",
    "Bild hochladen",
    "Video hochladen",
    "Link einfügen",
];
//#endregion

interface ActionProps {
    task: TimelineEvent;
    campaignId: string;
    eventId: string;
}

export default function Actions({ task, campaignId, eventId }: ActionProps) {
    const queryClient = useQueryClient();
    const DataChanges = {
        markFinished: useMutation({
            mutationFn: async ({ isCompleted }: { isCompleted: boolean }) => {
                console.log("markFinished");
                queryClient.setQueryData<Task>(["task"], (prev) => {
                    if (!prev) return prev;
                    const newData = { ...prev };
                    if (!newData.events) return newData;
                    newData.events = newData.events.map((event) => {
                        if (event.id === task.id) {
                            event.isCompleted = true;
                        }
                        return event;
                    });
                    return newData;
                });
                return dataClient.markEventFinished({ eventId: task.id, isCompleted });
            },
            onSettled: () => {
                queryClient.invalidateQueries({
                    queryKey: ["task"],
                });
            },
        }),
    };
    const sx: SxProps = {
        "&": {
            "flexGrow": 0,
            "display": "flex",
            "flexDirection": "column",
            "paddingLeft": "5px",
            "gap": "2px",
            "width": "min-content",
            ".actionButton": {
                // "backgroundColor": "red",
                // "color": "white",
                "lineHeight": "1.2",
                "textTransform": "none",
                "&:hover": {
                    // backgroundColor: "darkred",
                },
                "&.hasFile": {
                    backgroundColor: "green",
                },
            },
        },
    };
    const fileDialogSx: SxProps = {
        "&": {
            // "transform": "rotate(90deg)",
            // "backgroundColor": "red",
            ".MuiDialog-paper": {
                padding: "10px",
                display: "flex",
                maxWidth: "90dvw",
                width: "max(400px , 80dvw)",
            },
        },
    };
    const actionConfig = useMemo(() => {
        let possibleActions: config.ActionConfig = {
            markFinished: false,
            uploadText: false,
            uploadImage: false,
            uploadVideo: false,
            uploadLink: false,
        };
        if (!task) return possibleActions;
        else if (!task.timelineEventType) return possibleActions;
        else if (!config.eventTypes.includes(task.timelineEventType as config.eventType))
            return possibleActions;
        else {
            const taskType: config.eventType = task.timelineEventType as config.eventType;
            possibleActions = { ...possibleActions, ...config.possibleAction[taskType] };
        }
        return possibleActions;
    }, [task]);
    return (
        <Box sx={sx}>
            {actionConfig.markFinished && (
                <FinishButton
                    task={task}
                    markFinished={DataChanges.markFinished}
                />
            )}
            {actionConfig.uploadText && (
                <UploadTextButton
                    task={task}
                    fileDialogSx={fileDialogSx}
                    campaignId={campaignId}
                    eventId={eventId}
                />
            )}
            {actionConfig.uploadImage && (
                <UploadImageButton
                    task={task}
                    fileDialogSx={fileDialogSx}
                    campaignId={campaignId}
                    eventId={eventId}
                />
            )}
            {actionConfig.uploadVideo && (
                <UploadVideoButton
                    task={task}
                    fileDialogSx={fileDialogSx}
                    campaignId={campaignId}
                    eventId={eventId}
                />
            )}
            {actionConfig.uploadLink && (
                <UploadLinkButton
                    task={task}
                    fileDialogSx={fileDialogSx}
                />
            )}
        </Box>
    );
}
interface FinishButtonProps {
    task: TimelineEvent;
    markFinished: UseMutationResult<boolean, Error, { isCompleted: boolean }, unknown>;
}
function FinishButton({ task, markFinished }: FinishButtonProps) {
    const isCompleted = task.isCompleted ?? false;
    return (
        <Button
            className="actionButton finishButton"
            variant="contained"
            onClick={() => markFinished.mutate({ isCompleted: !task.isCompleted })}
            disabled={markFinished.isPending || isCompleted}
        >
            Aufgabe erledigt
        </Button>
    );
}

interface UploadTextButtonProps {
    task: TimelineEvent;
    fileDialogSx?: SxProps;
    campaignId: string;
    eventId: string;
}
function UploadTextButton({ task, fileDialogSx, campaignId, eventId }: UploadTextButtonProps) {
    const [open, setOpen] = useState(false);
    const files = useQuery({
        queryKey: [eventId, "text"],
        queryFn: async () => {
            const files = await queryClient.listEventTexts({
                campaignId,
                eventId,
            });
            console.log("UploadTextButton", { files });
            return files;
        },
    });
    const hasFile: boolean = (files.data && files.data.length > 0) ?? false;
    const className = useMemo(() => {
        return `actionButton ${hasFile ? "hasFile" : ""}`;
    }, [hasFile]);
    return (
        <>
            <Dialog
                className="FileDialog"
                open={open}
                onClose={() => setOpen(false)}
                sx={fileDialogSx}
            >
                <StorageManagerWrapper
                    campaignId={campaignId}
                    eventId={eventId}
                    dataType={"text"}
                />
            </Dialog>
            <Button
                className={className}
                variant="contained"
                onClick={() => setOpen(true)}
            >
                Text hochladen
            </Button>
        </>
    );
}

interface UploadImageButtonProps {
    task: TimelineEvent;
    fileDialogSx?: SxProps;
    campaignId: string;
    eventId: string;
}
function UploadImageButton({ task, fileDialogSx, campaignId, eventId }: UploadImageButtonProps) {
    const [open, setOpen] = useState(false);
    const files = useQuery({
        queryKey: [eventId, "image"],
        queryFn: async () => {
            const files = await queryClient.listEventImages({
                campaignId,
                eventId,
            });
            return files;
        },
    });
    const hasFile: boolean = (files.data && files.data.length > 0) ?? false;
    const className = useMemo(() => {
        return `actionButton ${hasFile ? "hasFile" : ""}`;
    }, [hasFile]);
    return (
        <>
            <Dialog
                className="FileDialog"
                open={open}
                onClose={() => setOpen(false)}
                sx={fileDialogSx}
            >
                <StorageManagerWrapper
                    campaignId={campaignId}
                    eventId={eventId}
                    dataType={"image"}
                />
            </Dialog>
            <Button
                className={className}
                variant="contained"
                onClick={() => setOpen(true)}
            >
                Bild hochladen
            </Button>
        </>
    );
}

interface UploadVideoButtonProps {
    task: TimelineEvent;
    fileDialogSx?: SxProps;
    campaignId: string;
    eventId: string;
}

function UploadVideoButton({ task, fileDialogSx, campaignId, eventId }: UploadVideoButtonProps) {
    const [open, setOpen] = useState(false);
    const files = useQuery({
        queryKey: [eventId, "video"],
        queryFn: async () => {
            const files = await queryClient.listEventVideos({
                campaignId,
                eventId,
            });
            return files;
        },
    });
    const hasFile: boolean = (files.data && files.data.length > 0) ?? false;
    const className = useMemo(() => {
        return `actionButton ${hasFile ? "hasFile" : ""}`;
    }, [hasFile]);
    return (
        <>
            <Dialog
                className="FileDialog"
                open={open}
                onClose={() => setOpen(false)}
                sx={fileDialogSx}
            >
                <StorageManagerWrapper
                    campaignId={campaignId}
                    eventId={eventId}
                    dataType={"video"}
                />
            </Dialog>
            <Button
                className={className}
                variant="contained"
                onClick={() => setOpen(true)}
            >
                Video hochladen
            </Button>
        </>
    );
}

interface UploadLinkButtonProps {
    task: TimelineEvent;
    fileDialogSx?: SxProps;
}

function UploadLinkButton({ task }: UploadLinkButtonProps) {
    return (
        <Button
            className="actionButton linkButton"
            variant="contained"
        >
            Link einfügen
        </Button>
    );
}
