import { DialogProps, PartialWith } from "@/app/Definitions/types";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Influencer from "@/app/ServerFunctions/types/influencer";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";
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

import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import { UseMutationResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "dayjs/locale/de";
import { useEffect, useMemo, useState } from "react";
import stylesExporter, { timeline } from "../../styles/stylesExporter";
import { DateSelector } from "./EventDetails/DateSelector";
import { submitEvent } from "./actions/submitEvent";
import assignment from "@/app/ServerFunctions/database/dataClients/assignments";
import EventDetails from "./EventDetails/EventDetails";
import dataClient from "@/app/ServerFunctions/database";
import sxStyles from "../sxStyles";
import EmailTriggerMenu from "./EmailTriggerMenu";
import { GeneralDetails } from "./EventDetails/GeneralDetails";
import validateFields from "./actions/validateFields";
import { random, randomId } from "@mui/x-data-grid-generator";

export const styles = stylesExporter.dialogs;
type DialogType = TimelineEvent.Event;

export type dates = {
    number: number;
    dates: (Dayjs | null)[];
};
type TimelineEventDialogProps = {
    onClose?: (hasChanged?: boolean) => void;
    editing?: boolean;
    editingData?: DialogType;
    campaignId: string;
    targetAssignment?: Assignment.AssignmentMin;
};
//######################
//#region DefaultValues
const typeDefault: {
    [key in TimelineEvent.eventType]: Partial<TimelineEvent.Event>;
} = {
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
const EventHasEmailTriggers: { [key in TimelineEvent.eventType | "none"]: boolean } = {
    none: false,

    Invites: true,
    Post: true,
    Video: true,
    WebinarSpeaker: true,

    Webinar: false,
};
//#endregion DefaultValues
//######################

export default function TimelineEventDialog(props: TimelineEventDialogProps) {
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
    const [timelineEvent, setTimelineEvent] = useState<
        PartialWith<DialogType, "campaign" | "parentEvent" | "childEvents">
    >(
        editingData ?? {
            campaign: { id: campaignId },
            assignments: targetAssignment ? [targetAssignment] : [],
            parentEvent: null,
            childEvents: [],
        },
    );
    const [updatedData, setUpdatedData] = useState<Partial<DialogType>>({});
    const [dates, setDates] = useState<{ number: number; dates: (Dayjs | null)[] }>({
        number: 1,
        dates: [editingData ? dayjs(editingData.date) : dayjs()],
    });

    const influencers = useQuery({
        queryKey: ["influencers"],
        queryFn: async () => {
            return dataClient.influencer.list();
        },
    });

    //#endregion States
    //######################

    //######################
    //#region Effects
    useEffect(() => {
        if (editingData) {
            setTimelineEvent(editingData);
            setDates({ number: 1, dates: [dayjs(editingData.date)] });
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
    const sxProps: SxProps = useMemo(() => {
        return {
            "&": {
                "& #EventTriggerContainer": {
                    maxWidth: "300px",
                },
                "#EventCompleteCheckbox": {
                    paddingInlineEnd: "10px",
                },
                "& #EmailTriggerMenu": {
                    display: "flex",
                    flexDirection: "column",
                    // border: "1px solid black",
                    // borderRadius: "10px",
                    height: "100%",
                    maxHeight: "100%",
                    maxWidth: "100%",
                },
                "& #EmailTriggerMenuLoading": {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                },

                "& #EmailTrigger": {
                    position: "relative",
                    border: "1px solid black",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    maxWidth: "100%",
                    "#TriggerModifyButtonContainer": {
                        position: "absolute",
                        display: "flex",
                        justifyContent: "flex-end",
                        right: 0,
                        top: 0,
                        animation: "fadeOut 0.3s ease-in-out forwards",
                        "@keyframes fadeOut": {
                            from: {
                                opacity: 1,
                            },
                            to: {
                                opacity: 0,
                                display: "none",
                            },
                        },
                    },
                    "&:hover > #TriggerModifyButtonContainer": {
                        display: "flex",
                        animation: "fadeIn 0.3s ease-in-out",
                        "@keyframes fadeIn": {
                            from: {
                                opacity: 0,
                            },
                            to: {
                                opacity: 1,
                            },
                        },
                    },
                },
            },
        };
    }, []);
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
            event.preventDefault();
            const combinedEvent = { ...timelineEvent, ...updatedData };
            const type = combinedEvent.type;
            if (!type || !TimelineEvent.isTimelineEventType(type))
                throw new Error("No event type selected");

            if (!validateFields(combinedEvent, type)) return;
            // if (!campaignId || !TimelineEvent.validate(combinedEvent) || !targetAssignment) return;
            // if (!TimelineEvent.isTimelineEvent(combinedEvent)) throw new Error("Invalid event type");

            submitEvent({
                editing,
                event: combinedEvent,
                // campaign,
                dates,
                updatedData,
                // queryClient,
                // assignment: targetAssignment,
            });
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
            const value = e.target.value as TimelineEvent.singleEventType;
            setTimelineEvent(
                (prev) =>
                    ({
                        ...prev,
                        ...typeDefault[value],
                    } satisfies Partial<TimelineEvent.Event>),
            );
        },
        assignment: (e: SelectChangeEvent<unknown>) => {
            const value = e.target.value;
            setTimelineEvent((prev) => ({ ...prev, assignment: value }));
        },
        createEvent: useMutation({
            mutationFn: async (data: { newEvent: TimelineEvent.Event; dates: dates }) => {
                const { newEvent, dates } = data;
                const createdEvents = await submitEvent({ event: newEvent, dates, editing: false });
                return createdEvents;
            },
            onMutate: async (data: { newEvent: TimelineEvent.Event; dates: dates }) => {
                const { newEvent, dates } = data;
                const newEvents = dates.dates
                    .map((date) => {
                        if (date === null) return;
                        const tempId = randomId();
                        const event: TimelineEvent.Event = {
                            ...newEvent,
                            date: date.toISOString(),
                            id: tempId,
                        };
                        return event;
                    })
                    .filter((x): x is TimelineEvent.Event => x !== undefined);
                await queryClient.cancelQueries({
                    queryKey: ["timelineEvents"],
                });
                const previousEvents = queryClient.getQueryData<TimelineEvent.Event[]>([
                    "timelineEvents",
                ]);
                newEvents.forEach((event) => {
                    queryClient.setQueryData<TimelineEvent.Event>(["timelineEvent", event.id], {
                        ...event,
                    });
                });
                queryClient.setQueryData<TimelineEvent.Event[]>(
                    ["timelineEvents"],
                    [...(previousEvents ?? []), ...newEvents],
                );
                const assignment = newEvent.assignments[0];
                let previousAssignmentEvents: TimelineEvent.Event[] | undefined = [];
                if (assignment) {
                    previousAssignmentEvents = queryClient.getQueryData<TimelineEvent.Event[]>([
                        "assignmentEvents",
                        assignment.id,
                    ]);
                    queryClient.setQueryData(
                        ["assignmentEvents", assignment.id],
                        [...(previousAssignmentEvents ?? []), ...newEvents],
                    );
                }
                return { previousEvents, previousAssignmentEvents, newEvents, assignment };
            },
            onError(error, newData, context) {
                console.error("Error updating record", { error, newData, context });
                if (context?.previousEvents) {
                    queryClient.setQueryData(["timelineEvents"], context.previousEvents);
                }
                if (context?.previousAssignmentEvents && context.assignment) {
                    queryClient.setQueryData(
                        ["assignmentEvents", context.assignment.id],
                        context.previousAssignmentEvents,
                    );
                }
                if (context?.newEvents) {
                    context.newEvents.forEach((event) => {
                        queryClient.setQueryData(["timelineEvent", event.id], null);
                    });
                }
            },
            onSettled(data, error, variables, context) {
                console.log(
                    "Events created",
                    { data, error, variables, context },
                    // data?.isCompleted,
                );
                if (context?.newEvents) {
                    context.newEvents.forEach((event) => {
                        queryClient.setQueryData(["timelineEvent", event.id], null);
                        queryClient.invalidateQueries({
                            queryKey: ["timelineEvent", event.id],
                        });
                    });
                }
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
        eventCompleted: useMutation({
            mutationFn: async (isCompleted: boolean) => {
                const event = timelineEvent;
                if (!event.id) throw new Error("Event has no id");
                const updatedEvent = await dataClient.timelineEvent.update({
                    id: event.id,
                    updatedData: { isCompleted },
                });
                return updatedEvent;
            },
            onMutate: async (isCompleted: boolean) => {
                await queryClient.cancelQueries({
                    queryKey: ["timelineEvent", timelineEvent.id],
                });
                const previousEvent = queryClient.getQueryData<TimelineEvent.Event>([
                    "timelineEvent",
                    timelineEvent.id,
                ]);
                if (!previousEvent) return null;
                const newEvent = { ...previousEvent, isCompleted };
                queryClient.setQueryData<TimelineEvent.Event>(["timelineEvent", timelineEvent.id], {
                    ...newEvent,
                });
                return { previousEvent, newEvent };
            },
            onError(error, newEvent, context) {
                console.error("Error updating record", { error, newEvent, context });
                if (context?.previousEvent) {
                    queryClient.setQueryData(
                        ["timelineEvent", timelineEvent.id],
                        context.previousEvent,
                    );
                }
            },
            onSettled(data, error, variables, context) {
                console.log(
                    "Mutation Settled",
                    { data, error, variables, context },
                    data?.isCompleted,
                );
                queryClient.invalidateQueries({
                    queryKey: ["timelineEvent", timelineEvent.id],
                });
                queryClient.invalidateQueries({
                    queryKey: ["timelineEvents"],
                });
            },
        }),
    };

    //#endregion Event Handlers
    //######################

    return (
        <Dialog
            // ref={modalRef}
            open
            className={styles.dialog}
            onClose={EventHandlers.handleClose(false)}
            PaperProps={{
                component: "form",
                onSubmit: EventHandlers.onSubmit,
            }}
            sx={sxStyles.TimelineEventDialog}
        >
            <Box id="EventTriggerSplit" sx={sxProps}>
                <Box id="Event">
                    <DialogTitle>
                        {editing ? "Ereignis bearbeiten" : "Neues Ereignis"}
                        <Button onClick={EventHandlers.printEvent}>Print Event</Button>
                    </DialogTitle>
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
                        dates={dates}
                        setDates={setDates}
                        setTimelineEvent={setTimelineEvent}
                    />

                    {/* Details */}
                    <EventDetails
                        key="EventDetails"
                        applyDetailsChange={(data: Partial<TimelineEvent.Event>) =>
                            setTimelineEvent((prev) => ({ ...prev, ...data }))
                        }
                        data={timelineEvent}
                        isEditing={editing}
                        updatedData={updatedData}
                        setUpdatedData={setUpdatedData}
                    />

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
                </Box>
                {editing && (
                    <Box id="EventTriggerContainer" display="flex" flexDirection="column">
                        <EventCompleteCheckbox
                            eventId={timelineEvent.id ?? "<Error>"}
                            changeEventComplete={DataChange.eventCompleted}
                        />
                        {EventHasEmailTriggers[timelineEvent.type ?? "none"] &&
                            timelineEvent.id && (
                                <Box id="Trigger">
                                    <EmailTriggerMenu eventId={timelineEvent.id} />
                                </Box>
                            )}
                    </Box>
                )}
            </Box>
        </Dialog>
    );
}
//MARK: EventCompleteCheckbox
interface EventCompleteCheckboxProps {
    eventId: string;
    changeEventComplete: UseMutationResult<TimelineEvent.Event, Error, boolean, unknown>;
}
function EventCompleteCheckbox(props: EventCompleteCheckboxProps) {
    const { eventId, changeEventComplete } = props;
    const queryClient = useQueryClient();
    const event = useQuery({
        queryKey: ["timelineEvent", eventId],
        queryFn: async () => {
            console.log(`Getting event ${eventId} in EventCompleteCheckbox`);
            return dataClient.timelineEvent.get(eventId);
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
