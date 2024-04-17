import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { Button, DialogContent, SelectChangeEvent, TextField, Typography } from "@mui/material";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import { Add as AddIcon, DeleteOutlined as DeleteIcon } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { Dispatch, MouseEvent, SetStateAction, useEffect, useMemo } from "react";
import { dates, styles } from "./SingleEvent/TimelineEventSingleDialog";
import { PartialWith } from "@/app/Definitions/types";
import { useQuery } from "@tanstack/react-query";
import dataClient from "@/app/ServerFunctions/database";

interface DateSelectorProps {
    timelineEvent: PartialWith<TimelineEvent.SingleEvent, "relatedEvents" | "campaign">;
    setTimelineEvent: Dispatch<SetStateAction<DateSelectorProps["timelineEvent"]>>;
    isEditing: boolean;
    eventType: TimelineEvent.singleEventType;
    dates: dates;
    setDates: Dispatch<SetStateAction<dates>>;
}
export function DateSelector(props: DateSelectorProps) {
    const { dates, setDates, isEditing, timelineEvent, setTimelineEvent } = props;

    if (TimelineEvent.isEventReference(timelineEvent)) {
        //TODO resolve EventReference
        throw new Error("EventReference not implemented in DateSelector");
    }

    const parentEvent = useQuery({
        queryKey: ["event", timelineEvent.relatedEvents?.parentEvent?.id],
        queryFn: () =>
            TimelineEvent.resolveEventReference(timelineEvent.relatedEvents?.parentEvent ?? null),
    });

    timelineEvent.relatedEvents
        ? TimelineEvent.resolveEventReference(timelineEvent.relatedEvents.parentEvent)
        : null;

    const EventHandlers = {
        handleAddDateClick: () => {
            setDates((prev) => {
                const lastDate = prev.dates[prev.dates.length - 1];
                const newDate = lastDate ? dayjs(lastDate).add(1, "day") : dayjs();
                return { number: prev.number + 1, dates: [...prev.dates, newDate] };
            });
        },
        handleDateChange: (index: number, newDate: Dayjs | null) => {
            console.log("handleDateChange", index, newDate?.toString());
            if (!newDate) return;
            setDates((prev) => ({
                ...prev,
                dates: [...prev.dates.map((x, i) => (i === index ? newDate : x))],
            }));
        },
        handleRemoveDateClick: (index: number) => {
            return function (e: MouseEvent<HTMLButtonElement>) {
                setDates((prev) => {
                    const newValue = {
                        number: prev.number - 1,
                        dates: [...prev.dates.filter((_x, index) => index !== index)],
                    };
                    console.log({ prev, newValue });
                    return newValue;
                });
            };
        },
    };
    // trigger update date on parentEvent Change
    useEffect(() => {
        if (parentEvent.data) {
            EventHandlers.handleDateChange(0, dayjs(parentEvent.data.date));
        }
    }, [parentEvent]); //eslint-disable-line react-hooks/exhaustive-deps

    function printVariables() {
        console.log({ dates });
        console.log({ parentEvent });
        console.log({
            isRepeatable: isRepeatable[props.eventType],
            isFixedDate: isFixedDate[props.eventType],
            fixedDate: fixedDate[props.eventType],
        });
    }
    //########################################
    //#region Configuration
    const isRepeatable: {
        [key in TimelineEvent.singleEventType]: boolean;
    } = {
        Invites: true,
        Post: true,
        Video: true,
        WebinarSpeaker: false,
    };
    const isFixedDate: {
        [key in TimelineEvent.singleEventType]: boolean;
    } = {
        Invites: false,
        Post: false,
        Video: false,
        WebinarSpeaker: true,
    };
    const fixedDate: {
        [key in TimelineEvent.singleEventType]: Dayjs | null;
    } = {
        Invites: null,
        Post: null,
        Video: null,
        WebinarSpeaker: parentEvent.data ? dayjs(parentEvent.data.date) : null,
    };
    const hasParentEvent: {
        [key in TimelineEvent.singleEventType]:
            | { parentEventType: TimelineEvent.multiEventType }
            | false;
    } = {
        Invites: false,
        Post: false,
        Video: false,
        WebinarSpeaker: { parentEventType: "Webinar" },
    };
    //#endregion
    //########################################

    return (
        <>
            {/*  */}
            {/* <Button onClick={printVariables}>Print Variables</Button> */}
            <DialogContent
                dividers
                sx={{ "& .MuiFormControl-root": { flexBasis: "100%", flex: 1 } }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                    <div style={{ flexBasis: "100%" }}>
                        {dates.dates.map((date, index) => {
                            return (
                                <div key={`dumb${index}`} className={styles.cellActionSplit}>
                                    <DatePicker
                                        key={`date${index}`}
                                        disabled={isFixedDate[props.eventType]}
                                        // closeOnSelect={false}
                                        label="Termin"
                                        name="date"
                                        value={isFixedDate ? fixedDate[props.eventType] : date}
                                        onChange={(value) => {
                                            console.log("onChange", value?.toString());
                                            EventHandlers.handleDateChange(index, value);
                                        }}
                                        maxDate={dayjs().add(5000, "year")}
                                        minDate={dayjs()}
                                        onError={(error) => {
                                            console.log({ error });
                                        }}
                                        slotProps={{
                                            textField: {
                                                required: true,
                                                variant: "standard",
                                            },
                                        }}
                                    />
                                    {dates.number > 1 && (
                                        <Button
                                            key={`removeButton${index}`}
                                            onClick={EventHandlers.handleRemoveDateClick(index)}
                                        >
                                            <DeleteIcon />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {isRepeatable[props.eventType] && !isEditing && (
                        <Button
                            key={"Add"}
                            aria-label="Add"
                            onClick={EventHandlers.handleAddDateClick}
                            color="primary"
                            style={{ alignSelf: "flex-start" }}
                            variant="outlined"
                        >
                            <AddIcon />
                            An weiterem Termin wiederholen
                        </Button>
                    )}

                    {/* <TimePicker name="time" /> */}
                </LocalizationProvider>
                <ParentEventSelector
                    parentEventType={hasParentEvent[props.eventType]}
                    timelineEvent={timelineEvent}
                    setTimelineEvent={setTimelineEvent}
                />
            </DialogContent>
        </>
    );
}

interface ParentEventSelectorProps {
    parentEventType: { parentEventType: TimelineEvent.multiEventType } | false;
    timelineEvent: PartialWith<TimelineEvent.Event, "relatedEvents" | "campaign">;
    setTimelineEvent: DateSelectorProps["setTimelineEvent"];
}
function ParentEventSelector(props: ParentEventSelectorProps) {
    const { timelineEvent, setTimelineEvent } = props;
    const { id: campaignId } = timelineEvent.campaign;

    const parentEventType = props.parentEventType ? props.parentEventType.parentEventType : null;

    //########################################
    //#region Queries
    const events = useQuery({
        queryKey: ["events"],
        queryFn: async () => {
            const events = await dataClient.timelineEvent.byCampaign(campaignId);
            return events;
        },
    });

    const parentEventChoices = useMemo(() => {
        return (
            events.data?.filter((event) => parentEventType && event.type === parentEventType) ?? []
        );
    }, [events.data, parentEventType]);
    //#endregion
    //########################################

    const EntryName: { [key in TimelineEvent.multiEventType]: (id: string) => string } = {
        Webinar: (id) => {
            const event = parentEventChoices.find((x) => x.id === id);
            return event?.info?.topic ?? "Webinar";
        },
    };

    const NoParentsText: { [key in TimelineEvent.multiEventType]: string } = {
        Webinar: "Keine Webinare gefunden",
    };

    const Handler = {
        onParentEventChange: (e: SelectChangeEvent<unknown>) => {
            const value = e.target.value;
            const selectedEvent = parentEventChoices.find((event) => event.id === value);
            if (!selectedEvent) return;
            setTimelineEvent((prev) => ({
                ...prev,
                relatedEvents: {
                    parentEvent: selectedEvent,
                    childEvents: prev.relatedEvents.childEvents,
                },
            }));
        },
    };

    if (!parentEventType) return null;
    if (!parentEventChoices || parentEventChoices.length < 1)
        return (
            <Typography
                sx={{
                    width: "100%",
                    backgroundColor: "red",
                    textAlign: "center",
                }}
            >
                {NoParentsText[parentEventType]}
            </Typography>
        );

    return (
        <TextField
            name="parentEvent"
            select
            required
            SelectProps={{
                onChange: Handler.onParentEventChange,
                value: timelineEvent.relatedEvents.parentEvent ?? null,
            }}
        ></TextField>
    );
}
