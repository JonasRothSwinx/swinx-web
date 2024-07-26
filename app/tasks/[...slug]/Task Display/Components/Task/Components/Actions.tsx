import { dataClient } from "@/app/tasks/[...slug]/Functions/Database";
import { Task, TimelineEvent } from "@/app/tasks/[...slug]/Functions/Database/types";
import { Box, Button, Dialog, SxProps, Typography } from "@mui/material";
import { UseMutationResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { config } from "..";
import { useMemo, useState } from "react";
import { StorageManagerDialog } from "@/app/Components";
import { queryClient, queryServer } from "@/app/Components/StorageManagers/functions";
import { useConfirm } from "material-ui-confirm";
import {
    markEventFinished,
    updateEventStatus,
} from "@/app/tasks/[...slug]/Functions/Database/dbOperations";

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
            flexGrow: 0,
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            gap: "20px",
            width: "min-content",
            minWidth: "200px",
            background: "#E8E8E8",
            // background: "#CFCFCF",
            jsutiifyContent: "center",
            // borderLeft: "1px solid black",
            ".actionButton": {
                // "backgroundColor": "red",
                color: "black",
                borderRadius: "10px",
                padding: "5px 20px",
                lineHeight: "1.2",
                textTransform: "none",
                backgroundColor: "white",
                fontSize: 16,
                flex: 1,
                "&:hover": {
                    backgroundColor: "var(--swinx-blue-light)",
                    // backgroundColor: "lightgray",
                },
                "&.hasFile": {
                    backgroundColor: "lightgray",
                    ".ButtonText": {
                        textDecoration: "line-through",
                    },
                    ".Checkmark": {
                        backgroundColor: "#E8E8E8",
                        borderRadius: "50%",
                        padding: "2px",
                        width: "1.5rem",
                        height: "1.5rem",
                        color: "limegreen",
                    },
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
        <Box
            sx={sx}
            id="ActionContainer"
        >
            {actionConfig.markFinished && (
                <FinishButton
                    task={task}
                    markFinished={DataChanges.markFinished}
                />
            )}
            {actionConfig.uploadScreenshot && (
                <UploadImageButton
                    task={task}
                    fileDialogSx={fileDialogSx}
                    campaignId={campaignId}
                    eventId={eventId}
                    buttonText={"Screenshot hochladen"}
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
            // console.log("UploadTextButton", { files });
            return files;
        },
    });
    const hasFile: boolean = (files.data && files.data.length > 0) ?? false;
    const className = useMemo(() => {
        return `actionButton ${hasFile ? "hasFile" : ""}`;
    }, [hasFile]);
    const confirm = useConfirm();
    return (
        <>
            {open && (
                <StorageManagerDialog
                    campaignId={campaignId}
                    eventId={eventId}
                    dataType={"text"}
                    onClose={() => setOpen(false)}
                    // showControls={true}
                    onUploadSuccess={async ({ campaignId, eventId }) => {
                        const eventFiles = await queryClient.listEventFiles({
                            campaignId,
                            eventId,
                        });
                        console.log("UploadTextButton", { eventFiles });
                        switch (task.timelineEventType) {
                            case "Draft-Post": {
                                if (eventFiles.texts.length > 0 && eventFiles.images.length > 0) {
                                    console.log("Post finished");
                                    await confirm().then(async () => {
                                        await updateEventStatus({
                                            eventId,
                                            status: "WAITING_FOR_APPROVAL",
                                        });
                                    });
                                }
                                break;
                            }
                            case "Invites": {
                                await updateEventStatus({
                                    eventId,
                                    status: "COMPLETED",
                                });
                                await markEventFinished({ eventId, isCompleted: true });
                                break;
                            }
                            default: {
                                console.log("Unhandled event type", {
                                    type: task.timelineEventType,
                                });
                                break;
                            }
                        }
                    }}
                />
            )}
            <Button
                className={className}
                variant="contained"
                onClick={() => setOpen(true)}
            >
                <Typography className="ButtonText">Text hochladen</Typography>
                {hasFile && <Typography className="Checkmark">{" \u2713"}</Typography>}
            </Button>
        </>
    );
}

interface UploadImageButtonProps {
    task: TimelineEvent;
    fileDialogSx?: SxProps;
    campaignId: string;
    eventId: string;
    buttonText?: string;
}
function UploadImageButton({
    task,
    fileDialogSx,
    campaignId,
    eventId,
    buttonText,
}: UploadImageButtonProps) {
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
    const confirm = useConfirm();
    return (
        <>
            {open && (
                <StorageManagerDialog
                    campaignId={campaignId}
                    eventId={eventId}
                    dataType={"image"}
                    onClose={() => setOpen(false)}
                    showControls={{ delete: true, download: true }}
                    onUploadSuccess={async ({ campaignId, eventId }) => {
                        const eventFiles = await queryClient.listEventFiles({
                            campaignId,
                            eventId,
                        });
                        console.log("UploadImageButton", { eventFiles });
                        switch (task.timelineEventType) {
                            case "Draft-Post": {
                                if (eventFiles.texts.length > 0 && eventFiles.images.length > 0) {
                                    console.log("Post finished");
                                    await confirm().then(async () => {
                                        await updateEventStatus({
                                            eventId,
                                            status: "WAITING_FOR_APPROVAL",
                                        });
                                    });
                                }
                                break;
                            }
                            case "Draft-Video": {
                                if (eventFiles.texts.length > 0 && eventFiles.videos.length > 0) {
                                    console.log("Post finished");
                                    await confirm().then(async () => {
                                        await updateEventStatus({
                                            eventId,
                                            status: "WAITING_FOR_APPROVAL",
                                        });
                                    });
                                }
                                break;
                            }
                            default: {
                                console.log("Unhandled event type", {
                                    type: task.timelineEventType,
                                });
                                break;
                            }
                        }
                    }}
                />
            )}
            <Button
                className={className}
                variant="contained"
                onClick={() => setOpen(true)}
            >
                <Typography className="ButtonText">{buttonText ?? "Bild hochladen"}</Typography>
                {hasFile && <Typography className="Checkmark">{" \u2713"}</Typography>}
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
    const confirm = useConfirm();
    return (
        <>
            {open && (
                <StorageManagerDialog
                    campaignId={campaignId}
                    eventId={eventId}
                    dataType={"video"}
                    onClose={() => setOpen(false)}
                    showControls={{ delete: true, download: true }}
                    onUploadSuccess={async ({ campaignId, eventId }) => {
                        const eventFiles = await queryClient.listEventFiles({
                            campaignId,
                            eventId,
                        });
                        console.log("UploadVideoButton", { eventFiles });
                        switch (task.timelineEventType) {
                            case "Draft-Video": {
                                if (eventFiles.texts.length > 0 && eventFiles.videos.length > 0) {
                                    console.log("Post finished");
                                    await confirm().then(async () => {
                                        await updateEventStatus({
                                            eventId,
                                            status: "WAITING_FOR_APPROVAL",
                                        });
                                    });
                                }
                                break;
                            }
                            case "Draft-ImpulsVideo": {
                                if (eventFiles.texts.length > 0 && eventFiles.videos.length > 0) {
                                    console.log("Post finished");
                                    await confirm().then(async () => {
                                        await updateEventStatus({
                                            eventId,
                                            status: "WAITING_FOR_APPROVAL",
                                        });
                                    });
                                }
                                break;
                            }
                            default: {
                                console.log("Unhandled event type", {
                                    type: task.timelineEventType,
                                });
                                break;
                            }
                        }
                    }}
                />
            )}
            <Button
                className={className}
                variant="contained"
                onClick={() => setOpen(true)}
            >
                <Typography className="ButtonText">Video hochladen</Typography>
                {hasFile && <Typography className="Checkmark">{" \u2713"}</Typography>}
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
