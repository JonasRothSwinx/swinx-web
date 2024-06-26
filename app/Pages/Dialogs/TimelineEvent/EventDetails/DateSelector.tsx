import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";
import {
    Button,
    DialogContent,
    MenuItem,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import { Add as AddIcon, DeleteOutlined as DeleteIcon } from "@mui/icons-material";
import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { Dispatch, MouseEvent, SetStateAction, useEffect, useMemo } from "react";
import { dates, styles } from "../TimelineEventDialog";
import { PartialWith } from "@/app/Definitions/types";
import { useQuery } from "@tanstack/react-query";
import dataClient from "@/app/ServerFunctions/database";
import { EventType } from "@aws-sdk/client-sesv2";

//#region config
const isRepeatable: {
    [key in TimelineEvent.eventType | "none"]: boolean;
} = {
    none: false,

    Invites: true,
    Post: false,
    Video: false,
    WebinarSpeaker: false,

    Webinar: false,
};
const isFixedDate: {
    [key in TimelineEvent.eventType | "none"]: boolean;
} = {
    none: false,

    Invites: false,
    Post: false,
    Video: false,
    WebinarSpeaker: true,

    Webinar: false,
};
//#endregion
interface DateSelectorProps {
    timelineEvent: PartialWith<TimelineEvent.Event, "parentEvent" | "childEvents" | "campaign">;
    setTimelineEvent: Dispatch<SetStateAction<DateSelectorProps["timelineEvent"]>>;
    isEditing: boolean;
    eventType?: TimelineEvent.eventType;
    dates: dates;
    setDates: Dispatch<SetStateAction<dates>>;
}
export function DateSelector(props: DateSelectorProps) {
    const {
        dates,
        setDates,
        isEditing,
        timelineEvent,
        setTimelineEvent,
        eventType = "none",
    } = props;

    // if (TimelineEvent.isEventReference(timelineEvent)) {
    //     //TODO resolve EventReference
    //     throw new Error("EventReference not implemented in DateSelector");
    // }

    const parentEvent = useQuery({
        queryKey: ["timelineEvent", timelineEvent.parentEvent?.id],
        queryFn: () => {
            const parentId = timelineEvent.parentEvent?.id;
            if (!parentId) return null;
            return dataClient.timelineEvent.get(parentId);
        },
    });

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
    // useEffect(() => {
    //     console.log("parentEvent.data", parentEvent.data);
    //     if (parentEvent.data) {
    //         EventHandlers.handleDateChange(0, dayjs(parentEvent.data.date));
    //     }
    // }, [parentEvent.data]); //eslint-disable-line react-hooks/exhaustive-deps

    function printVariables() {
        console.log({ dates });
        console.log({ parentEvent });
        console.log({
            isRepeatable: isRepeatable[eventType],
            isFixedDate: isFixedDate[eventType],
            fixedDate: fixedDate[eventType],
        });
    }
    //########################################
    //#region Configuration

    const fixedDate: {
        [key in TimelineEvent.eventType | "none"]: () => Dayjs | null;
    } = {
        none: () => null,

        Invites: () => null,
        Post: () => null,
        Video: () => null,
        WebinarSpeaker: () => (parentEvent.data ? dayjs(parentEvent.data.date) : null),

        Webinar: () => null,
    };
    const hasParentEvent: {
        [key in TimelineEvent.eventType | "none"]:
            | { parentEventType: TimelineEvent.multiEventType }
            | false;
    } = {
        none: false,

        Invites: { parentEventType: "Webinar" },
        Post: { parentEventType: "Webinar" },
        Video: { parentEventType: "Webinar" },
        WebinarSpeaker: { parentEventType: "Webinar" },

        Webinar: false,
    };
    //#endregion
    //########################################

    return (
        <>
            {/*  */}
            <Button onClick={printVariables}>Print Variables</Button>
            <DialogContent
                dividers
                sx={{ "& .MuiFormControl-root": { flexBasis: "100%", flex: 1 } }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                    <div style={{ flexBasis: "100%" }}>
                        {dates.dates.map((date, index) => {
                            return (
                                <Date
                                    key={index}
                                    {...({
                                        date,
                                        handleDateChange: EventHandlers.handleDateChange,
                                        index,
                                        isEditing,
                                        isFixedDate: isFixedDate[eventType],
                                        fixedDate: fixedDate[eventType](),
                                        showDeleteButton: !isEditing && dates.number > 1,
                                        removeDate: EventHandlers.handleRemoveDateClick,
                                        parentEvent: parentEvent.data ?? null,
                                    } satisfies DateProps)}
                                />
                            );
                        })}
                    </div>
                    {isRepeatable[eventType] && !isEditing && (
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
                    parentEventType={hasParentEvent[eventType]}
                    timelineEvent={timelineEvent}
                    setTimelineEvent={setTimelineEvent}
                    setDates={setDates}
                />
            </DialogContent>
        </>
    );
}
interface DateProps {
    date: Dayjs | null;
    index: number;
    handleDateChange: (index: number, newDate: Dayjs | null) => void;
    isEditing: boolean;
    isFixedDate: boolean;
    fixedDate: Dayjs | null;
    showDeleteButton?: boolean;
    removeDate: (index: number) => void;
    parentEvent: TimelineEvent.Event | null;
}
function Date(props: DateProps) {
    const {
        date,
        index,
        handleDateChange,
        isEditing,
        isFixedDate,
        fixedDate,
        showDeleteButton,
        removeDate,
        parentEvent,
    } = props;
    const value = useMemo(() => {
        if (isEditing) return date;
        if (isFixedDate) return fixedDate;
        return date;
    }, [date, fixedDate, isEditing, isFixedDate]);

    const maxDate = useMemo(() => {
        if (parentEvent) return dayjs(parentEvent.date);
        return dayjs().add(5000, "year");
    }, [parentEvent]);
    const minDate = useMemo(() => {
        return dayjs();
    }, []);
    return (
        <div className={styles.cellActionSplit}>
            <DateTimePicker
                disabled={isFixedDate}
                // closeOnSelect={false}
                label="Termin"
                name="date"
                value={value}
                onChange={(value) => {
                    console.log("onChange", value?.toString());
                    handleDateChange(index, value);
                }}
                maxDate={maxDate}
                minDate={minDate}
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
            {showDeleteButton && (
                <Button key={`removeButton${index}`} onClick={() => removeDate(index)}>
                    <DeleteIcon />
                </Button>
            )}
        </div>
    );
}

//MARK: ParentEventSelector
interface ParentEventSelectorProps {
    parentEventType: { parentEventType: TimelineEvent.multiEventType } | false;
    timelineEvent: PartialWith<TimelineEvent.Event, "parentEvent" | "campaign">;
    setTimelineEvent: DateSelectorProps["setTimelineEvent"];
    setDates: DateSelectorProps["setDates"];
}
function ParentEventSelector(props: ParentEventSelectorProps) {
    const { timelineEvent, setTimelineEvent, setDates } = props;
    const { id: campaignId } = timelineEvent.campaign;
    const { type: eventType } = timelineEvent;

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
            return event?.eventTitle ?? "Webinar";
        },
    };

    const NoParentsText: { [key in TimelineEvent.multiEventType]: string } = {
        Webinar: "Keine Webinare gefunden",
    };

    const Handler = {
        onParentEventChange: (e: SelectChangeEvent<unknown>) => {
            const value = e.target.value;
            const selectedEvent = parentEventChoices.find((event) => event.id === value);
            if (!selectedEvent) {
                console.log(`Event not found: ${value}`);
                console.log({ parentEventChoices });
                return;
            }
            console.log("selectedEvent", selectedEvent);
            setTimelineEvent((prev) => ({
                ...prev,
                parentEvent: selectedEvent,
            }));
            //If event type has a fixed date, set the date to the parent event date
            if (eventType && isFixedDate[eventType]) {
                setDates((prev) => ({
                    ...prev,
                    dates: prev.dates.map((x) => dayjs(selectedEvent.date)),
                }));
            }
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
                value: timelineEvent.parentEvent?.id ?? "",
            }}
        >
            {parentEventChoices.map((parentEvent) => {
                if (!parentEvent.id) return null;
                return (
                    <MenuItem key={parentEvent.id} value={parentEvent.id}>
                        {EntryName[parentEventType](parentEvent.id)}
                    </MenuItem>
                );
            })}
        </TextField>
    );
}
