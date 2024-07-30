import { TimelineEvent } from "../../../../Functions/Database/types";
import { dayjs } from "@/app/utils";
import { Box, SxProps, Typography } from "@mui/material";
import { useMemo } from "react";

interface TitleProps {
    task: TimelineEvent;
    dateColor?: string;
    hideDate?: boolean;
}
export function Title({ task, dateColor, ...props }: TitleProps) {
    const rawDate = dayjs(task.date);
    const dateString = rawDate.isSame(dayjs(), "year")
        ? dayjs(task.date).format("DD.MM")
        : dayjs(task.date).format("DD.MM.YY");
    const dateDiffText = dayjs(task.date).fromNow();
    const eventType = task.timelineEventType;
    const sx: SxProps = useMemo(
        () => ({
            "&.Title": {
                width: "100%",
                textAlign: "center",
                borderRadius: "10px 10px 0 0",
                color: "black",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                // justifyContent: "flex-end",
                padding: "10px 20px",
                position: "relative",
                ".TaskType": {
                    color: "black",
                    fontSize: 20,
                    lineHeight: "130%",
                    // paddingLeft: "70px",
                    width: "fit-content",
                    // verticalAlign: "middle",
                    // marginRight: "50%",
                    // marginLeft: "40%",
                    // margin: "auto",
                    // fontWeight: "bold",
                },
                ".TaskDate": {
                    // float: "right",
                    // position: "absolute",
                    color: "black",
                    backgroundColor: dateColor ?? "#E8E8E8",
                    fontSize: 16,
                    // fontWeight: "bold",
                    right: "10px",
                    borderRadius: "5px",
                    width: "20ch",
                    padding: "5px 1ch",
                    textAlign: "start",
                    // bottom: "5px",
                },
                "@media (max-width: 800px)": {
                    flexDirection: "column",
                },
            },
        }),
        [dateColor]
    );
    return (
        <Box className="Title" {...props} sx={sx}>
            <Typography className="TaskType">{eventTypeDictionary[eventType] ?? eventType}</Typography>
            {/* <Box> */}
            <Typography className="TaskDate">
                <strong>{dateString}</strong> - {dateDiffText}
            </Typography>
            {/* </Box> */}
        </Box>
    );
}
const eventTypeDictionary: { [key: string]: string } = {
    Invites: "Einladungen",
    Post: "Textbeitrag",
    "Draft-Post": "Entwurf für Textbeitrag",
    Video: "Videobeitrag",
    "Draft-Video": "Aufnahme für Videobeitrag",
    ImpulsVideo: "Impulsvideo",
    "Draft-ImpulsVideo": "Aufnahme für Impulsvideo",
    WebinarSpeaker: "Auftritt als Speaker",
};
