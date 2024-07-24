import { TimelineEvent } from "@/app/tasks/[...slug]/Functions/Database/types";
import { Box, SxProps, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { config } from "..";

interface DescriptionProps {
    task: TimelineEvent;
}

export default function Description({ task }: DescriptionProps) {
    const sx: SxProps = {
        "&": {
            flex: 1,
            ".text": {
                whiteSpace: "pre-wrap",
            },
            ".MuiTable-root": {
                width: "fit-content",
                ".MuiTableCell-root": {
                    padding: "5px 20px",
                    border: "none",
                    fontSize: 20,
                    "&:first-of-type": {
                        borderRight: "1px solid black",
                    },
                },
            },
        },
    };
    return (
        <Box sx={sx}>
            <Table>
                <TableBody>
                    <Topic task={task} />
                    <ContentLength task={task} />
                    <Instructions task={task} />
                </TableBody>
            </Table>
            {/* {JSON.stringify(task, null, 2)} */}
        </Box>
    );
}
function Topic({ task }: DescriptionProps) {
    let textContent: string | null = "<null>";
    if (!task) textContent = "No Task";
    else if (!task.timelineEventType) textContent = "No Task Type";
    else if (!config.eventTypes.includes(task.timelineEventType as config.eventType))
        textContent = `Invalid Task type: ${task.timelineEventType}`;
    else {
        const taskType: config.eventType = task.timelineEventType as config.eventType;
        textContent = config.taskTopic[taskType]({ task });
        if (textContent === null) return null;
    }
    return (
        <TableRow>
            <TableCell>
                <Typography>Thema</Typography>
            </TableCell>
            <TableCell>
                <Typography>{textContent}</Typography>
            </TableCell>
        </TableRow>
    );
}

function ContentLength({ task }: DescriptionProps) {
    let textContent: string | null = "<null>";
    if (!task) textContent = "No Task";
    else if (!task.timelineEventType) textContent = "No Task Type";
    else if (!config.eventTypes.includes(task.timelineEventType as config.eventType))
        textContent = `Invalid Task type: ${task.timelineEventType}`;
    else {
        const taskType: config.eventType = task.timelineEventType as config.eventType;
        textContent = config.contentLength[taskType]({ task });
        if (textContent === null) return null;
    }
    return (
        <TableRow>
            <TableCell>
                <Typography>Länge</Typography>
            </TableCell>
            <TableCell>
                <Typography>{textContent}</Typography>
            </TableCell>
        </TableRow>
    );
}

function Instructions({ task }: DescriptionProps) {
    let textContent: string | null = "<null>";
    if (!task) textContent = "No Task";
    else if (!task.timelineEventType) textContent = "No Task Type";
    else if (!config.eventTypes.includes(task.timelineEventType as config.eventType))
        textContent = `Invalid Task type: ${task.timelineEventType}`;
    else {
        const taskType: config.eventType = task.timelineEventType as config.eventType;
        textContent = config.instructions[taskType]({ task });
        if (textContent === null) return null;
    }
    return (
        <TableRow>
            <TableCell>
                <Typography>Anweisungen</Typography>
            </TableCell>
            <TableCell>
                <Typography>{textContent}</Typography>
            </TableCell>
        </TableRow>
    );
}
