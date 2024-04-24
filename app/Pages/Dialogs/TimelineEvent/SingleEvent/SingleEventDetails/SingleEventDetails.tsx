import { Prettify } from "@/app/Definitions/types";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { Button, DialogContent, SxProps, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface DetailsProps {
    applyDetailsChange: (data: Partial<TimelineEvent.SingleEvent>) => void;
    data: Prettify<
        //optional properties
        Partial<Pick<TimelineEvent.SingleEvent, "eventTitle" | "info" | "eventTaskAmount" | "type" | "relatedEvents">>
    >;
    isEditing?: boolean;
    updatedData: Prettify<Partial<TimelineEvent.SingleEvent>>;
    setUpdatedData: Dispatch<SetStateAction<Partial<TimelineEvent.SingleEvent>>>;
}
type relevantDetails = Prettify<
    Pick<TimelineEvent.SingleEvent, "eventTitle" | "eventTaskAmount"> & TimelineEvent.EventInfo
>;
type relevantDetailsKey = Prettify<keyof relevantDetails>;
type DetailsConfigEntry =
    | {
          enabled: true;
          label: string;
          type: "text" | "number" | "date" | "textarea";
          startAdornment?: string;
          endAdornment?: string;
      }
    | {
          enabled: false;
      };
type DetailsConfig = {
    [key in relevantDetailsKey]: DetailsConfigEntry;
};

const EventTypeConfig: { [key in TimelineEvent.singleEventType]: DetailsConfig } = {
    Invites: {
        topic: {
            enabled: false,
        },
        charLimit: {
            enabled: false,
        },
        draftDeadline: {
            enabled: false,
        },
        instructions: {
            enabled: false,
        },
        maxDuration: {
            enabled: false,
        },
        eventTitle: {
            enabled: false,
        },
        eventTaskAmount: {
            enabled: true,
            label: "Invites",
            type: "number",
        },
        eventLink: {
            enabled: false,
        },
        eventPostContent: {
            enabled: false,
        },
    },
    Post: {
        topic: {
            enabled: true,
            label: "Thema",
            type: "text",
        },
        charLimit: {
            enabled: true,
            label: "Zeichenlimit",
            type: "number",
        },
        draftDeadline: {
            enabled: true,
            label: "Deadline",
            type: "date",
        },
        instructions: {
            enabled: true,
            label: "Anweisungen",
            type: "textarea",
        },
        maxDuration: {
            enabled: false,
        },
        eventTitle: {
            enabled: false,
        },
        eventTaskAmount: { enabled: false },
        eventLink: {
            enabled: false,
        },
        eventPostContent: {
            enabled: false,
        },
    },
    Video: {
        topic: {
            enabled: true,
            label: "Thema",
            type: "text",
        },
        charLimit: {
            enabled: false,
        },
        maxDuration: {
            enabled: true,
            label: "Maximale Dauer",
            type: "number",
        },
        eventTitle: {
            enabled: false,
        },
        eventTaskAmount: { enabled: false },
        draftDeadline: {
            enabled: true,
            label: "Deadline",
            type: "date",
        },
        instructions: {
            enabled: true,
            label: "Anweisungen",
            type: "textarea",
        },
        eventLink: {
            enabled: false,
        },
        eventPostContent: {
            enabled: false,
        },
    },
    WebinarSpeaker: {
        eventTitle: {
            enabled: true,
            label: "Titel",
            type: "text",
        },
        topic: {
            enabled: true,
            label: "Thema",
            type: "text",
        },
        charLimit: {
            enabled: false,
        },
        draftDeadline: {
            enabled: true,
            label: "Deadline",
            type: "date",
        },
        maxDuration: {
            enabled: true,
            label: "Maximale Dauer",
            type: "number",
        },
        eventTaskAmount: { enabled: false },
        instructions: {
            enabled: true,
            label: "Anweisungen",
            type: "textarea",
        },
        eventLink: {
            enabled: false,
        },
        eventPostContent: {
            enabled: false,
        },
    },
};

function getDataKey(
    key: relevantDetailsKey,
    data: Partial<TimelineEvent.SingleEvent>,
    updatedData: Partial<TimelineEvent.SingleEvent>
): string | number | null | undefined {
    switch (key) {
        case "topic":
            return updatedData.info?.topic ?? data.info?.topic;
        case "charLimit":
            return updatedData.info?.charLimit ?? data.info?.charLimit;
        case "maxDuration":
            return updatedData.info?.maxDuration ?? data.info?.maxDuration;
        case "eventTitle":
            return updatedData.eventTitle ?? data.eventTitle;
        case "eventTaskAmount":
            return updatedData.eventTaskAmount ?? data.eventTaskAmount;
        case "draftDeadline":
            return updatedData.info?.draftDeadline ?? data.info?.draftDeadline;
        case "instructions":
            return updatedData.info?.instructions ?? data.info?.instructions;
    }
}

export default function SingleEventDetails(props: DetailsProps): JSX.Element {
    const { applyDetailsChange, data, isEditing = false, setUpdatedData, updatedData } = props;

    function handleChange(key: relevantDetailsKey, value: string | number | Dayjs) {
        const oldData = isEditing ? updatedData : data;
        const handler = isEditing ? setUpdatedData : applyDetailsChange;
        switch (key) {
            case "eventTitle":
            case "eventTaskAmount": {
                const newData = { ...oldData, [key]: value };
                handler(newData);
                break;
            }
            case "topic":
            case "charLimit":
            case "draftDeadline":
            case "instructions":
            case "maxDuration": {
                const newData = { ...oldData, info: { ...oldData.info, [key]: value } };
                handler(newData);
                break;
            }
        }
    }
    // const ChangeHandler: {
    //     [key in keyof relevantDetails]: (value: string | number | Dayjs) => void;
    // } = {
    //     topic: (value) => {
    //         if (!(typeof value === "string")) return;

    //         applyDetailsChange({ info: { ...data.info, topic: value } });
    //     },
    //     charLimit: (value) => {
    //         if (!(typeof value === "number")) return;
    //         applyDetailsChange({ info: { ...data.info, charLimit: value } });
    //     },
    //     maxDuration: (value) => {
    //         if (!(typeof value === "number")) return;
    //         applyDetailsChange({ info: { ...data.info, maxDuration: value } });
    //     },
    //     eventTitle: (value) => {
    //         if (!(typeof value === "string")) return;
    //         applyDetailsChange({ eventTitle: value });
    //     },
    //     eventTaskAmount: (value) => {
    //         if (!(typeof value === "number")) return;
    //         applyDetailsChange({ eventTaskAmount: value });
    //     },
    //     draftDeadline: (value) => {
    //         if (!(typeof value === "string")) return;
    //         applyDetailsChange({ info: { ...data.info, draftDeadline: value } });
    //     },
    //     instructions: (value) => {
    //         if (!(typeof value === "string")) return;
    //         applyDetailsChange({ info: { ...data.info, instructions: value } });
    //     },
    // };
    // const PropertyValue: { [key in relevantDetailsKey]: string | number | undefined | null } = useMemo(() => {
    //     console.log("Updating in usememo", data);
    //     return {
    //         topic: updatedData.info?.topic ?? data.info?.topic,
    //         charLimit: updatedData.info?.charLimit ?? data.info?.charLimit,
    //         maxDuration: updatedData.info?.maxDuration ?? data.info?.maxDuration,
    //         eventTitle: updatedData.eventTitle ?? data.eventTitle,
    //         eventTaskAmount: updatedData.eventTaskAmount ?? data.eventTaskAmount,
    //         draftDeadline: updatedData.info?.draftDeadline ?? data.info?.draftDeadline,
    //         instructions: updatedData.info?.instructions ?? data.info?.instructions,
    //     };
    // }, [data, updatedData]);
    const fullWidthFields: (keyof relevantDetails)[] = ["topic", "instructions"];
    const sxTest: Record<string, Record<string, string> | string> = { test: "test" };
    fullWidthFields.map((field) => {
        const selector = `& .MuiTextField-root:has(*[name=${field}])`;
        sxTest[selector] = {
            flexBasis: "100%",
        };
    });
    const sxProps = sxTest as SxProps;
    function printData() {
        console.log({ data, updatedData });
        Object.keys(data).map((key) => {
            console.log({ key, value: data[key as keyof typeof data] });
            console.log(getDataKey(key as relevantDetailsKey, data, updatedData));
            console.log("----------");
        });
    }
    if (!data.type) return <></>;
    return (
        <DialogContent dividers sx={sxProps}>
            <Button onClick={printData}>Print Data</Button>
            {Object.entries(EventTypeConfig[data.type]).map(([key, config]) => {
                const keyName = key as relevantDetailsKey;
                const value = getDataKey(keyName, data, updatedData);
                // console.log({ keyName, value });
                return (
                    <EventDetailField
                        key={key}
                        name={keyName}
                        event={data}
                        value={value}
                        config={config}
                        changeHandler={(value) => handleChange(keyName, value)}
                    />
                );
            })}
        </DialogContent>
    );
}
interface EventDetailFieldProps {
    event: Partial<TimelineEvent.SingleEvent>;
    name: keyof relevantDetails;
    value: string | number | null | undefined;
    config: DetailsConfigEntry;
    changeHandler: (value: string | number) => void;
}
function EventDetailField(props: EventDetailFieldProps): JSX.Element {
    const { event, name, value, config, changeHandler } = props;
    if (!config.enabled) return <></>;
    const { label, type } = config;
    switch (type) {
        case "text":
            return (
                <TextField
                    name={name}
                    label={label}
                    value={(value as string) ?? ""}
                    onChange={(e) => changeHandler(e.target.value)}
                    variant="standard"
                />
            );
        case "number":
            return (
                <TextField
                    name={name}
                    type="number"
                    label={label}
                    value={(value as number) ?? 0}
                    InputProps={{ inputProps: { min: 0 } }}
                    onChange={(e) => changeHandler(Number(e.target.value))}
                    variant="standard"
                />
            );
        case "date":
            return (
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                    <DatePicker
                        // closeOnSelect={false}
                        label={label}
                        name={name}
                        value={value ? dayjs(value as string) : null}
                        onChange={(value) => {
                            changeHandler(value?.toISOString() ?? "");
                        }}
                        // maxDate={event.date ? dayjs(event.date) : null}
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
                </LocalizationProvider>
            );
        case "textarea":
            return (
                <TextField
                    name={name}
                    label={label}
                    value={(value as string) ?? ""}
                    onChange={(e) => changeHandler(e.target.value)}
                    fullWidth
                    multiline
                    variant="standard"
                />
            );
    }

    return <></>;
}
