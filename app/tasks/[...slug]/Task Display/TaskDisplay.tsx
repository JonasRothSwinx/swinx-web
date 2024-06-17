import { Box } from "@mui/material";
import { Campaign, ParentEvent, TimelineEvent } from "../Functions/Database/types";
import Task from "./Task/Task";
import { useMemo } from "react";

interface TaskDisplayProps {
    tasks: TimelineEvent[];
    parentEvent: ParentEvent;
    campaign: Campaign;
}
export default function TaskDisplay({ tasks, parentEvent, campaign }: TaskDisplayProps) {
    const sortedTasks = useMemo(() => {
        const multipartTasks = tasks.filter((task) => task.info?.draftDeadline);
        const pseudoTasks = multipartTasks.map((task) => ({
            ...task,
            id: `${task.id}-draft`,
            date: task.info?.draftDeadline ?? "",
            timelineEventType: "Draft",
        }));
        // const allTasks: TimelineEvent[] = [...tasks, ...pseudoTasks];

        return [...tasks, ...pseudoTasks]
            .sort((a, b) => a.timelineEventType.localeCompare(b.timelineEventType))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [tasks]);
    return (
        <Box>
            {sortedTasks.map((task) => (
                <Task key={task.id} task={task} parentEvent={parentEvent} campaign={campaign} />
            ))}
        </Box>
    );
}
