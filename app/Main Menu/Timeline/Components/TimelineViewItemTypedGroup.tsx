import { Event, Events } from "@/app/ServerFunctions/types";
import stylesExporter from "../../styles/stylesExporter";
import { TypedEventGroup as TypedEventGroup, groupBy } from "../Functions/groupEvents";
import { EventDisplay } from "./EventDisplay";
import { randomId } from "@mui/x-data-grid-generator";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { highlightData } from "@/app/Definitions/types";
import { Box, SxProps, Typography } from "@mui/material";
import { margin } from "@mui/system";
import { useMemo } from "react";

interface TypedEventGroupDisplayProps {
    eventGroup: TypedEventGroup;
    groupBy: groupBy;
    editable: boolean;
    campaignId: string;
}
const hiddenEventTypes: Events.eventType[] = ["WebinarSpeaker"];

export default function TypedEventGroupDisplay(props: TypedEventGroupDisplayProps) {
    const { eventGroup, groupBy, editable, campaignId } = props;
    const queryClient = useQueryClient();
    const highlightedEventIds = useQuery({
        queryKey: ["highlightedEvents"],
        queryFn: async () => {
            return queryClient.getQueryData<highlightData[]>(["highlightedEvents"]) ?? [];
        },
        placeholderData: [],
    });

    if (hiddenEventTypes.includes(eventGroup.type)) return <></>;
    return (
        <Box id="TimelineViewGroupContent">
            <GroupTitle type={eventGroup.type} />
            <GroupContent
                events={eventGroup.events}
                groupBy={groupBy}
                highlightedEventData={highlightedEventIds.data ?? []}
                editable={editable}
                campaignId={campaignId}
            />
        </Box>
    );
}

interface GroupTitleProps {
    type: string;
}
function GroupTitle(props: GroupTitleProps) {
    return <Typography id="GroupTitle">{props.type}</Typography>;
}

interface GroupContentProps {
    events: Event[];
    groupBy: groupBy;
    highlightedEventData: highlightData[];
    editable: boolean;
    campaignId: string;
}

function GroupContent(props: GroupContentProps) {
    const { events, groupBy, highlightedEventData, editable, campaignId } = props;
    return (
        <>
            {events.map((event, index) => {
                return (
                    <EventDisplay
                        key={event.id ?? randomId()}
                        event={event}
                        groupBy={groupBy}
                        highlightData={highlightedEventData.find((x) => x.id === event.id)}
                        editable={editable}
                        campaignId={campaignId}
                    />
                );
            })}
        </>
    );
}
