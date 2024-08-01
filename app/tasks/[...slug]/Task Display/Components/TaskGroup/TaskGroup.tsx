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
    dateColor?: string;
    boxColor?: string;
    borderColor?: string;
    disableControls?: boolean;
}
export default function TaskGroup({
    tasks,
    groupTitle,
    campaign,
    parentEvent,
    sxOverride,
    startOpen = false,
    dateColor,
    boxColor,
    borderColor,
    disableControls,
}: TaskGroupProps) {
    const sortedTasks = useMemo(() => {
        // const allTasks: TimelineEvent[] = [...tasks, ...pseudoTasks];

        return tasks
            .sort((a, b) => a.timelineEventType.localeCompare(b.timelineEventType))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [tasks]);
    const sx: SxProps = useMemo(
        () => ({
            "&": {
                width: "100%",
                overflow: "auto",
                borderRadius: "20px",
                // border: "1px solid black",
                boxSizing: "border-box",
                border: borderColor ? `5px solid ${borderColor}` : "none",
                backgroundColor: boxColor ?? "#C6E0FF",
                // maxWidth: "1000px",
                // "@container TaskDisplay (min-width: 1000px)": {
                //     width: "calc(50cqw - 0.5rem)",
                //     // backgroundColor: "red",
                // },
                boxShadow: "none",
                ".MuiAccordionSummary-root": {
                    // "borderBottom": "1px solid black",
                    // border: "none",
                    // boxShadow: "none",
                    color: "white",
                    fontWeight: "bold",
                    // "&:last-of-type": {
                    //     borderBottom: "none",
                    // },
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",

                    "#Expand": {
                        color: "black",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        // padding: "0.5rem",
                    },
                },
                ".MuiAccordion-region": {
                    // maxHeight: "100%",
                    // backgroundColor: "var(--swinx-blue-light)",
                    overflow: "hidden",
                },
                "#AccordionContent": {
                    display: "flex",
                    flexDirection: "column",
                    // gap: "0.5rem",
                    // maxHeight: "100%",
                    overflowY: "auto",
                },
            },
            ...sxOverride,
        }),
        [boxColor, sxOverride, borderColor],
    );

    if (tasks.length === 0) return null;
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
                {sortedTasks.map((task, index) => {
                    const key = task.timelineEventType.startsWith("Draft-")
                        ? task.id
                        : `Draft-${task.id}`;
                    return (
                        <Task
                            key={key}
                            task={task}
                            campaign={campaign}
                            parentEvent={parentEvent}
                            defaultExpanded={index === 0}
                            dateColor={dateColor}
                            disableControls={disableControls}
                        />
                    );
                })}
            </AccordionDetails>
        </Accordion>
    );
}
