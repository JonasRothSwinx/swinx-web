import { Accordion, AccordionDetails, AccordionSummary, Box, SxProps, Typography } from "@mui/material";
import { Campaign, ParentEvent, TimelineEvent } from "../../../Functions/Database/types";
import { dayjs } from "@/app/utils";
import { ExpandMoreIcon } from "@/app/Definitions/Icons";
import { Actions, Description } from "./Components";
import { config } from ".";

interface TaskProps {
    campaign: Campaign;
    parentEvent: ParentEvent;
    task: TimelineEvent;
    defaultExpanded?: boolean;
}
export default function Task({ campaign, parentEvent, task, defaultExpanded = false }: TaskProps) {
    const rawDate = dayjs(task.date);
    const dateString = rawDate.isSame(dayjs(), "year")
        ? dayjs(task.date).format("DD.MM")
        : dayjs(task.date).format("DD.MM.YY");
    const dateDiffText = dayjs(task.date).fromNow();
    const sx: SxProps = {
        "&": {
            // ".MuiAccordion-root": {
            backgroundColor: "var(--swinx-blue)",
            // "borderRadius": "20px",
            border: "1px solid black",
            borderTopStyle: "none",
            overflow: "auto",
            "&:first-of-type": {
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
            },
            "&:last-of-type": {
                borderBottomLeftRadius: "20px",
                borderBottomRightRadius: "20px",
                borderBottomStyle: "none",
            },
            "&.Mui-expanded": {
                borderTopStyle: "solid",
            },
            "#AccordionTitle": {
                // borderBottom: "1px solid black",
                color: "white",
                fontWeight: "bold",
                // "&:nth-last-of-type(2)": {
                //     borderBottom: "none",
                // },
            },
            "#TaskContent": {
                display: "flex",
                flexDirection: "row",
                width: "100%",
                "&>*": {
                    borderRight: "1px solid black",
                    ":last-child": {
                        borderRight: "none",
                    },
                },
            },
            "#TaskDescription": {
                flex: 3,
            },
        },
    };
    return (
        <Accordion
            id="Task"
            // disableGutters
            sx={sx}
            defaultExpanded={defaultExpanded}
        >
            <AccordionSummary id="AccordionTitle" expandIcon={<ExpandMoreIcon id="Expand" />}>
                <Typography>
                    {dateString} - {dateDiffText}: {task.timelineEventType}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box id="TaskContent">
                    <Box id="TaskDescription">
                        <NextSteps task={task} />
                        <Description task={task} />
                    </Box>
                    <Actions task={task} />
                </Box>
                {/* <Typography>{task.eventTitle}</Typography> */}
            </AccordionDetails>
        </Accordion>
    );
}

interface NextSteps {
    task: TimelineEvent;
}
function NextSteps({ task }: NextSteps) {
    let textContent = "<null>";
    if (!task) textContent = "No Task";
    else if (!task.timelineEventType) textContent = "No Task Type";
    else if (!config.eventTypes.includes(task.timelineEventType as config.eventType))
        textContent = `Invalid Task type: ${task.timelineEventType}`;
    else {
        const taskType: config.eventType = task.timelineEventType as config.eventType;
        textContent = config.nextSteps[taskType]({ task });
    }
    const sx: SxProps = {
        "&": {
            padding: "10px",
            "&> p": {
                // fontSize: "1.5em",
                fontWeight: "bold",
            },
        },
    };
    return (
        <Box id="NextSteps" sx={sx}>
            <Typography>Nächste Schritte:</Typography>
            <Typography>{textContent}</Typography>
        </Box>
    );
}
