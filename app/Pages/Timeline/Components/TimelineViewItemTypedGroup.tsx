import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";
import stylesExporter from "../../styles/stylesExporter";
import { TypedEventGroup as TypedEventGroup, groupBy } from "../Functions/groupEvents";
import { Event } from "./EventDisplay";
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
const hiddenEventTypes: TimelineEvent.eventType[] = ["WebinarSpeaker"];

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
    const sxProps: SxProps = useMemo(() => {
        return {
            "&": {
                "&": {
                    // padding: "2px",

                    border: "solid black",
                    borderWidth: "0 0 1px",
                    // borderLeft: "none",
                    // borderRadius: "10px",
                    display: "flex",
                    flexDirection: " column",
                    overflow: "hidden",
                    // marginBottom: "2px",
                },
                "&:first-of-type": {
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    borderWidth: "1px 0 1px",
                },
                "&:last-of-type": {
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                    borderWidth: "1px 0 1px",
                    marginBottom: "0",
                },
                "#GroupTitle": {
                    paddingLeft: "5px",
                    backgroundColor: "lightgrey",
                    borderBottom: "1px solid black",
                },
            },
        };
    }, []);

    if (hiddenEventTypes.includes(eventGroup.type)) return <></>;
    return (
        <Box sx={sxProps}>
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
    events: TimelineEvent.Event[];
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
                    <Event
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
