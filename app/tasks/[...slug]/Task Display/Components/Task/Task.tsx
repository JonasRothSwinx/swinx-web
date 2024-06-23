import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    SxProps,
    Typography,
} from "@mui/material";
import { Campaign, ParentEvent, TimelineEvent } from "../../../Functions/Database/types";
import dayjs from "@/app/utils/configuredDayJs";
import { ExpandMoreIcon } from "@/app/Definitions/Icons";
import { Actions, Description } from "./Components";

interface TaskProps {
    campaign: Campaign;
    parentEvent: ParentEvent;
    task: TimelineEvent;
    defaultExpanded?: boolean;
}
export default function Task({ campaign, parentEvent, task, defaultExpanded = false }: TaskProps) {
    const date = dayjs(task.date).format("DD.MM.YYYY");
    const dateDiffText = dayjs(task.date).fromNow();
    const sx: SxProps = {
        "&": {
            // ".MuiAccordion-root": {
            "backgroundColor": "var(--swinx-blue)",
            // "borderRadius": "20px",
            "border": "1px solid black",
            "borderTopStyle": "none",
            "overflow": "auto",
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
                "display": "flex",
                "flexDirection": "row",
                "width": "100%",
                "&>*": {
                    "borderRight": "1px solid black",
                    ":last-child": {
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
                expandIcon={<ExpandMoreIcon id="Expand" />}
            >
                <Typography>
                    {date} - {dateDiffText}: {task.timelineEventType}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box id="TaskContent">
                    <Description task={task} />
                    <Actions task={task} />
                </Box>
                {/* <Typography>{task.eventTitle}</Typography> */}
            </AccordionDetails>
        </Accordion>
    );
}
