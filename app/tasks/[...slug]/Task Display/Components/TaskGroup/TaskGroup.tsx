import { useMemo } from "react";
import { TimelineEvent, Campaign, ParentEvent } from "../../../Functions/Database/types";
import {
    Accordion,
    AccordionDetails,
    AccordionSlots,
    AccordionSummary,
    Box,
    Collapse,
    SxProps,
    Typography,
} from "@mui/material";
import { Task } from "../";
import { ExpandMoreIcon } from "@/app/Definitions/Icons";
import Title from "./Title";

export interface TaskGroupProps {
    tasks: TimelineEvent[];
    groupTitle: string;
    campaign: Campaign;
    parentEvent: ParentEvent;
    sxOverride?: SxProps;
    startOpen?: boolean;
}
export default function TaskGroup({
    tasks,
    groupTitle,
    campaign,
    parentEvent,
    sxOverride,
    startOpen = false,
}: TaskGroupProps) {
    const sortedTasks = useMemo(() => {
        // const allTasks: TimelineEvent[] = [...tasks, ...pseudoTasks];

        return tasks
            .sort((a, b) => a.timelineEventType.localeCompare(b.timelineEventType))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [tasks]);
    if (tasks.length === 0) return null;
    const sx: SxProps = {
        "&": {
            "width": "100%",
            "overflow": "auto",
            "borderRadius": "20px",
            "border": "1px solid black",
            "backgroundColor": "var(--swinx-blue)",
            "@container TaskDisplay (min-width: 1000px)": {
                width: "calc(50cqw - 0.5rem)",
                // backgroundColor: "red",
            },
            "#AccordionTitle": {
                // "borderBottom": "1px solid black",
                color: "white",
                fontWeight: "bold",
                // "&:last-of-type": {
                //     borderBottom: "none",
                // },
            },
            ".MuiAccordion-region": {
                // maxHeight: "100%",
                backgroundColor: "white",
                overflow: "auto",
            },
            "#AccordionContent": {
                display: "flex",
                flexDirection: "column",
                // gap: "0.5rem",
                // maxHeight: "100%",
                overflowY: "auto",
            },
            "#Expand": {
                color: "white",
            },
        },
        ...sxOverride,
    };
    return (
        <Accordion
            sx={sx}
            disableGutters
            defaultExpanded={startOpen}
            slots={{ transition: Collapse as AccordionSlots["transition"] }}
            slotProps={{ transition: { timeout: 400 } }}
        >
            <AccordionSummary
                id="AccordionTitle"
                expandIcon={<ExpandMoreIcon id="Expand" />}
            >
                <Title
                    title={groupTitle}
                    taskCount={tasks.length}
                />
            </AccordionSummary>
            <AccordionDetails id="AccordionContent">
                {sortedTasks.map((task, index) => (
                    <Task
                        key={task.id}
                        task={task}
                        campaign={campaign}
                        parentEvent={parentEvent}
                        defaultExpanded={startOpen && index === 0}
                    />
                ))}
            </AccordionDetails>
        </Accordion>
    );
}
