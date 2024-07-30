import { Box, SxProps } from "@mui/material";
import { Campaign, Task, TimelineEvent, Webinar } from "../Functions/Database/types";
import { EventDescription, Introduction, TaskSummary } from "./Components";

interface SummaryProps {
    influencerFullName: string;
    webinar: Webinar;
    campaign: Campaign;
    events: TimelineEvent[];
}
export function Summary({ influencerFullName, webinar, campaign, events }: SummaryProps) {
    const sx: SxProps = {
        "&": {
            display: "flex",
            flexDirection: "row",
            maxWidth: "100%",
            paddingBottom: "10px",
            gap: "5px",
            ".SummaryTable": {
                marginTop: "10px",

                padding: "10px",
                height: "100%",
                width: "fit-content",
                backgroundColor: "#F8F8F8",
                borderRadius: "10px",
                color: "black",
                flex: 1,
                flexBasis: "fit-content",
                fontSize: 18,
                maxWidth: "50%",

                ".SummaryTableTitle": {
                    color: "#B1B1B1",
                },

                ".MuiTableRow-root": {
                    ".MuiTableCell-root": {
                        padding: "4px 0",
                        border: "none",
                        fontSize: 18,
                        lineHeight: "120%",
                        ":first-of-type": {
                            verticalAlign: "top",
                            paddingRight: "10px",
                        },
                    },
                },
            },
            "@media (max-width: 800px)": {
                flexDirection: "column",
                ".SummaryTable": {
                    width: "100%",
                    maxWidth: "100%",
                },
            },
        },
    };
    return (
        <Box sx={sx}>
            <Introduction {...{ influencerFullName, webinar, campaign }} />
            <EventDescription {...{ webinar, campaign }} />
            <TaskSummary events={events} />
        </Box>
    );
}
