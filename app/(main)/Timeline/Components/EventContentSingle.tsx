import { Event, Events } from "@/app/ServerFunctions/types";
import { Box, Grid2 as Grid, GridSize, IconButton, TableCell, Typography } from "@mui/material";
import { groupBy } from "../Functions/groupEvents";
import { dayjs } from "@/app/utils";
import { timelineEventTypesType } from "@/amplify/data/types";
import { DeleteIcon, EditIcon } from "@/app/Definitions/Icons";
import React from "react";

interface EventContentProps {
    event: Events.SingleEvent;
    columnSize?: number | GridSize;
    editing?: boolean;
}
type eventType = Events.singleEventType;
export default function EventContentSingle(props: EventContentProps) {
    const { event, columnSize = 10, editing = false } = props;
    const EventElement: { [key in eventType]: React.JSX.Element } = {
        Invites: <InviteEventContent event={event} />,
        ImpulsVideo: <ImpulsVideoEventContent event={event} />,
        Post: <PostEventContent event={event} />,
        Video: <VideoEventContent event={event} />,
        WebinarSpeaker: <></>,
        // WebinarSpeaker: <WebinarEventContent event={event} />,
    };

    return (
        // <Grid
        //     id="EventContentSingle"
        //     xs={columnSize}
        // >
        // </Grid>
        <TableCell className="EventContentCell" width={"100%"}>
            <Box className="EventContent">{EventElement[event.type as eventType] ?? <></>}</Box>
        </TableCell>
    );
}

function InviteEventContent(props: EventContentProps) {
    const { event } = props;
    if (!Events.isInviteEvent(event)) return <></>;
    return (
        <>
            <ItemName event={event} />
            <Typography>{event.eventTaskAmount}</Typography>
        </>
    );
}

function PostEventContent(props: EventContentProps) {
    const { event } = props;
    return <ItemName event={event} />;
}

function VideoEventContent(props: EventContentProps) {
    const { event } = props;
    return <ItemName event={event} />;
}
function ImpulsVideoEventContent(props: EventContentProps) {
    const { event } = props;
    return <ItemName event={event} />;
}

interface ItemNameProps {
    event: Events.SingleEvent;
}
function ItemName(props: ItemNameProps) {
    const { event } = props;
    const assignment = event.assignments[0];
    return (
        <Box id="AssignmentName">
            {assignment.isPlaceholder
                ? `Influencer ${assignment.placeholderName}`
                : `${assignment.influencer?.firstName} ${assignment.influencer?.lastName}`}
            {/* {event.assignment.influencer?.firstName} {event.assignment.influencer?.lastName} */}
        </Box>
    );
}
