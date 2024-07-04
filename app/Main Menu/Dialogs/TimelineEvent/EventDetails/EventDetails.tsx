import { Prettify } from "@/app/Definitions/types";
import { Event, Events } from "@/app/ServerFunctions/types";
import { Box, Button, DialogContent, SxProps, TextField, Tooltip } from "@mui/material";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { dayjs, Dayjs } from "@/app/utils";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AudienceTargetFilter from "./AudienceTargetFilter";
import TextFieldWithTooltip from "../../Components/TextFieldWithTooltip";

//#region Definitions
type relevantDetails = Prettify<
    Pick<Event, "eventTitle" | "eventTaskAmount" | "eventAssignmentAmount"> & Events.EventInfo
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
          tooltipTitle?: string;
      }
    | {
          enabled: false;
      };
type DetailsConfig = {
    [key in relevantDetailsKey]?: DetailsConfigEntry;
};

const EventTypeConfig: { [key in Events.eventType]: DetailsConfig } = {
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
            tooltipTitle: "Wie viele Einladungen sollen an jedem Termin verschickt werden?",
        },
        eventLink: {
            enabled: false,
        },
        eventPostContent: {
            enabled: false,
        },
    },
    Post: {
        eventTitle: {
            enabled: true,
            label: "Thema",
            type: "text",
            tooltipTitle: "Worum soll es in dem Post gehen?",
        },
        topic: {
            enabled: false,
            // label: "Thema",
            // type: "text",
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
            tooltipTitle: "Bis wann muss der Entwurf eingereicht werden?",
        },
        instructions: {
            enabled: true,
            label: "Anweisungen",
            type: "textarea",
            tooltipTitle: "Zusätzliche Anweisungen",
        },
        maxDuration: {
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
            tooltipTitle: "Worum soll es in dem Video gehen?",
        },
        charLimit: {
            enabled: false,
        },
        maxDuration: {
            enabled: true,
            label: "Maximale Dauer",
            type: "number",
            endAdornment: "Minuten",
        },
        eventTitle: {
            enabled: false,
        },
        eventTaskAmount: { enabled: false },
        draftDeadline: {
            enabled: true,
            label: "Deadline",
            type: "date",
            tooltipTitle: "Bis wann muss die Aufnahme eingereicht werden?",
        },
        instructions: {
            enabled: true,
            label: "Anweisungen",
            type: "textarea",
            tooltipTitle: "Zusätzliche Anweisungen",
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
            label: "Thema",
            type: "text",
            tooltipTitle: "Worüber soll der influencer sprechen?",
        },
        topic: {
            enabled: false,
            // label: "Thema",
            // type: "text",
        },
        charLimit: {
            enabled: false,
        },
        draftDeadline: {
            enabled: false,
            // label: "Deadline",
            // type: "date",
            // tooltipTitle: "Bis wann muss der Entwurf für den Vortrag eingereicht werden?",
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
            tooltipTitle: "Zusätzliche Anweisungen",
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
            tooltipTitle: "Worum soll es in dem Webinar gehen?",
        },
        eventAssignmentAmount: {
            enabled: true,
            type: "number",
            label: "Anzahl Speaker",
            minValue: 0,
            defaultValue: 0,
            tooltipTitle: "Wie viele unserer Influencer sollen live am Webinar teilnehmen?",
        },
        eventLink: {
            enabled: true,
            type: "text",
            label: "Link",
            tooltipTitle: "Link zur Webinar-Eventpage",
        },
    },
    ImpulsVideo: {
        eventTitle: {
            enabled: true,
            label: "Thema",
            type: "text",
            tooltipTitle: "Worum soll es in dem Impuls-Video gehen?",
        },
        topic: {
            enabled: false,
            // label: "Thema",
            // type: "text",
        },
        charLimit: {
            enabled: false,
        },
        draftDeadline: {
            enabled: true,
            label: "Deadline",
            type: "date",
            tooltipTitle: "Bis wann muss die Aufnahme eingereicht werden?",
        },
        maxDuration: {
            enabled: true,
            label: "Maximale Dauer",
            type: "number",
            endAdornment: "Min",
        },
        eventTaskAmount: { enabled: false },
        instructions: {
            enabled: true,
            label: "Anweisungen",
            type: "textarea",
            tooltipTitle: "Zusätzliche Anweisungen",
        },
        eventLink: {
            enabled: false,
        },
        eventPostContent: {
            enabled: false,
        },
    },
};
interface AdditionalFieldsProps {
    event: Partial<Event>;
    updatedData: Partial<Event>[];
    onChange: (data: Partial<Event>[]) => void;
}
const AdditionalFields: {
    [key in Events.eventType]?: (props: AdditionalFieldsProps) => JSX.Element;
} = {
    Webinar: (props) => <AudienceTargetFilter {...props} />,
};

