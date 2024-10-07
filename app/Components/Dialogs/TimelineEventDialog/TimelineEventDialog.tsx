import { PartialWith, Prettify } from "@/app/Definitions/types";
import { Assignment, Assignments, Campaign, Influencer, Event, Events } from "@/app/ServerFunctions/types";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogTitle,
    FormControlLabel,
    SelectChangeEvent,
    SxProps,
    Typography,
} from "@mui/material";

import { dayjs, Dayjs } from "@/app/utils";
import { UseMutationResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "dayjs/locale/de";
import React, { useEffect, useMemo, useState } from "react";
import DateSelector from "./EventDetails/DateSelector";
import { submitEvent } from "./actions/submitEvent";
import EventDetails from "./EventDetails/EventDetails";
import { dataClient } from "@dataClient";
import sxStyles from "../sxStyles";
import { EmailTriggerMenu } from "./EmailTriggers";
import { GeneralDetails } from "./EventDetails/GeneralDetails";
import validateFields from "./actions/validateFields";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import { queryKeys } from "@/app/(main)/queryClient/keys";

// export type dates = {
//     number: number;
//     dates: (Dayjs | null)[];
// };
type TimelineEventDialogProps = {
    onClose?: (hasChanged?: boolean) => void;
    editing?: boolean;
    editingData?: Event;
    campaignId: string;
    targetAssignment?: Assignments.Min;
};
//######################
//#region DefaultValues
const typeDefault: {
    [key in Events.EventType]: Partial<Event>;
} = {
    ImpulsVideo: {
        type: "ImpulsVideo",
        eventAssignmentAmount: 1,
        eventTaskAmount: 0,
    },
    Invites: {
        type: "Invites",
        eventAssignmentAmount: 1,
        eventTaskAmount: 1000,
    },
    Post: {
        type: "Post",
        eventAssignmentAmount: 1,
        eventTaskAmount: 0,
    },
    Video: {
        type: "Video",
        eventAssignmentAmount: 1,
        eventTaskAmount: 0,
    },
    WebinarSpeaker: {
        type: "WebinarSpeaker",
        eventAssignmentAmount: 1,
        eventTaskAmount: 0,
    },
    Webinar: {
        type: "Webinar",
        eventAssignmentAmount: 1,
        eventTaskAmount: 0,
        targetAudience: { industry: [], cities: [], country: ["Deutschland"] },
        parentEvent: null,
        childEvents: [],
    },
};

//#endregion DefaultValues
//######################

export function TimelineEventDialog(props: TimelineEventDialogProps) {
    //######################
    //#region Props
    const { onClose, editing = false, editingData, campaignId, targetAssignment } = props;
    //#endregion Props
    //######################

    //######################
    //#region Variables
    const queryClient = useQueryClient();

    //#endregion Variables
    //######################

    //######################
    //#region States
    const [timelineEvent, setTimelineEvent] = useState<PartialWith<Event, "campaign" | "parentEvent" | "childEvents">>(
        editingData ?? {
            campaign: { id: campaignId },
            assignments: targetAssignment ? [targetAssignment] : [],
            parentEvent: null,
            childEvents: [],
        }
    );
    const [updatedData, setUpdatedData] = useState<Partial<Event>[]>([{}]);
    const { data: userGroups } = useQuery({
        queryKey: queryKeys.currentUser.userGroups(),
        queryFn: async () => {
            return getUserGroups();
        },
    });
    // const [dates, setDates] = useState<{ number: number; dates: (Dayjs | null)[] }>({
    //     number: 1,
    //     dates: [editingData ? dayjs(editingData.date) : dayjs()],
    // });

    // const influencers = useQuery({
    //     queryKey: ["influencers"],
    //     queryFn: async () => {
    //         return dataClient.influencer.list();
    //     },
    // });

    //#endregion States
    //######################

    //######################
    //#region Effects
    useEffect(() => {
        if (editingData) {
            setTimelineEvent(editingData);
            // setDates({ number: 1, dates: [dayjs(editingData.date)] });
        }

        return () => {};
    }, [editingData]);

    useEffect(() => {
        setTimelineEvent((prev) => ({ ...prev, assignment: targetAssignment }));
        return () => {};
    }, [targetAssignment]);

    useEffect(() => {
        setTimelineEvent((prev) => ({ ...prev, campaign: { id: campaignId } }));
        return () => {};
    }, [campaignId]);

    //#endregion Effects
    //######################

    //######################
    //#region Event Handlers
    const EventHandlers = {
        handleClose: (hasChanged?: boolean) => {
            return () => {
                if (onClose) {
                    onClose(hasChanged);
                }
            };
        },
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            // debugger;
            event.preventDefault();
            const combinedEvents = updatedData.map((data) => ({ ...timelineEvent, ...data }));
            const type = combinedEvents[0].type;
            if (!type || !Events.isTimelineEventType(type)) throw new Error("No event type selected");

            if (!editing) {
                // if (!combinedEvents.every((event) => validateFields(event, type))) return;
                const validatedNewEvents = combinedEvents.filter((event): event is Event =>
                    validateFields(event, type)
                );
                DataChange.createEvents.mutate({ newEvents: validatedNewEvents });
            } else {
                if (!validateFields(timelineEvent, type)) return;
                updatedData.forEach((data) => {
                    if (!validateFields(data, type)) return;
                    DataChange.updateEvent.mutate({
                        previousEvent: timelineEvent,
                        updatedData: data,
                    });
                });
                // submitEvent({
                //     editing,
                //     event: combinedEvent,
                //     // campaign,
                //     dates,
                //     updatedData,
                //     // queryClient,
                //     // assignment: targetAssignment,
                // });
            }
            console.log("closing");
            EventHandlers.handleClose(true)();
        },

        printEvent: () => {
            //print all properties of the event on separate lines
            console.log("####################");
            console.log("data");
            Object.entries(timelineEvent).forEach(([key, value]) => {
                console.log(`${key}:`, value);
            });
            console.log("####################");
            console.log("updatedData");
            Object.entries(updatedData).forEach(([key, value]) => {
                console.log(`${key}:`, value);
            });
        },
    };

    const DataChange = {
        type: (e: SelectChangeEvent<unknown>) => {
            const value = e.target.value as Events.singleEventType;
            setTimelineEvent(
                (prev) =>
                    ({
                        ...prev,
                        ...typeDefault[value],
                    } satisfies Partial<Event>)
            );
        },
        assignment: (e: SelectChangeEvent<unknown>) => {
            const value = e.target.value;
            setTimelineEvent((prev) => ({ ...prev, assignment: value }));
        },
        createEvents: useMutation({
            mutationFn: async (data: { newEvents: Event[] }) => {
                console.log("Creating events", data);
                const { newEvents } = data;
                const createdEvents = await Promise.all(
                    newEvents.map((newEvent) => submitEvent({ event: newEvent, editing: false }))
                );
                return createdEvents;
            },
            onMutate: async (data: { newEvents: Event[] }) => {
                const { newEvents } = data;
                await queryClient.cancelQueries({
                    queryKey: ["timelineEvents"],
                });
                const previousEvents = queryClient.getQueryData<Event[]>(["timelineEvents"]);
                newEvents.map((newEvent) =>
                    queryClient.setQueryData<Event>(["timelineEvent", newEvent.id], {
                        ...newEvent,
                    })
                );
                queryClient.setQueryData<Event[]>(["timelineEvents"], [...(previousEvents ?? []), ...newEvents]);
                queryClient.setQueryData<Event[]>(
                    [campaignId, "timelineEvents"],
                    [...(previousEvents ?? []), ...newEvents]
                );
                const assignment = newEvents[0].assignments[0];
                let previousAssignmentEvents: Event[] | undefined = [];
                if (assignment) {
                    previousAssignmentEvents = queryClient.getQueryData<Event[]>(["assignmentEvents", assignment.id]);
                    queryClient.setQueryData(
                        ["assignmentEvents", assignment.id],
                        [...(previousAssignmentEvents ?? []), ...newEvents]
                    );
                }
                return { previousEvents, previousAssignmentEvents, newEvents, assignment };
            },
            onError(error, newData, context) {
                console.error("Error updating record", { error, newData, context });
                const { newEvents, previousEvents, previousAssignmentEvents, assignment } = context ?? {};
                if (previousEvents) {
                    queryClient.setQueryData(["timelineEvents"], previousEvents);
                }
                if (previousAssignmentEvents && assignment) {
                    queryClient.setQueryData(["assignmentEvents", assignment.id], previousAssignmentEvents);
                }
                if (newEvents && newEvents.length > 0) {
                    newEvents.forEach((newEvent) => {
                        queryClient.setQueryData(["timelineEvent", newEvent.id], null);
                    });
                }
            },
            onSettled(data, error, variables, context) {
                console.log(
                    "Events created",
                    { data, error, variables, context }
                    // data?.isCompleted,
                );

                const { newEvents, assignment } = context ?? {};
                if (newEvents && newEvents.length > 0) {
                    newEvents.forEach((newEvent) => {
                        queryClient.invalidateQueries({
                            queryKey: ["timelineEvent", newEvent.id],
                        });
                    });
                }
                queryClient.invalidateQueries({
                    queryKey: ["timelineEvents"],
                });
                if (assignment) {
                    queryClient.invalidateQueries({
                        queryKey: ["assignmentEvents", assignment.id],
                    });
                }
            },
        }),
        updateEvent: useMutation({
            mutationFn: async (input: { previousEvent: Event; updatedData: Partial<Event> }) => {
                // debugger;
                const { previousEvent, updatedData } = input;
                const id = previousEvent.id;
                if (process.env.NODE_ENV === "development")
                    console.log("Updating event", { id, previousEvent, updatedData });
                if (!id) throw new Error("No id provided for event update");
                const updatedEvent = await submitEvent({
                    editing: true,
                    event: previousEvent,
                    updatedData,
                });
                return updatedEvent;
            },
            onMutate: async (input) => {
                const { previousEvent, updatedData } = input;
                await queryClient.cancelQueries({
                    queryKey: ["timelineEvent", timelineEvent.id],
                });
                await queryClient.cancelQueries({
                    queryKey: ["timelineEvents", campaignId],
                });
                const newEvent = { ...previousEvent, ...updatedData };
                newEvent.info = { ...previousEvent.info, ...updatedData.info };
                const previousEvents = queryClient.getQueryData<Event[]>(["timelineEvents"]);
                queryClient.setQueryData<Event>(["timelineEvent", timelineEvent.id], {
                    ...newEvent,
                });
                queryClient.setQueryData<Event[]>(["timelineEvents", campaignId], (prev) => {
                    // debugger;
                    if (!prev) return [newEvent];
                    return prev.map((event) => (event.id === newEvent.id ? newEvent : event));
                });

                const assignment = newEvent.assignments[0];
                let previousAssignmentEvents: Event[] | undefined = [];
                if (assignment) {
                    previousAssignmentEvents = queryClient.getQueryData<Event[]>(["assignmentEvents", assignment.id]);
                    queryClient.setQueryData<Event[]>(["assignmentEvents", assignment.id], (prev) => {
                        if (!prev) return [newEvent];
                        return prev.map((event) => (event.id === newEvent.id ? newEvent : event));
                    });
                }
                return {
                    previousEvent,
                    newEvent,
                    previousEvents,
                    previousAssignmentEvents,
                    assignment,
                };
            },
            onError(error, newEvent, context) {
                console.error("Error updating record", { error, newEvent, context });
                if (context?.previousEvent) {
                    queryClient.setQueryData(["timelineEvent", timelineEvent.id], context.previousEvent);
                }
                if (context?.previousEvents) {
                    queryClient.setQueryData(["timelineEvents", campaignId], context.previousEvents);
                }
                if (context?.previousAssignmentEvents && context.assignment) {
                    queryClient.setQueryData(
                        ["assignmentEvents", context.assignment.id],
                        context.previousAssignmentEvents
                    );
                }
            },
            onSettled(data, error, variables, context) {
                if (process.env.NODE_ENV === "development")
                    console.log(
                        "Event updated",
                        { data, error, variables, context }
                        // data?.isCompleted,
                    );
                queryClient.invalidateQueries({
                    queryKey: ["timelineEvent", timelineEvent.id],
                });
                queryClient.invalidateQueries({
                    queryKey: ["timelineEvents"],
                });
                if (context?.assignment) {
                    queryClient.invalidateQueries({
                        queryKey: ["assignmentEvents", context.assignment.id],
                    });
                }
            },
        }),
    };

    //#endregion Event Handlers
    //######################
    const oldTimelineSx = {
        "&.timelineDialogplpl": {
            ".MuiPaper-root": {
                maxWidth: "90vw",
                minWidth: "max-content",
                maxHeight: "90vh",
                height: "fit-content",
            },
            ".MuiDialogContent-root": {
                maxWidth: "max(80vw,1000px)",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                // width: "520px",
            },
            ".MuiFormControl-root": {
                // padding: "5px",
                minWidth: "20ch",
                margin: "5px",
                // flex: 1,
            },
            ".MuiDialogContentText-root": {
                flexBasis: "100%",
                flexShrink: 0,
            },
            ".MuiDialogContent-dividers:nth-of-type(even)": {
                // display: "none",
                border: "none",
            },
            "#EventTriggerSplit": {
                display: "flex",
                flexDirection: "row",
                flex: 1,
                maxWidth: "max-content",
                ".MuiBox-root": {
                    padding: "5px",
                },
            },
            "#Event": {
                maxWidth: "600px",
                flex: 2,
                borderRight: "1px solid #e0e0e0",
            },
            "#Trigger": {
                flex: 1,
                padding: "5px",
            },
        },
    };
    const sx: SxProps = {
        ".MuiDialog-container": {
            ".MuiPaper-root": {
                minWidth: "fit-content",
                height: "fit-content",
                ">.eventTriggerSplit": {
                    flex: 1,
                    flexDirection: "row",
                    overflowY: "hidden",
                    gap: "10px",
                    "#Event": {
                        // width: "100%",
                        width: "max-content",
                        maxWidth: "100%",
                        flex: 1,
                        "&:only-of-type": {
                            maxWidth: "600px",
                        },
                    },
                },
            },
        },
    };
    return (
        <Dialog
            // ref={modalRef}
            id="TimelineEventDialog"
            open
            className={"dialog timelineDialog"}
            onClose={(event, reason) => {
                if (reason === "backdropClick" || reason === "escapeKeyDown") return;
                EventHandlers.handleClose(false);
            }}
            PaperProps={{
                component: "form",
                onSubmit: EventHandlers.onSubmit,
            }}
            sx={{ ...sxStyles.DialogDefault, ...sx }}
        >
            <DialogTitle>
                {editing ? "Ereignis bearbeiten" : "Neues Ereignis"}
                {userGroups?.includes("admin") && <Button onClick={EventHandlers.printEvent}>Print Event</Button>}
            </DialogTitle>
            <Box id="EventTriggerSplit" className="eventTriggerSplit" sx={sx}>
                <Box id="Event">
                    {/* <button onClick={handleCloseModal}>x</button> */}
                    <GeneralDetails
                        event={timelineEvent}
                        editing={editing}
                        targetAssignment={targetAssignment}
                        onInfluencerChange={DataChange.assignment}
                        onTypeChange={DataChange.type}
                        campaignId={campaignId}
                    />
                    <DateSelector
                        timelineEvent={timelineEvent}
                        isEditing={editing}
                        eventType={timelineEvent.type}
                        setTimelineEvent={setTimelineEvent}
                        updatedData={updatedData}
                        setUpdatedData={setUpdatedData}
                    />

                    {/* Details */}
                    <EventDetails
                        key="EventDetails"
                        applyDetailsChange={(data: Partial<Event>[]) =>
                            setTimelineEvent((prev) => ({ ...prev, ...data[0] }))
                        }
                        data={timelineEvent}
                        isEditing={editing}
                        updatedData={updatedData}
                        setUpdatedData={setUpdatedData}
                    />
                </Box>
                {editing && timelineEvent.id && timelineEvent.type && (
                    <EmailTriggerMenu eventId={timelineEvent.id} eventType={timelineEvent.type} />
                )}
            </Box>
            <DialogActions
                sx={{
                    justifyContent: "space-between",
                }}
            >
                <Button onClick={EventHandlers.handleClose(false)} color="secondary">
                    Abbrechen
                </Button>
                <Button variant="contained" type="submit">
                    Speichern
                </Button>
            </DialogActions>
        </Dialog>
    );
}
//MARK: EventCompleteCheckbox
interface EventCompleteCheckboxProps {
    eventId: string;
    changeEventComplete: UseMutationResult<Event, Error, boolean, unknown>;
}
function EventCompleteCheckbox(props: EventCompleteCheckboxProps) {
    const { eventId, changeEventComplete } = props;
    const queryClient = useQueryClient();
    const event = useQuery({
        queryKey: ["timelineEvent", eventId],
        queryFn: async () => {
            console.log(`Getting event ${eventId} in EventCompleteCheckbox`);
            return dataClient.event.get(eventId);
        },
    });
    const isPlaceholder = event.data?.assignments[0]?.isPlaceholder ?? true;
    if (!event.data) return <Typography>Event nicht gefunden</Typography>;
    if (isPlaceholder) return null;
    return (
        <FormControlLabel
            id="EventCompleteCheckbox"
            label="Event abgeschlossen?"
            labelPlacement="start"
            control={
                <Checkbox
                    checked={event.data.isCompleted}
                    onChange={() => {
                        if (!event.data) return;
                        changeEventComplete.mutate(!event.data.isCompleted);
                    }}
                    inputProps={{ "aria-label": "controlled" }}
                />
            }
        ></FormControlLabel>
    );
}
