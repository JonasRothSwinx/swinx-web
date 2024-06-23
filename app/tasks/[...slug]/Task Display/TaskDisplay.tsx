import { Box, SxProps } from "@mui/material";
import { Campaign, ParentEvent, TimelineEvent } from "../Functions/Database/types";
import { Task, TaskGroup } from "./Components";
import { useMemo } from "react";
import { groupTasks } from "./Functions";

interface TaskDisplayProps {
    tasks: TimelineEvent[];
    parentEvent: ParentEvent;
    campaign: Campaign;
}
export default function TaskDisplay({ tasks, parentEvent, campaign }: TaskDisplayProps) {
    const allTasks: TimelineEvent[] = useMemo(() => {
        const multipartTasks = tasks.filter((task) => task.info?.draftDeadline);
        const pseudoTasks: TimelineEvent[] = multipartTasks.map((task) => ({
            ...task,
            id: `${task.id}-draft`,
            date: task.info?.draftDeadline ?? "",
            timelineEventType: `Draft-${task.timelineEventType}`,
            eventTitle: `Entwurf für ${task.eventTitle}`,
        }));
        return [...tasks, ...pseudoTasks];
    }, [tasks]);
    const groupedTasks = useMemo(() => {
        const groupedTasks = groupTasks({ tasks: allTasks, parentEvent, campaign });
        return groupedTasks;
    }, [allTasks, parentEvent, campaign]);
    const sx: SxProps = {
        "&": {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            // gap: "1rem",
            paddingBlock: "1rem",
            alignItems: "flex-start",
            alignContent: "flex-start",
            justifyContent: "space-between",
            height: "100%",
            // minHeight: "400px",
            overflow: "auto",
            maxHeight: "100%",
            maxWidth: "100%",
            width: "100%",
            rowGap: "1rem",
            overflowY: "auto",
            containerName: "TaskDisplay",
            containerType: "inline-size",
        },
    };
    return (
        <Box
            id="TaskDisplay"
            sx={sx}
        >
            <TaskGroup
                tasks={groupedTasks.pastDueTasks}
                groupTitle="Überfällig"
                campaign={campaign}
                parentEvent={parentEvent}
                startOpen
            />
            <TaskGroup
                tasks={groupedTasks.futureTasks}
                groupTitle="Ausstehend"
                campaign={campaign}
                parentEvent={parentEvent}
            />
            <TaskGroup
                tasks={groupedTasks.finishedTasks}
                groupTitle="Erledigt"
                campaign={campaign}
                parentEvent={parentEvent}
            />
        </Box>
    );
}