function getDataKey(
    key: relevantDetailsKey,
    data: Partial<Event>,
    updatedData: Partial<Event>,
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

//#endregion Definitions

//MARK: - Component
interface DetailsProps {
    applyDetailsChange: (data: Partial<Event>[]) => void;
    data: Partial<Event>;
    isEditing?: boolean;
    updatedData: Partial<Event>[];
    setUpdatedData: Dispatch<SetStateAction<DetailsProps["updatedData"]>>;
}
export default function EventDetails(props: DetailsProps): JSX.Element {
    const { applyDetailsChange, data, isEditing = false, setUpdatedData, updatedData } = props;

    function handleChange(key: relevantDetailsKey, value: string | number | Dayjs) {
        const oldData = updatedData;
        const handler = setUpdatedData;
        // debugger;
        switch (key) {
            case "eventAssignmentAmount":
            case "eventTitle":
            case "eventTaskAmount": {
                const newData = oldData.map((event) => {
                    return { ...event, [key]: value };
                });
                handler(newData);
                break;
            }
            case "topic":
            case "charLimit":
            case "draftDeadline":
            case "instructions":
            case "maxDuration":
            case "eventLink": {
                const newData = oldData.map((event) => {
                    return {
                        ...event,
                        info: {
                            ...event.info,
                            [key]: value,
                        },
                    };
                });
                handler(newData);
                break;
            }
        }
    }
    const ChangeHandler = {
        handleEventChange: (newData: Partial<Event>[]) => {
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
            "input[type=number]": {
                textAlign: "right",
            },
        },
    };
    function printData() {
        console.log({ data, updatedData });
        Object.keys(data).map((key) => {
            console.log({ key, value: data[key as keyof typeof data] });
            console.log(getDataKey(key as relevantDetailsKey, data, updatedData[0]));
            console.log("----------");
        });
    }
    if (!data.type) return <></>;
    return (
        <DialogContent
            dividers
            sx={sxProps}
        >
            {/* <Button onClick={printData}>Print Data</Button> */}
            {Object.entries(EventTypeConfig[data.type]).map(([key, config]) => {
                const keyName = key as relevantDetailsKey;
                const value = getDataKey(keyName, data, updatedData[0]);
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
                event: { ...data, ...updatedData[0] },
                updatedData,
                onChange: ChangeHandler.handleEventChange,
            }) ?? <></>}
        </DialogContent>
    );
}

//MARK: - Event Detail Field
interface EventDetailFieldProps {
    id: string;
    event: Partial<Event>;
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
                <TextFieldWithTooltip
                    id={id}
                    name={name.toString()}
                    label={label}
                    value={(value as string) ?? ""}
                    onChange={(e) => {
                        changeHandler(e.target.value);
                    }}
                    variant="standard"
                    tooltipProps={{
                        title: config.tooltipTitle ?? "",
                    }}
                />
            );
        case "number":
            return (
                <TextFieldWithTooltip
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
                        startAdornment: config.startAdornment,
                        endAdornment: config.endAdornment,
                    }}
                    onChange={(e) => changeHandler(Number(e.target.value))}
                    variant="standard"
                    tooltipProps={{
                        title: config.tooltipTitle ?? "",
                    }}
                />
            );
        case "date":
            return (
                <Tooltip
                    title={config.tooltipTitle ?? ""}
                    placement="top-start"
                >
                    <Box
                        sx={{
                            "&": {
                                height: "2ch",
                                padding: 0,
                            },
                        }}
                    >
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="de"
                        >
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
                    </Box>
                </Tooltip>
            );
        case "textarea":
            return (
                <TextFieldWithTooltip
                    id={id}
                    name={name.toString()}
                    label={label}
                    value={(value as string) ?? ""}
                    onChange={(e) => changeHandler(e.target.value)}
                    fullWidth
                    multiline
                    variant="standard"
                    tooltipProps={{
                        title: config.tooltipTitle ?? "",
                    }}
                />
            );
    }

    return <></>;
}
