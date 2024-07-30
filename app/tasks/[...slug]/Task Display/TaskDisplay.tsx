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
            id: `${task.id}`,
            date: task.info?.draftDeadline ?? "",
            timelineEventType: `Draft-${task.timelineEventType}`,
            eventTitle: `${task.eventTitle}`,
        }));
        return [...tasks, ...pseudoTasks];
    }, [tasks]);
    const groupedTasks = useMemo(() => {
        const groupedTasks = groupTasks({ tasks: allTasks, parentEvent, campaign });
        return groupedTasks;
    }, [allTasks, parentEvent, campaign]);
    const sx: SxProps = {
        "&": {
            paddingTop: "1rem",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            // alignItems: "center",
            // gap: "1rem",
            // paddingBlock: "1rem",
            alignItems: "flex-start",
            alignContent: "flex-start",
            justifyContent: "space-between",
            // height: "100%",
            // minHeight: "400px",
            overflow: "auto",
            // maxHeight: "100%",
            maxWidth: "100%",
            width: "100%",
            rowGap: "1rem",
            overflowY: "auto",
        },
    };
    return (
        <Box id="TaskDisplay" sx={sx}>
            <TaskGroup
                tasks={groupedTasks.pastDueTasks}
                groupTitle="Fällig"
                campaign={campaign}
                parentEvent={parentEvent}
                startOpen
                dateColor="#FFC4C4"
                // boxColor="#FFE3D2"
                boxColor="#ffd2d299"
                // borderColor="#FFC4C4"
            />
            <TaskGroup
                tasks={groupedTasks.futureTasks}
                groupTitle="Ausstehend"
                campaign={campaign}
                parentEvent={parentEvent}
                // borderColor="#C6E0FF"
            />
            <TaskGroup
                tasks={groupedTasks.awatingApprovalTasks}
                groupTitle="Wartet auf Freigabe"
                campaign={campaign}
                parentEvent={parentEvent}
                boxColor="#b4b4b4"
                disableControls
                // borderColor="#C6E0FF"
            />
            <TaskGroup
                tasks={groupedTasks.finishedTasks}
                groupTitle="Erledigt"
                campaign={campaign}
                parentEvent={parentEvent}
                dateColor="lightgreen"
                boxColor="#F8F8F8"
                disableControls
                // borderColor="lightgreen"
            />
        </Box>
    );
}
