import { dataClient, notifyMediaSubmission } from "@/app/tasks/[...slug]/Functions/Database";
import { Task, TimelineEvent } from "@/app/tasks/[...slug]/Functions/Database/types";
import { Box, Button, Dialog, SxProps, TextField, Typography } from "@mui/material";
import { UseMutationResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { config } from "..";
import { useMemo, useState } from "react";
import { StorageManagerDialog } from "@/app/Components";
import { queryClient, queryServer } from "@/app/Components/StorageManagers/functions";
import { ConfirmProvider, useConfirm } from "material-ui-confirm";
import { StorageManagerProps } from "@/app/Components/StorageManagers/TypedStorageManager";
import { CheckIcon } from "@/app/Definitions/Icons";
import { usePathname } from "next/navigation";

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
    // assignmentId: string;
    eventId: string;
    disableControls?: boolean;
}

export default function Actions({ task, campaignId, eventId, disableControls }: ActionProps) {
    const queryClient = useQueryClient();
    const pathname = usePathname();
    const assignmentId = pathname.split("/").pop();
    const DataChanges = {
        markFinished: useMutation({
            mutationFn: async () => {
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
                return dataClient.updateEventStatus({
                    eventId: task.id,
                    status: "COMPLETED",
                });
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
            "@media (max-width: 800px)": {
                // flexDirection: "row",
                gap: "10px",
                width: "100%",
                ".actionButton": {
                    width: "100%",
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
    if (!assignmentId) return <Typography>Assignment ID not found {pathname}</Typography>;
    return (
        <Box
            sx={sx}
            id="ActionContainer"
        >
            <ConfirmProvider
                defaultOptions={{
                    allowClose: false,
                    title: "Medien einschicken?",
                    description:
                        "Sie haben alle benötigten Medien für diese Aufgabe hochgeladen\n" +
                        "Möchten Sie die Dateien zur Freigabe einschicken?",
                    contentProps: { sx: { whiteSpace: "pre-wrap" } },
                    confirmationText: "Ja",
                    cancellationText: "Nein",
                    confirmationButtonProps: { variant: "contained", color: "primary" },
                }}
            >
                {actionConfig.markFinished && (
                    <FinishButton
                        disableControls={disableControls}
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
                        disableControls={disableControls}
                        assignmentId={assignmentId}
                    />
                )}
                {actionConfig.uploadText && (
                    <UploadTextButton
                        disableControls={disableControls}
                        task={task}
                        fileDialogSx={fileDialogSx}
                        campaignId={campaignId}
                        eventId={eventId}
                        assignmentId={assignmentId}
                    />
                )}
                {actionConfig.uploadImage && (
                    <UploadImageButton
                        disableControls={disableControls}
                        task={task}
                        fileDialogSx={fileDialogSx}
                        campaignId={campaignId}
                        eventId={eventId}
                        assignmentId={assignmentId}
                    />
                )}
                {actionConfig.uploadVideo && (
                    <UploadVideoButton
                        disableControls={disableControls}
                        task={task}
                        fileDialogSx={fileDialogSx}
                        campaignId={campaignId}
                        eventId={eventId}
                        assignmentId={assignmentId}
                    />
                )}
                {actionConfig.showMedia && (
                    <ShowMediaButton
                        disableControls={disableControls}
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
                        campaignId={campaignId}
                        disableControls={disableControls}
                    />
                )}
            </ConfirmProvider>
        </Box>
    );
}
interface FinishButtonProps {
    task: TimelineEvent;
    markFinished: UseMutationResult<void, Error, void, unknown>;
    disableControls?: boolean;
}
function FinishButton({ task, markFinished, disableControls }: FinishButtonProps) {
    // const isCompleted = task.isCompleted ?? false;
    return (
        <Button
            className="actionButton finishButton"
            variant="contained"
            onClick={() => markFinished.mutate()}
            disabled={disableControls || markFinished.isPending}
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
    disableControls?: boolean;
    assignmentId: string;
}
function UploadTextButton({
    task,
    fileDialogSx,
    campaignId,
    eventId,
    disableControls,
    assignmentId,
}: UploadTextButtonProps) {
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
    const taskTotal = useQuery({
        queryKey: ["task"],
        queryFn: async () => {
            console.log("Task data requested");
            const response = await dataClient.getTaskDetails({
                assignmentId: assignmentId,
                // campaignId: campaignId,
                // influencerId: influencerId,
            });
            return response;
        },
    });
    const hasFile: boolean = (files.data && files.data.length > 0) ?? false;
    const className = useMemo(() => {
        return `actionButton ${hasFile ? "hasFile" : ""}`;
    }, [hasFile]);
    const confirm = useConfirm();
    const onUploadSuccess: StorageManagerProps["onSuccess"] = async ({ campaignId, eventId }) => {
        if (!taskTotal.data) return;
        const eventFiles = await queryClient.listEventFiles({
            campaignId,
            eventId,
        });
        // console.log("UploadTextButton", { eventFiles });
        switch (task.timelineEventType) {
            case "Draft-Post": {
                if (eventFiles.texts.length > 0 && eventFiles.images.length > 0) {
                    // console.log("Post finished");
                    await confirm().then(async () => {
                        await dataClient.updateEventStatus({
                            eventId,
                            status: "WAITING_FOR_APPROVAL",
                        });
                        await notifyMediaSubmission({ eventId, campaignId, task: taskTotal.data });
                        setOpen(false);
                    });
                }
                break;
            }
            case "Draft-Video": {
                if (eventFiles.texts.length > 0 && eventFiles.videos.length > 0) {
                    // console.log("Post finished");
                    await confirm().then(async () => {
                        await dataClient.updateEventStatus({
                            eventId,
                            status: "WAITING_FOR_APPROVAL",
                        });
                        await notifyMediaSubmission({ eventId, campaignId, task: taskTotal.data });
                        setOpen(false);
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
    };
    return (
        <>
            {open && (
                <StorageManagerDialog
                    campaignId={campaignId}
                    eventId={eventId}
                    dataType={"text"}
                    onClose={() => setOpen(false)}
                    // showControls={true}
                    onUploadSuccess={onUploadSuccess}
                />
            )}
            <Button
                disabled={disableControls}
                className={className}
                variant="contained"
                onClick={() => setOpen(true)}
            >
                <Typography className="ButtonText">Text hochladen</Typography>
                {hasFile && <CheckIcon />}
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
    disableControls?: boolean;
    assignmentId: string;
}
function UploadImageButton({
    task,
    fileDialogSx,
    campaignId,
    eventId,
    buttonText,
    disableControls,
    assignmentId,
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
    const taskTotal = useQuery({
        queryKey: ["task"],
        queryFn: async () => {
            console.log("Task data requested");
            const response = await dataClient.getTaskDetails({
                assignmentId: assignmentId,
                // campaignId: campaignId,
                // influencerId: influencerId,
            });
            return response;
        },
    });

    const hasFile: boolean = (files.data && files.data.length > 0) ?? false;
    const className = useMemo(() => {
        return `actionButton ${hasFile ? "hasFile" : ""}`;
    }, [hasFile]);
    const confirm = useConfirm();
    const onUploadSuccess: StorageManagerProps["onSuccess"] = async ({ campaignId, eventId }) => {
        if (!taskTotal.data) return;
        const eventFiles = await queryClient.listEventFiles({
            campaignId,
            eventId,
        });
        // console.log("UploadImageButton", { eventFiles });
        switch (task.timelineEventType) {
            case "Draft-Post": {
                if (eventFiles.texts.length > 0 && eventFiles.images.length > 0) {
                    // console.log("Post finished");
                    await confirm()
                        .then(async () => {
                            await dataClient.updateEventStatus({
                                eventId,
                                status: "WAITING_FOR_APPROVAL",
                            });
                            await notifyMediaSubmission({
                                eventId,
                                campaignId,
                                task: taskTotal.data,
                            });
                            setOpen(false);
                        })
                        .catch((e) => console.error("Error confirming", e));
                }
                break;
            }
            case "Draft-Video": {
                if (eventFiles.texts.length > 0 && eventFiles.videos.length > 0) {
                    // console.log("Post finished");
                    await confirm()
                        .then(async () => {
                            await dataClient.updateEventStatus({
                                eventId,
                                status: "WAITING_FOR_APPROVAL",
                            });
                            await notifyMediaSubmission({
                                eventId,
                                campaignId,
                                task: taskTotal.data,
                            });
                            setOpen(false);
                        })
                        .catch((e) => console.error("Error confirming", e));
                }
                break;
            }
            case "Invites": {
                // console.log("Post finished");
                await confirm()
                    .then(async () => {
                        await dataClient.updateEventStatus({
                            eventId,
                            status: "WAITING_FOR_APPROVAL",
                        });
                        await notifyMediaSubmission({ eventId, campaignId, task: taskTotal.data });
                        setOpen(false);
                    })
                    .catch((e) => console.error("Error confirming", e));
                break;
            }
            default: {
                console.log("Unhandled event type", {
                    type: task.timelineEventType,
                });
                break;
            }
        }
    };
    return (
        <>
            {open && (
                <StorageManagerDialog
                    campaignId={campaignId}
                    eventId={eventId}
                    dataType={"image"}
                    onClose={() => setOpen(false)}
                    showControls={{ delete: true, download: true }}
                    onUploadSuccess={onUploadSuccess}
                />
            )}
            <Button
                disabled={disableControls}
                className={className}
                variant="contained"
                onClick={() => setOpen(true)}
            >
                <Typography className="ButtonText">{buttonText ?? "Bild hochladen"}</Typography>
                {hasFile && <CheckIcon />}
            </Button>
        </>
    );
}

interface UploadVideoButtonProps {
    task: TimelineEvent;
    fileDialogSx?: SxProps;
    campaignId: string;
    eventId: string;
    disableControls?: boolean;
    assignmentId: string;
}

function UploadVideoButton({
    task,
    fileDialogSx,
    campaignId,
    eventId,
    disableControls,
    assignmentId,
}: UploadVideoButtonProps) {
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
    const taskTotal = useQuery({
        queryKey: ["task"],
        queryFn: async () => {
            console.log("Task data requested");
            const response = await dataClient.getTaskDetails({
                assignmentId: assignmentId,
                // campaignId: campaignId,
                // influencerId: influencerId,
            });
            return response;
        },
    });
    const hasFile: boolean = (files.data && files.data.length > 0) ?? false;
    const className = useMemo(() => {
        return `actionButton ${hasFile ? "hasFile" : ""}`;
    }, [hasFile]);
    const confirm = useConfirm();
    const onUploadSuccess: StorageManagerProps["onSuccess"] = async ({ campaignId, eventId }) => {
        if (!taskTotal.data) return;
        const eventFiles = await queryClient.listEventFiles({
            campaignId,
            eventId,
        });
        // console.log("UploadVideoButton", { eventFiles });
        switch (task.timelineEventType) {
            case "Draft-Video": {
                if (eventFiles.texts.length > 0 && eventFiles.videos.length > 0) {
                    // console.log("Post finished");
                    await confirm().then(async () => {
                        await dataClient.updateEventStatus({
                            eventId,
                            status: "WAITING_FOR_APPROVAL",
                        });
                        await notifyMediaSubmission({ eventId, campaignId, task: taskTotal.data });
                        setOpen(false);
                    });
                }
                break;
            }
            case "Draft-ImpulsVideo": {
                if (eventFiles.videos.length > 0) {
                    // console.log("Post finished");
                    await confirm().then(async () => {
                        await dataClient.updateEventStatus({
                            eventId,
                            status: "WAITING_FOR_APPROVAL",
                        });
                        await notifyMediaSubmission({ eventId, campaignId, task: taskTotal.data });
                        setOpen(false);
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
    };
    return (
        <>
            {open && (
                <StorageManagerDialog
                    campaignId={campaignId}
                    eventId={eventId}
                    dataType={"video"}
                    onClose={() => setOpen(false)}
                    showControls={{ delete: true, download: true }}
                    onUploadSuccess={onUploadSuccess}
                />
            )}
            <Button
                disabled={disableControls}
                className={className}
                variant="contained"
                onClick={() => setOpen(true)}
            >
                <Typography className="ButtonText">Video hochladen</Typography>
                {hasFile && <CheckIcon />}
            </Button>
        </>
    );
}
interface ShowMediaButtonProps {
    task: TimelineEvent;
    fileDialogSx?: SxProps;
    campaignId: string;
    eventId: string;
    disableControls?: boolean;
}

function ShowMediaButton({ task, campaignId, eventId, disableControls }: ShowMediaButtonProps) {
    const [open, setOpen] = useState(false);
    return (
        <>
            {open && (
                <StorageManagerDialog
                    campaignId={campaignId}
                    eventId={eventId}
                    dataType={"mixed"}
                    onClose={() => setOpen(false)}
                    showControls={{ download: true }}
                    hideUploader={true}
                />
            )}
            <Button
                disabled={disableControls}
                className="actionButton"
                variant="contained"
                onClick={() => setOpen(true)}
            >
                <Typography className="ButtonText">Dateien anzeigen</Typography>
            </Button>
        </>
    );
}

interface UploadLinkButtonProps {
    task: TimelineEvent;
    fileDialogSx?: SxProps;
    disableControls?: boolean;
    campaignId: string;
}

function UploadLinkButton({ task, disableControls, campaignId }: UploadLinkButtonProps) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <SubmitLinkDialog
                open={open}
                onClose={() => setOpen(false)}
                task={task}
                campaignId={campaignId}
            />
            <Button
                disabled={disableControls}
                className="actionButton linkButton"
                variant="contained"
                onClick={() => setOpen(true)}
            >
                Link einfügen
            </Button>
        </>
    );
}

interface SubmitLinkDialogProps {
    open: boolean;
    onClose: () => void;
    task: TimelineEvent;
    campaignId: string;
}
function SubmitLinkDialog({ open, onClose, task, campaignId }: SubmitLinkDialogProps) {
    const [link, setLink] = useState("");
    const queryClient = useQueryClient();
    const submitLink = useMutation({
        mutationFn: async () => {
            console.log("submitLink", { link });
            await dataClient.submitPostLink({
                eventId: task.id,
                postLink: link,
                campaignId,
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["task"],
            });
            onClose();
        },
    });
    const sx: SxProps = {
        "&": {
            ".SubmitLinkContainer": {
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                minWidth: "400px",
                gap: "10px",
                ".Title": {
                    width: "100%",
                    textAlign: "center",
                },
            },
        },
    };
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={sx}
        >
            <Box className="SubmitLinkContainer">
                <Typography className="Title">Link einfügen</Typography>
                <TextField
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Beitragslink hier einfügen"
                />
                <Button
                    disabled={submitLink.isPending}
                    variant="contained"
                    onClick={async () => {
                        submitLink.mutate();
                        return;
                    }}
                >
                    Absenden
                </Button>
            </Box>
        </Dialog>
    );
}
