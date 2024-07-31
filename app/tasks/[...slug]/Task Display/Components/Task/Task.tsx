import { Accordion, AccordionDetails, AccordionSummary, Box, SxProps, Typography } from "@mui/material";
import { Campaign, ParentEvent, TimelineEvent } from "../../../Functions/Database/types";
import { dayjs } from "@/app/utils";
import { ExpandMoreIcon } from "@/app/Definitions/Icons";
import { Actions, Description, Title } from "./Components";
import { config } from ".";

interface TaskProps {
    campaign: Campaign;
    parentEvent: ParentEvent;
    task: TimelineEvent;
    defaultExpanded?: boolean;
    dateColor?: string;
    disableControls?: boolean;
}
export default function Task({
    campaign,
    parentEvent,
    task,
    defaultExpanded = false,
    dateColor,
    disableControls,
}: TaskProps) {
    const sx: SxProps = {
        "&": {
            // ".MuiAccordion-root": {
            backgroundColor: "white",
            // "borderRadius": "20px",
            // border: "1px solid black",
            border: "none",
            // borderTopStyle: "solid",
            borderBottomStyle: "none",
            overflow: "hidden",
            boxShadow: "none",
            "&:first-of-type": {
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                // borderTopStyle: "solid",
            },
            "&:last-of-type": {
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                borderBottomStyle: "none",
                ".MuiAccordionSummary-root:not(.Mui-expanded)": {
                    borderBottom: "none",
                    // backgroundColor: "red",
                },
            },
            "&.Mui-expanded": {
                // borderBottomStyle: "none",
                // borderBottomLeftRadius: "10px",
                // borderBottomRightRadius: "10px",
            },
            // ":nth-of-type(1 of .Mui-expanded ~ &)": {
            //     backgroundColor: "red",
            //     borderTopLeftRadius: "10px",
            //     borderTopRightRadius: "10px",
            // },
            ".MuiAccordionSummary-root": {
                // borderBottom: "1px solid black",
                color: "white",
                fontWeight: "bold",
                // backgroundColor: "#E8E8E8",
                backgroundColor: "white",
                borderBottom: "1px solid #293133",
                minHeight: "fit-content",
                padding: 0,
                // "&:nth-last-of-type(2)": {
                //     borderBottom: "none",
                // },
                ".MuiAccordionSummary-content": {
                    margin: "0",
                },
                "&:last-of-type:not(.Mui-expanded)": {
                    borderBottom: "none",
                },
            },
            ".MuiAccordionSummary-root:last-child": {
                borderBottom: "none",
                backgroundColor: "red",
            },
            ".MuiAccordionDetails-root": {
                padding: 0,
                "#TaskContent": {
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    // "&>*": {
                    //     borderRight: "1px solid black",
                    //     ":last-child": {
                    //         borderRight: "none",
                    //     },
                    // },
                    "#TaskDescription": {
                        padding: "10px",
                        flex: 3,
                        "p.MuiTypography-root": {
                            fontSize: 14,
                            lineHeight: "120%",
                        },
                    },
                },
            },
        },
        "&.last-of-type": {
            backgroundColor: "red",
            ".MuiAccordionSummary-root": {
                borderBottom: "none",
                backgroundColor: "red",
            },
        },
        "@media (max-width: 800px)": {
            ".MuiAccordionDetails-root": {
                flexDirection: "column",
                "#TaskContent": {
                    flexDirection: "column",
                    "&>*": {
                        borderRight: "none",
                    },
                },
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
            <AccordionSummary
                id="AccordionTitle"
                // expandIcon={<ExpandMoreIcon id="Expand" />}
            >
                <Title task={task} dateColor={dateColor} />
                {/* <Typography>
                    {dateString} - {dateDiffText}: {task.timelineEventType}
                </Typography> */}
            </AccordionSummary>
            <AccordionDetails>
                <Box id="TaskContent">
                    <Box id="TaskDescription">
                        <NextSteps task={task} />
                        <Description task={task} />
                    </Box>
                    <Actions task={task} campaignId={campaign.id} eventId={task.id} disableControls={disableControls} />
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
        },
    };
    return (
        <Box id="NextSteps" sx={sx}>
            {/* <Typography>Nächste Schritte:</Typography> */}
            <Typography>{textContent}</Typography>
        </Box>
    );
}
