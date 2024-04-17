import { Prettify } from "@/app/Definitions/types";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { DialogContent, SxProps, TextField } from "@mui/material";
import React, { useMemo, useState } from "react";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface DetailsProps {
    applyDetailsChange: (data: Partial<TimelineEvent.SingleEvent>) => void;
    data: Prettify<
        //optional properties
        Partial<
            Pick<
                TimelineEvent.SingleEvent,
                "eventTitle" | "info" | "eventTaskAmount" | "type" | "relatedEvents"
            >
        >
    >;
}
type relevantDetails = Prettify<
    Pick<TimelineEvent.SingleEvent, "eventTitle" | "eventTaskAmount"> & TimelineEvent.EventInfo
>;
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
    [key in keyof relevantDetails]: DetailsConfigEntry;
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
        eventTaskAmount: { enabled: true, label: "Invites", type: "number" },
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
    },
};

export default function SingleEventDetails(props: DetailsProps): JSX.Element {
    const { applyDetailsChange, data } = props;

    const ChangeHandler: {
        [key in keyof relevantDetails]: (value: string | number | Dayjs) => void;
    } = {
        topic: (value) => {
            if (!(typeof value === "string")) return;
            applyDetailsChange({ info: { ...data.info, topic: value } });
        },
        charLimit: (value) => {
            if (!(typeof value === "number")) return;
            applyDetailsChange({ info: { ...data.info, charLimit: value } });
        },
        maxDuration: (value) => {
            if (!(typeof value === "number")) return;
            applyDetailsChange({ info: { ...data.info, maxDuration: value } });
        },
        eventTitle: (value) => {
            if (!(typeof value === "string")) return;
            applyDetailsChange({ eventTitle: value });
        },
        eventTaskAmount: (value) => {
            if (!(typeof value === "number")) return;
            applyDetailsChange({ eventTaskAmount: value });
        },
        draftDeadline: (value) => {
            if (!(typeof value === "string")) return;
            applyDetailsChange({ info: { ...data.info, draftDeadline: value } });
        },
        instructions: (value) => {
            if (!(typeof value === "string")) return;
            applyDetailsChange({ info: { ...data.info, instructions: value } });
        },
    };
    const PropertyValue: { [key in keyof relevantDetails]: string | number | undefined | null } =
        useMemo(() => {
            return {
                topic: data.info?.topic,
                charLimit: data.info?.charLimit,
                draftDeadline: data.info?.draftDeadline,
                instructions: data.info?.instructions,
                maxDuration: data.info?.maxDuration,
                eventTitle: data.eventTitle,
                eventTaskAmount: data.eventTaskAmount,
            };
        }, [data]);
    const fullWidthFields: (keyof relevantDetails)[] = ["topic", "instructions"];
    const sxTest: Record<string, Record<string, string> | string> = { test: "test" };
    fullWidthFields.map((field) => {
        const selector = `& .MuiTextField-root:has(*[name=${field}])`;
        sxTest[selector] = {
            flexBasis: "100%",
        };
    });
    const sxProps = sxTest as SxProps;
    // const ChangeHandler: { [key in keyof TimelineEvent.EventDetails]: (value: any) => void } = {
    //     topic: (value) =>
    //         onChange((prev) => {
    //             return { ...prev, details: { ...prev.details, topic: value } };
    //         }),
    //     maxDuration: (value) => {
    //         return;
    //     },
    //     charLimit: (value) =>
    //         onChange((prev) => {
    //             return { ...prev, details: { ...prev.details, charLimit: value } };
    //         }),
    //     draftDeadline: (value) =>
    //         onChange((prev) => {
    //             return { ...prev, details: { ...prev.details, draftDeadline: value } };
    //         }),
    //     instructions: (value) =>
    //         onChange((prev) => {
    //             return { ...prev, details: { ...prev.details, instructions: value } };
    //         }),
    // };
    if (!data.type) return <></>;
    return (
        <DialogContent dividers sx={sxProps}>
            {Object.entries(EventTypeConfig[data.type]).map(([key, config]) => {
                const keyName = key as keyof relevantDetails;
                return (
                    <EventDetailField
                        key={key}
                        name={keyName}
                        event={data}
                        value={PropertyValue[keyName]}
                        config={config}
                        changeHandler={ChangeHandler[keyName]}
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
                        maxDate={event.date ? dayjs(event.date) : null}
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
