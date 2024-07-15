import { dataClient } from "@/app/tasks/[...slug]/Functions/Database";
import { Task, TimelineEvent } from "@/app/tasks/[...slug]/Functions/Database/types";
import { Box, Button, SxProps } from "@mui/material";
import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query";
import { config } from "..";
import { useMemo } from "react";

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
}

export default function Actions({ task }: ActionProps) {
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
            paddingLeft: "5px",
            gap: "2px",
            width: "min-content",
            ".actionButton": {
                // "backgroundColor": "red",
                // "color": "white",
                lineHeight: "1.2",
                textTransform: "none",
                "&:hover": {
                    // backgroundColor: "darkred",
                },
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
        else if (!config.eventTypes.includes(task.timelineEventType as config.eventType)) return possibleActions;
        else {
            const taskType: config.eventType = task.timelineEventType as config.eventType;
            possibleActions = { ...possibleActions, ...config.possibleAction[taskType] };
        }
        return possibleActions;
    }, [task]);
    return (
        <Box sx={sx}>
            {actionConfig.markFinished && <FinishButton task={task} markFinished={DataChanges.markFinished} />}
            {actionConfig.uploadText && <UploadTextButton task={task} />}
            {actionConfig.uploadImage && <UploadImageButton task={task} />}
            {actionConfig.uploadVideo && <UploadVideoButton task={task} />}
            {actionConfig.uploadLink && <UploadLinkButton task={task} />}
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
            className="actionButton"
            variant="contained"
            onClick={() => markFinished.mutate({ isCompleted: !task.isCompleted })}
            disabled={markFinished.isPending || isCompleted}
        >
            Aufgabe erledigt
        </Button>
    );
}

interface UploaTextButtonProps {
    task: TimelineEvent;
}
function UploadTextButton({ task }: UploaTextButtonProps) {
    return (
        <Button className="actionButton" variant="contained">
            Text hochladen
        </Button>
    );
}

interface UploadImageButtonProps {
    task: TimelineEvent;
}
function UploadImageButton({ task }: UploadImageButtonProps) {
    return (
        <Button className="actionButton" variant="contained">
            Bild hochladen
        </Button>
    );
}

interface UploadVideoButtonProps {
    task: TimelineEvent;
}

function UploadVideoButton({ task }: UploadVideoButtonProps) {
    return (
        <Button className="actionButton" variant="contained">
            Video hochladen
        </Button>
    );
}

interface UploadLinkButtonProps {
    task: TimelineEvent;
}

function UploadLinkButton({ task }: UploadLinkButtonProps) {
    return (
        <Button className="actionButton" variant="contained">
            Link einfügen
        </Button>
    );
}
