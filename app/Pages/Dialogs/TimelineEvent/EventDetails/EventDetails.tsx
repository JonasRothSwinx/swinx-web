import { Prettify } from "@/app/Definitions/types";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";
import { Button, DialogContent, SxProps, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AudienceTargetFilter from "./AudienceTargetFilter";

interface DetailsProps {
    applyDetailsChange: (data: Partial<TimelineEvent.Event>) => void;
    data: Partial<TimelineEvent.Event>;
    isEditing?: boolean;
    updatedData: Prettify<Partial<TimelineEvent.Event>>;
    setUpdatedData: Dispatch<SetStateAction<Partial<TimelineEvent.Event>>>;
}
type relevantDetails = Prettify<
    Pick<TimelineEvent.Event, "eventTitle" | "eventTaskAmount" | "eventAssignmentAmount"> &
        TimelineEvent.EventInfo
>;
type relevantDetailsKey = Prettify<keyof relevantDetails>;
type DetailsConfigEntry =
    | {
          enabled: true;
          label: string;
          type: "text" | "number" | "date" | "textarea";
          startAdornment?: string;
          endAdornment?: string;
          maxValue?: number;
          minValue?: number;
          defaultValue?: string | number;
      }
    | {
          enabled: false;
      };
type DetailsConfig = {
    [key in relevantDetailsKey]?: DetailsConfigEntry;
};

const EventTypeConfig: { [key in TimelineEvent.eventType]: DetailsConfig } = {
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
            defaultValue: 1000,
            maxValue: 1000,
            minValue: 0,
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
    Webinar: {
        eventTitle: {
            enabled: true,
            label: "Titel",
            type: "text",
        },
        eventAssignmentAmount: {
            enabled: true,
            type: "number",
            label: "Anzahl Speaker",
            minValue: 0,
            defaultValue: 0,
        },
        eventLink: {
            enabled: true,
            type: "text",
            label: "Link",
        },
    },
};
interface AdditionalFieldsProps {
    event: Partial<TimelineEvent.Event>;
    onChange: (data: Partial<TimelineEvent.Event>) => void;
}
const AdditionalFields: {
    [key in TimelineEvent.eventType]?: (props: AdditionalFieldsProps) => JSX.Element;
} = {
    Webinar: (props) => <AudienceTargetFilter {...props} />,
};

function getDataKey(
    key: relevantDetailsKey,
    data: Partial<TimelineEvent.Event>,
    updatedData: Partial<TimelineEvent.Event>,
): string | number | null | undefined {
    switch (key) {
        //in info
        case "eventLink":
        case "eventPostContent":
        case "topic":
        case "charLimit":
        case "maxDuration":
        case "draftDeadline":
        case "instructions": {
            return updatedData.info?.[key] ?? data.info?.[key];
        }

        //in flat data
        case "eventTitle":
        case "eventTaskAmount":
        case "eventAssignmentAmount": {
            return updatedData[key] ?? data[key];
        }
        default: {
            console.error(`Unknown key: ${key}`);
            return null;
        }
    }
}

export default function EventDetails(props: DetailsProps): JSX.Element {
    const { applyDetailsChange, data, isEditing = false, setUpdatedData, updatedData } = props;

    function handleChange(key: relevantDetailsKey, value: string | number | Dayjs) {
        const oldData = isEditing ? updatedData : data;
        const handler = isEditing ? setUpdatedData : applyDetailsChange;
        // debugger;
        switch (key) {
            case "eventAssignmentAmount":
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
            case "maxDuration":
            case "eventLink": {
                const newData = { ...oldData, info: { ...oldData.info, [key]: value } };
                handler(newData);
                break;
            }
        }
    }
    const ChangeHandler = {
        handleEventChange: (newData: Partial<TimelineEvent.Event>) => {
            setUpdatedData(newData);
        },
    };
    const fullWidthFields: (keyof relevantDetails)[] = ["topic", "instructions"];
    const sxTest: Record<string, Record<string, string> | string> = { test: "test" };
    fullWidthFields.map((field) => {
        const selector = `& .MuiTextField-root:has(*[name=${field.toString()}])`;
        sxTest[selector] = {
            flexBasis: "100%",
        };
    });
    const sxProps: SxProps = {
        "&": {
            ".MuiTextField-root:has(#eventTitle)": {
                width: "100%",
                flexBasis: "100%",
            },
            ".MuiTextField-root:has(#eventLink)": {
                width: "100%",
                flexBasis: "100%",
            },
        },
    };
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
            {/* <Button onClick={printData}>Print Data</Button> */}
            {Object.entries(EventTypeConfig[data.type]).map(([key, config]) => {
                const keyName = key as relevantDetailsKey;
                const value = getDataKey(keyName, data, updatedData);
                // console.log({ keyName, value });
                if (!config) return <></>;
                return (
                    <EventDetailField
                        key={key}
                        id={key}
                        name={keyName}
                        event={data}
                        value={value}
                        config={config}
                        changeHandler={(value) => handleChange(keyName, value)}
                    />
                );
            })}
            {AdditionalFields[data.type]?.({
                event: { ...data, ...updatedData },
                onChange: ChangeHandler.handleEventChange,
            }) ?? <></>}
        </DialogContent>
    );
}
interface EventDetailFieldProps {
    id: string;
    event: Partial<TimelineEvent.Event>;
    name: keyof relevantDetails;
    value: string | number | null | undefined;
    config: DetailsConfigEntry;
    changeHandler: (value: string | number) => void;
}
function EventDetailField(props: EventDetailFieldProps): JSX.Element {
    const { id, event, name, value, config, changeHandler } = props;
    if (!config.enabled) return <></>;
    const { label, type } = config;
    switch (type) {
        case "text":
            return (
                <TextField
                    id={id}
                    name={name.toString()}
                    label={label}
                    value={(value as string) ?? ""}
                    onChange={(e) => {
                        changeHandler(e.target.value);
                    }}
                    variant="standard"
                />
            );
        case "number":
            return (
                <TextField
                    id={id}
                    name={name.toString()}
                    type="number"
                    label={label}
                    value={(value as number) ?? config.defaultValue ?? 0}
                    InputProps={{
                        inputProps: {
                            min: config.minValue ?? 0,
                            max: config.maxValue ?? undefined,
                        },
                    }}
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
                        name={name.toString()}
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
                                id,
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
                    id={id}
                    name={name.toString()}
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
