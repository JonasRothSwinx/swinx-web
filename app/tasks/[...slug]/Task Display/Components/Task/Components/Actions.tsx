import { dataClient } from "@/app/tasks/[...slug]/Functions/Database";
import { Task, TimelineEvent } from "@/app/tasks/[...slug]/Functions/Database/types";
import { Box, Button, SxProps } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
            },
        },
    };
    return (
        <Box sx={sx}>
            <Button
                className="actionButton"
                variant="contained"
                onClick={() => DataChanges.markFinished.mutate({ isCompleted: !task.isCompleted })}
                disabled={DataChanges.markFinished.isPending}
            >
                Aufgabe erledigt
            </Button>
            {Array.from({ length: 4 }, (_, i) => {
                return (
                    <Button
                        id="actionButton"
                        className="actionButton"
                        key={i}
                        variant="contained"
                    >
                        {ActionNames[i] ?? `Action ${i + 1}`}
                    </Button>
                );
            })}
        </Box>
    );
}
