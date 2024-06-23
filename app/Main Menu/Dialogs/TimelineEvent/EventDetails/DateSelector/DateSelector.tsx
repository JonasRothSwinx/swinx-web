import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";
import {
    Box,
    Button,
    DialogContent,
    MenuItem,
    SelectChangeEvent,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import { Add as AddIcon, DeleteOutlined as DeleteIcon } from "@mui/icons-material";
import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { Dispatch, MouseEvent, SetStateAction, useEffect, useMemo } from "react";
import { dates, styles } from "../../TimelineEventDialog";
import { PartialWith } from "@/app/Definitions/types";
import { useQuery } from "@tanstack/react-query";
import dataClient from "@/app/ServerFunctions/database";
import { EventType } from "@aws-sdk/client-sesv2";
import TextFieldWithTooltip from "../../../Components/TextFieldWithTooltip";
import { Date, DateProps, ParentEventSelector } from "./Components";
import { getFixedDate, hasParentEvent, isFixedDate, isRepeatable } from "./config";

//#region config

//#endregion
export interface DateSelectorProps {
    timelineEvent: PartialWith<TimelineEvent.Event, "parentEvent" | "childEvents" | "campaign">;
    setTimelineEvent: Dispatch<SetStateAction<DateSelectorProps["timelineEvent"]>>;
    isEditing: boolean;
    eventType?: TimelineEvent.eventType;
    updatedData: Partial<TimelineEvent.Event>[];
    setUpdatedData: Dispatch<SetStateAction<DateSelectorProps["updatedData"]>>;
}
export default function DateSelector({
    updatedData,
    isEditing,
    timelineEvent,
    setTimelineEvent,
    setUpdatedData,
    eventType,
}: DateSelectorProps) {
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
            const lastDate = updatedData[updatedData.length - 1].date ?? dayjs().toISOString();
            const newEvent = { ...timelineEvent };
            const newDate = dayjs(lastDate).add(7, "day").toISOString();
            setUpdatedData((prev) => [...prev, { ...newEvent, date: newDate }]);
        },
        handleDateChange: (index: number, newDate: Dayjs | null) => {
            console.log("handleDateChange", index, newDate?.toString());
            if (!newDate) return;
            setUpdatedData((prev) => {
                const newValue = [...prev];
                newValue[index] = { ...newValue[index], date: newDate.toISOString() };
                return newValue;
            });
        },
        handleRemoveDateClick: (index: number) => {
            return function (e: MouseEvent<HTMLButtonElement>) {
                setUpdatedData((prev) => {
                    const newValue = [...prev.filter((_x, i) => i !== index)];
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
    if (!eventType) return null;
    function printVariables() {
        console.log({ updatedData });
        console.log({ parentEvent });
        if (!eventType) return;
        console.log({
            isRepeatable: isRepeatable[eventType],
            isFixedDate: isFixedDate[eventType],
            fixedDate: getFixedDate[eventType],
        });
    }

    return (
        <>
            {/*  */}
            <Button onClick={printVariables}>Print Variables</Button>
            <DialogContent
                dividers
                sx={{ "& .MuiFormControl-root": { flexBasis: "100%", flex: 1 } }}
            >
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="de"
                >
                    <Box style={{ flexBasis: "100%" }}>
                        {updatedData.map((event, index) => {
                            // if (!event.date) return null;
                            const updatedEvent: DateSelectorProps["timelineEvent"] = {
                                ...timelineEvent,
                                ...event,
                            };
                            const date = updatedEvent.date ? dayjs(updatedEvent.date) : null;
                            return (
                                <Date
                                    key={index}
                                    {...({
                                        date,
                                        handleDateChange: EventHandlers.handleDateChange,
                                        index,
                                        isEditing,
                                        isFixedDate: isFixedDate[eventType],
                                        fixedDate: getFixedDate[eventType]({
                                            parentEvent: parentEvent.data ?? null,
                                        }),
                                        showDeleteButton: !isEditing && updatedData.length > 1,
                                        removeDate: EventHandlers.handleRemoveDateClick,
                                        parentEvent: parentEvent.data ?? null,
                                    } satisfies DateProps)}
                                />
                            );
                        })}
                    </Box>
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
                    setUpdatedData={setUpdatedData}
                />
            </DialogContent>
        </>
    );
}
