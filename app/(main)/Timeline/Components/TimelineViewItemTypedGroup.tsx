import { highlightData } from "@/app/Definitions/types";
import { Event, Events } from "@/app/ServerFunctions/types";
import { SxProps, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { randomId } from "@mui/x-data-grid-generator";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { TypedEventGroup, groupBy } from "../Functions/groupEvents";
import { EventDisplay } from "./EventDisplay";

interface TypedEventGroupDisplayProps {
    eventGroup: TypedEventGroup;
    groupBy: groupBy;
    editable: boolean;
    campaignId: string;
}
const hiddenEventTypes: Events.EventType[] = ["WebinarSpeaker"];

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
    const sx: SxProps = useMemo(
        () => ({
            "&": {
                "&#TimelineViewGroupContent": {
                    // padding: "2px",

                    border: "solid black",
                    borderTop: "none",
                    borderWidth: "0 0 1px",
                    // borderLeft: "none",
                    // borderRadius: "10px",
                    display: "flex",
                    flexDirection: " column",
                    overflow: "hidden",
                    // "&:first-of-type": {
                    //     borderTopLeftRadius: "10px",
                    //     borderTopRightRadius: "10px",
                    // },
                    "&:last-of-type": {
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                        borderBottom: "none",
                        marginBottom: "0",
                    },
                },
            },
        }),
        []
    );

    if (hiddenEventTypes.includes(eventGroup.type)) return <></>;
    return (
        <Table id="TimelineViewGroupContent" sx={sx}>
            <GroupTitle type={eventGroup.type} />
            <GroupContent
                events={eventGroup.events}
                groupBy={groupBy}
                highlightedEventData={highlightedEventIds.data ?? []}
                editable={editable}
                campaignId={campaignId}
            />
        </Table>
    );
}

interface GroupTitleProps {
    type: string;
}
function GroupTitle(props: GroupTitleProps) {
    const sx: SxProps = useMemo(
        () => ({
            "&": {
                display: "flex",
                width: "100%",
                ".TitleRow": {
                    width: "100%",
                },

                "#GroupTitle": {
                    width: "100%",
                    paddingLeft: "5px",
                    color: "white",
                    backgroundColor: "var(--swinx-blue-light)",
                    borderBottom: "1px solid black",
                },
            },
        }),
        []
    );
    return (
        <TableHead sx={sx}>
            <TableRow className="TitleRow">
                {/* <TableCell> */}
                <Typography id="GroupTitle">{props.type}</Typography>
                {/* </TableCell> */}
            </TableRow>
        </TableHead>
    );
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
        <TableBody>
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
        </TableBody>
    );
}
