import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import {
    Box,
    CircularProgress,
    Unstable_Grid2 as Grid,
    GridSize,
    IconButton,
    Skeleton,
    Typography,
} from "@mui/material";
import { groupBy } from "../Functions/groupEvents";
import dayjs from "@/app/utils/configuredDayJs";
import { timelineEventTypesType } from "@/amplify/data/types";
import EventContentSingle from "./EventContentSingle";
import EventContentMulti from "./EventContentMulti";
import { Query, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddIcon, DeleteIcon, EditIcon, RefreshIcon } from "@/app/Definitions/Icons";
import Campaign from "@/app/ServerFunctions/types/campaign";
import { highlightData } from "@/app/Definitions/types";
import dataClient from "@/app/ServerFunctions/database";
import { useState } from "react";
import TimelineEventSingleDialog from "../../Dialogs/TimelineEvent/SingleEvent/TimelineEventSingleDialog";
import TimelineEventMultiDialog from "../../Dialogs/TimelineEvent/MultiEvent/TimelineEventMultiDialog";

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
        queryKey: ["timelineEvent", id],
        queryFn: () => {
            if (tempId !== undefined) return props.event;
            return dataClient.timelineEvent.get(id);
        },
    });
    const campaign = useQuery({
        queryKey: ["campaign", campaignId],
        queryFn: () => {
            return dataClient.campaign.get(campaignId);
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
        deleteFunction: async () => {
            if (!event.data || !event.data.id) return;
            await dataClient.timelineEvent.delete(event.data.id);
        },
        setEvent: async (updatedData: Partial<TimelineEvent.Event>) => {
            if (!event.data) return;
            console.log("Updating event", updatedData, event.data);
            const newEvent = await dataClient.timelineEvent.update(updatedData, event.data);
            console.log("Updated event", newEvent);
        },
    };
    const dateColumns = groupBy === "day" ? 0 : 1;
    const modifyColumns = editing ? 2 : 0;
    const contentColumns = totalColumns - dateColumns - modifyColumns;

    //assure data is available
    if (!event.data || !campaign.data) return <></>;
    if (event.isLoading || campaign.isLoading) return <Skeleton width={"100%"} />;

    switch (true) {
        case TimelineEvent.isSingleEvent(event.data): {
            return (
                <Grid
                    sx={{ position: "relative", paddingLeft: "10px", backgroundColor: highlightData?.color }}
                    container
                >
                    {dateColumns > 0 && (
                        <EventDate date={event.data.date ?? ""} groupBy={groupBy} columnSize={dateColumns} />
                    )}
                    <EventContentSingle event={event.data} columnSize={contentColumns} />
                    {/* Floating Progress indicator */}

                    <CircularProgress
                        size={25}
                        sx={{
                            position: "absolute",
                            top: "10px",
                            left: "50%",
                            zIndex: 1000,
                            ...{
                                display: event.isFetching ? "block" : "none",
                            },
                        }}
                    />
                    {editing && (
                        <ModifyButtonGroup
                            {...({
                                deleteFunction: EventHandlers.deleteFunction,
                                event: event.data,
                                setEvent: EventHandlers.setEvent,
                                campaign: campaign.data,
                            } satisfies ModifyButtonGroupProps)}
                        />
                    )}
                </Grid>
            );
        }
        case TimelineEvent.isMultiEvent(event.data): {
            return (
                <Grid sx={{ paddingLeft: "10px", backgroundColor: highlightData?.color }} container>
                    {dateColumns > 0 && (
                        <EventDate date={event.data.date ?? ""} groupBy={groupBy} columnSize={dateColumns} />
                    )}
                    <EventContentMulti event={event.data} columnSize={contentColumns} />
                    {editing && (
                        <ModifyButtonGroup
                            {...({
                                deleteFunction: EventHandlers.deleteFunction,
                                event: event.data,
                                setEvent: EventHandlers.setEvent,
                                campaign: campaign.data,
                            } satisfies ModifyButtonGroupProps)}
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

interface ModifyButtonGroupProps {
    columnSize?: number | GridSize;
    deleteFunction: () => void;
    campaign: Campaign.Campaign;
    event: TimelineEvent.Event;
    setEvent: (updatedData: Partial<TimelineEvent.Event>) => void;
}
function ModifyButtonGroup(props: ModifyButtonGroupProps) {
    const { setEvent, event, deleteFunction, columnSize, campaign } = props;
    return (
        <Grid xs={columnSize}>
            <Box>
                <EditButton {...{ setEvent, event, campaign }} />
                <DeleteButton deleteFunction={deleteFunction} />
            </Box>
        </Grid>
    );
}
interface EditButtonProps {
    setEvent: (updatedData: Partial<TimelineEvent.Event>) => void;
    event: TimelineEvent.Event;
    campaign: Campaign.Campaign;
}
function EditButton(props: EditButtonProps) {
    const { event, campaign } = props;
    const [isOpen, setIsOpen] = useState(false);

    const EventHandler = {
        openDialog: () => {
            setIsOpen(true);
        },
        closeDialog: () => {
            setIsOpen(false);
        },
    };
    switch (true) {
        case TimelineEvent.isSingleEvent(event): {
            return (
                <>
                    {isOpen && (
                        <TimelineEventSingleDialog
                            {...{
                                onClose: EventHandler.closeDialog,
                                parent: campaign,
                                editing: true,
                                editingData: event,
                                campaignId: event.campaign.id,
                                targetAssignment: event.assignments[0],
                            }}
                        />
                    )}
                    <IconButton
                        onClick={() => {
                            console.log("Opening dialog");
                            console.log(event);
                            EventHandler.openDialog();
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                </>
            );
        }
        case TimelineEvent.isMultiEvent(event): {
            return (
                <>
                    {/* {isOpen && <TimelineEventMultiDialog onClose={EventHandler.closeDialog} />} */}
                    <IconButton>
                        <EditIcon />
                    </IconButton>
                </>
            );
        }
        default: {
            return <></>;
        }
    }
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

// function deleteEvent(event: TimelineEvent.Event, queryClient: QueryClient, campaignId: string) {
//     {
//         if (confirm("Are you sure you want to delete this event?")) {
//             if (!(event && event.id)) {
//                 console.error("Event id not found");
//                 return;
//             }
//             const selectedEvent = event;
//             console.log("Deleting event", selectedEvent);
//             dataClient.timelineEvent.delete(selectedEvent).then(() => {
//                 console.log("Event deleted");
//             });

//             queryClient.setQueryData(["event", selectedEvent.id], undefined);
//             queryClient.setQueryData(["events", campaignId], (oldData: TimelineEvent.Event[]) => {
//                 if (!oldData) return [];
//                 return oldData.filter((e) => e.id !== selectedEvent?.id);
//             });
//             queryClient.setQueryData(["campaign", campaignId], (oldData: Campaign.Campaign) => {
//                 if (!oldData) return;
//                 return {
//                     ...oldData,
//                     events: oldData.campaignTimelineEvents.filter((e) => e.id !== selectedEvent?.id),
//                 };
//             });
//             //switch on event single /multi
//             switch (true) {
//                 case TimelineEvent.isSingleEvent(selectedEvent): {
//                     queryClient.setQueryData(
//                         ["assignmentEvents", selectedEvent.assignments[0].id],
//                         (oldData: TimelineEvent.SingleEvent[]) => {
//                             if (!oldData) return [];
//                             return oldData.filter((e) => e.id !== selectedEvent.id);
//                         }
//                     );
//                     queryClient.refetchQueries({
//                         queryKey: ["assignmentEvents", selectedEvent.assignments[0].id],
//                     });
//                     break;
//                 }
//                 case TimelineEvent.isMultiEvent(selectedEvent): {
//                     selectedEvent.assignments?.forEach((assignment) => {
//                         queryClient.setQueryData(
//                             ["assignmentEvents", assignment.id],
//                             (oldData: TimelineEvent.SingleEvent[]) => {
//                                 if (!oldData) return [];
//                                 return oldData.filter((e) => e.id !== selectedEvent.id);
//                             }
//                         );
//                         queryClient.refetchQueries({
//                             queryKey: ["assignmentEvents", assignment.id],
//                         });
//                     });

//                     break;
//                 }
//             }
//             queryClient.refetchQueries({ queryKey: ["assignmentEvents"], exact: false });
//         }
//     }
// }
