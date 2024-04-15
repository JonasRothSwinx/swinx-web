import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { Box, Unstable_Grid2 as Grid, GridSize, IconButton, Skeleton } from "@mui/material";
import { groupBy } from "../Functions/groupEvents";
import dayjs from "@/app/utils/configuredDayJs";
import { timelineEventTypesType } from "@/amplify/data/types";
import EventContentSingle from "./EventContentSingle";
import EventContentMulti from "./EventContentMulti";
import { Query, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import database from "@/app/ServerFunctions/database/dbOperations";
import { DeleteIcon, EditIcon } from "@/app/Definitions/Icons";
import Campaign from "@/app/ServerFunctions/types/campaign";
import { highlightData } from "@/app/Definitions/types";

interface EventProps {
    campaignId: string;
    event: TimelineEvent.Event;
    groupBy: groupBy;
    totalColumns?: number;
    highlightData?: highlightData;
    editing: boolean;
}
export function Event(props: EventProps) {
    const {
        campaignId,
        event: { id = "", tempId },
        groupBy,
        totalColumns = 12,
        highlightData,
        editing = false,
    } = props;
    const queryClient = useQueryClient();
    const event = useQuery({
        queryKey: ["event", id],
        queryFn: () => {
            if (tempId !== undefined) return props.event;
            return database.timelineEvent.get(id);
        },
    });
    if (event.isLoading) {
        return (
            <Grid>
                <Skeleton width={"100%"} />
            </Grid>
        );
    }
    if (event.isError) {
        //refetch events
        queryClient.invalidateQueries({ queryKey: ["events", campaignId] });
        return <Grid>Error: {event.error.message}</Grid>;
    }
    if (!event.data) return <></>;
    const EventHandlers = {
        deleteFunction: () => {
            if (!event.data) return;
            deleteEvent(event.data, queryClient, campaignId);
        },
    };
    const dateColumns = groupBy === "day" ? 0 : 1;
    const modifyColumns = editing ? 2 : 0;
    const contentColumns = totalColumns - dateColumns - modifyColumns;
    switch (true) {
        case TimelineEvent.isSingleEvent(event.data): {
            return (
                <Grid sx={{ paddingLeft: "10px", backgroundColor: highlightData?.color }} container>
                    {dateColumns > 0 && (
                        <EventDate
                            date={event.data.date ?? ""}
                            groupBy={groupBy}
                            columnSize={dateColumns}
                        />
                    )}
                    <EventContentSingle event={event.data} columnSize={contentColumns} />
                    {editing && (
                        <ModifyButtonGroup
                            columnSize={modifyColumns}
                            deleteFunction={EventHandlers.deleteFunction}
                        />
                    )}
                </Grid>
            );
        }
        case TimelineEvent.isMultiEvent(event.data): {
            return (
                <Grid sx={{ paddingLeft: "10px", backgroundColor: highlightData?.color }} container>
                    {dateColumns > 0 && (
                        <EventDate
                            date={event.data.date ?? ""}
                            groupBy={groupBy}
                            columnSize={dateColumns}
                        />
                    )}
                    <EventContentMulti event={event.data} columnSize={contentColumns} />
                    {editing && (
                        <ModifyButtonGroup
                            columnSize={modifyColumns}
                            deleteFunction={EventHandlers.deleteFunction}
                        />
                    )}
                </Grid>
            );
        }
        default: {
            return <>{"Error: Event type not recognized"}</>;
        }
    }
}

function EditButton() {
    return (
        <IconButton>
            <EditIcon />
        </IconButton>
    );
}
interface DeleteButtonProps {
    deleteFunction: () => void;
}
function DeleteButton(props: DeleteButtonProps) {
    return (
        <IconButton onClick={props.deleteFunction}>
            <DeleteIcon color="error" />
        </IconButton>
    );
}
interface ModifyButtonGroupProps {
    columnSize?: number | GridSize;
    deleteFunction: () => void;
}

function ModifyButtonGroup(props: ModifyButtonGroupProps) {
    return (
        <Grid xs={props.columnSize}>
            <Box>
                <EditButton />
                <DeleteButton deleteFunction={props.deleteFunction} />
            </Box>
        </Grid>
    );
}
interface EventDateProps {
    columnSize?: number | GridSize;
    date: string;
    groupBy: groupBy;
}
function EventDate(props: EventDateProps) {
    const { date, groupBy, columnSize = 2 } = props;
    const processedDate = dayjs(date);
    const dateDisplay: { [key in groupBy]: JSX.Element } = {
        day: <>{processedDate.format("h:mm")}</>,
        week: <>{processedDate.format("ddd")}</>,
    };

    return <Grid xs={columnSize}>{dateDisplay[groupBy]}</Grid>;
}

function deleteEvent(event: TimelineEvent.Event, queryClient: QueryClient, campaignId: string) {
    {
        if (confirm("Are you sure you want to delete this event?")) {
            if (!(event && event.id)) {
                console.error("Event id not found");
                return;
            }
            const selectedEvent = event;
            console.log("Deleting event", selectedEvent);
            database.timelineEvent.delete(selectedEvent).then(() => {
                console.log("Event deleted");
            });

            queryClient.setQueryData(["event", selectedEvent.id], undefined);
            queryClient.setQueryData(["events", campaignId], (oldData: TimelineEvent.Event[]) => {
                if (!oldData) return [];
                return oldData.filter((e) => e.id !== selectedEvent?.id);
            });
            queryClient.setQueryData(["campaign", campaignId], (oldData: Campaign.Campaign) => {
                if (!oldData) return;
                return {
                    ...oldData,
                    events: oldData.campaignTimelineEvents.filter(
                        (e) => e.id !== selectedEvent?.id,
                    ),
                };
            });
            //switch on event single /multi
            switch (true) {
                case TimelineEvent.isSingleEvent(selectedEvent): {
                    queryClient.setQueryData(
                        ["assignmentEvents", selectedEvent.assignments[0].id],
                        (oldData: TimelineEvent.SingleEvent[]) => {
                            if (!oldData) return [];
                            return oldData.filter((e) => e.id !== selectedEvent.id);
                        },
                    );
                    queryClient.refetchQueries({
                        queryKey: ["assignmentEvents", selectedEvent.assignments[0].id],
                    });
                    break;
                }
                case TimelineEvent.isMultiEvent(selectedEvent): {
                    selectedEvent.assignments?.forEach((assignment) => {
                        queryClient.setQueryData(
                            ["assignmentEvents", assignment.id],
                            (oldData: TimelineEvent.SingleEvent[]) => {
                                if (!oldData) return [];
                                return oldData.filter((e) => e.id !== selectedEvent.id);
                            },
                        );
                        queryClient.refetchQueries({
                            queryKey: ["assignmentEvents", assignment.id],
                        });
                    });

                    break;
                }
            }
            queryClient.refetchQueries({ queryKey: ["assignmentEvents"], exact: false });
        }
    }
}
