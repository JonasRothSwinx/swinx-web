import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { Button, DialogContent } from "@mui/material";
import dayjs, { Dayjs } from "@/app/configuredDayJs";
import { Add as AddIcon, DeleteOutlined as DeleteIcon } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dispatch, MouseEvent, SetStateAction, useEffect } from "react";
import { dates, styles } from "./SingleEvent/TimelineEventSingleDialog";
import { PartialWith } from "@/app/Definitions/types";
import { useQuery } from "@tanstack/react-query";

interface DateSelectorProps {
    timelineEvent: PartialWith<TimelineEvent.Event, "id" | "date">;
    isEditing: boolean;
    eventType: TimelineEvent.singleEventType;
    dates: dates;
    setDates: Dispatch<SetStateAction<dates>>;
}
export function DateSelector(props: DateSelectorProps) {
    const { dates, setDates, isEditing, timelineEvent } = props;

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
    function printVariables() {
        console.log({ dates });
        console.log({ parentEvent });
        console.log({
            isRepeatable: isRepeatable[props.eventType],
            isFixedDate: isFixedDate[props.eventType],
            fixedDate: fixedDate[props.eventType],
        });
    }

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
            </DialogContent>
        </>
    );
}
