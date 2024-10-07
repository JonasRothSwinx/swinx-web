import { dataClient } from "@dataClient";
import {
    Box,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    IconButton,
    MenuItem,
    Skeleton,
    SxProps,
    TextField,
    Typography,
} from "@mui/material";
import { useMutation, UseMutationResult, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { dayjs, Dayjs } from "@/app/utils";
import { EmailTriggers, Event, Events } from "@/app/ServerFunctions/types";
import { Nullable } from "@/app/Definitions/types";
import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMemo, useState } from "react";
import { CancelIcon, PrintIcon, SaveIcon } from "@/app/Definitions/Icons";
import { useConfirm } from "material-ui-confirm";
import { queryKeys } from "@/app/(main)/queryClient/keys";
import { EventHasEmailTriggers } from "./config";
import { event } from "@/app/ServerFunctions/database/dataClients/events";

interface EmailTriggerMenuProps {
    eventId: string;
    eventType: Events.EventType;
}

const emailTypeDisplayNames: {
    [key in Events.EventType]: Nullable<{
        [key in EmailTriggers.emailTriggerType]: string | null;
    }>;
} = {
    Invites: {
        actionReminder: "Erinnerung",
        deadlineReminder: null,
    },
    Post: {
        actionReminder: "Erinnerung an Veröffentlichung",
        deadlineReminder: "Deadline für Entwurf",
    },
    Video: {
        actionReminder: "Erinnerung an Video",
        deadlineReminder: "Deadline für Video",
    },
    WebinarSpeaker: {
        actionReminder: "Erinnerung",
        deadlineReminder: null,
    },
    ImpulsVideo: {
        actionReminder: "Erinnerung",
        deadlineReminder: "Entwurf",
    },
    Webinar: null,
};

export function EmailTriggerMenu({ eventId, eventType }: EmailTriggerMenuProps) {
    const queryClient = useQueryClient();
    const triggers = useQuery({
        queryKey: ["emailTriggers", eventId],
        queryFn: async () => {
            if (!EventHasEmailTriggers[eventType]) return null;
            const data = await dataClient.emailTrigger.byEvent({ id: eventId });
            console.log("Email triggers", data);

            return data;
        },
    });
    const timelineEvent = useQuery({
        enabled: EventHasEmailTriggers[eventType],
        queryKey: queryKeys.event.one(eventId),
        queryFn: async () => {
            const data = await dataClient.event.get(eventId);
            return data;
        },
    });

    const ChangeHandlers = {
        eventCompleted: useMutation({
            mutationFn: async (isCompleted: boolean) => {
                const event = timelineEvent.data;
                if (!event || !event.id) throw new Error("Event has no id");
                const updatedEvent = await dataClient.event.update({
                    id: event.id,
                    updatedData: { isCompleted },
                });
                return updatedEvent;
            },
            onMutate: async (isCompleted: boolean) => {
                if (!timelineEvent.data) return null;
                await queryClient.cancelQueries({
                    queryKey: ["timelineEvent", timelineEvent.data.id],
                });
                const previousEvent = queryClient.getQueryData<Event>(["timelineEvent", timelineEvent.data.id]);
                if (!previousEvent) return null;
                const newEvent = { ...previousEvent, isCompleted };
                queryClient.setQueryData<Event>(["timelineEvent", timelineEvent.data.id], {
                    ...newEvent,
                });
                return { previousEvent, newEvent };
            },
            onError(error, newEvent, context) {
                if (!timelineEvent.data) return;
                console.error("Error updating record", { error, newEvent, context });
                if (context?.previousEvent) {
                    queryClient.setQueryData(["timelineEvent", timelineEvent.data.id], context.previousEvent);
                }
            },
            onSettled(data, error, variables, context) {
                if (!timelineEvent.data) return;
                console.log("Mutation Settled", { data, error, variables, context }, data?.isCompleted);
                queryClient.invalidateQueries({
                    queryKey: ["timelineEvent", timelineEvent.data.id],
                });
                queryClient.invalidateQueries({
                    queryKey: ["timelineEvents"],
                });
            },
        }),
    };
    const sx: SxProps = {
        "&#EventTriggerContainer": {
            maxWidth: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            // gap: "10px",
            overflowY: "auto",
            flexGrow: 0,
            padding: "0 5px",
            maxHeight: "100%",
            "#EventCompleteCheckbox": {
                margin: "0",
                paddingInlineEnd: "10px",
            },
            "#EmailTriggerMenu": {
                display: "flex",
                flexDirection: "column",
                // border: "1px solid black",
                // borderRadius: "10px",
                height: "100%",
                maxHeight: "100%",
                maxWidth: "100%",
                gap: "10px",
                justifyContent: "flex-start",
                "#EmailTrigger": {
                    position: "relative",
                    border: "1px solid black",
                    padding: "10px",
                    borderRadius: "5px",
                    maxWidth: "100%",
                    // backgroundColor: "red",
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
            "#EmailTriggerMenuLoading": {
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                height: "100%",
                width: "100%",
                gap: "10px",
                paddingTop: "10px",
                ".MuiSkeleton-root": {
                    transform: "none",
                    width: "250px",
                    height: "100px",
                },
            },
        },
    };
    //#region Query States

    if (!EventHasEmailTriggers[eventType]) return null;
    if (triggers.isLoading)
        return (
            <Box id="EventTriggerContainer" sx={sx}>
                <Box id="EmailTriggerMenuLoading">
                    <Skeleton />
                    <Skeleton />
                </Box>
            </Box>
        );
    if (triggers.isError) return <Typography>Error</Typography>;
    if (!triggers.data) return <Typography>Keine Daten</Typography>;
    if (triggers.data.length === 0) return null;

    //#endregion
    return (
        <Box id="EventTriggerContainer" sx={sx}>
            <EventCompleteCheckbox eventId={eventId ?? "<Error>"} changeEventComplete={ChangeHandlers.eventCompleted} />
            <Box id="EmailTriggerMenu">
                {triggers.data?.map((trigger) => (
                    <EmailTrigger key={trigger.id} trigger={trigger} event={trigger.event} />
                ))}
            </Box>
        </Box>
    );
}

//MARK: EmailTrigger
interface EmailTriggerProps {
    trigger: EmailTriggers.EmailTrigger;
    event: Event;
}
function EmailTrigger(props: EmailTriggerProps) {
    const { trigger, event } = props;
    const queryClient = useQueryClient();
    const isPlaceholder = event.assignments[0]?.isPlaceholder ?? true;
    const [changedData, setChangedData] = useState<Partial<EmailTriggers.EmailTrigger>>({});
    const confirm = useConfirm();

    const EventHandler = {
        saveChanges: async () => {
            const id = trigger.id;
            if (Object.keys(changedData).length === 0 || !id) return;
            await dataClient.emailTrigger.update(changedData, { ...trigger, id });
            console.log("Saved changes", changedData);
            setChangedData({});
        },
        cancelChanges: () => {
            confirm({ description: "Änderungen verwerfen?" }).then(() => setChangedData({}));
        },
        printEvent: () => {
            console.log("#### Trigger ####");
            console.log(trigger);
            console.log("## Change Data ##");
            console.log(changedData);
        },
    };
    const ChangeHandler = {
        emailLevelChange: (emailLevel: EmailTriggers.emailLevel) => {
            if (emailLevel === trigger.emailLevelOverride) {
                delete changedData.emailLevelOverride;
                setChangedData({ ...changedData });
                return;
            }
            setChangedData((prev) => ({ ...prev, emailLevelOverride: emailLevel }));
        },
        dateChange: (date: Dayjs) => {
            const dateStr = date.toISOString();
            if (dateStr === trigger.date) {
                delete changedData.date;
                setChangedData({ ...changedData });
                return;
            }
            setChangedData((prev) => ({ ...prev, date: dateStr }));
        },
        emailBodyChange: (emailBodyOverride: string) => {
            setChangedData((prev) => ({ ...prev, emailBodyOverride }));
        },
        subjectLineChange: (subjectLineOverride: string) => {
            setChangedData((prev) => ({ ...prev, subjectLineOverride }));
        },
        ToggleActive: () => {
            const oldState = changedData.active ?? trigger.active;
            const newState = !oldState;
            if (newState === trigger.active) {
                delete changedData.active;
                setChangedData({ ...changedData });
                return;
            }
            setChangedData((prev) => ({ ...prev, active: newState }));
        },
    };
    const influencer = trigger.influencer;
    const emailLevel = changedData.emailLevelOverride ?? trigger.emailLevelOverride ?? influencer?.emailLevel ?? "new";
    const emailBodyOverride = trigger.emailBodyOverride;
    const subjectLineOverride = trigger.subjectLineOverride;
    if (isPlaceholder)
        return (
            <Box id="EmailTrigger">
                <Typography>{dayjs(trigger.date).format("DD.MM.YYYY")}</Typography>
                <Typography>{emailTypeDisplayNames[event.type]?.[trigger.type] ?? trigger.type}</Typography>
            </Box>
        );
    if (!influencer) return <Typography>Kein Influencer gefunden</Typography>;
    return (
        <Box id="EmailTrigger">
            <ButtonContainer
                saveChanges={EventHandler.saveChanges}
                cancelChanges={EventHandler.cancelChanges}
                printEvent={EventHandler.printEvent}
            />
            <Typography variant="h5">{emailTypeDisplayNames[event.type]?.[trigger.type] ?? trigger.type}</Typography>
            <TriggerDatePicker event={event} trigger={trigger} dateChange={ChangeHandler.dateChange} />
            <EmailLevelSelector emailLevel={emailLevel} onChange={ChangeHandler.emailLevelChange} />
            {/* Overwrite Email */}
            <ToggleActive isActive={changedData.active ?? trigger.active} toggle={ChangeHandler.ToggleActive} />
        </Box>
    );
}
interface TriggerDatePickerProps {
    trigger: EmailTriggers.EmailTrigger;
    event: Event;
    dateChange: (date: Dayjs) => void;
}
function TriggerDatePicker(props: TriggerDatePickerProps) {
    const { trigger, event, dateChange } = props;
    const date = dayjs(trigger.date);
    const minDate = dayjs().add(1, "day").hour(9);
    const maxDate = dayjs(event.date).subtract(1, "day").startOf("day");
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
            <DatePicker
                value={date}
                onChange={(date) => {
                    if (!date) return;
                    dateChange(date);
                }}
                minDate={minDate}
                maxDate={maxDate}
                label="Datum"
                slotProps={{
                    textField: {
                        required: true,
                        variant: "standard",
                    },
                }}
            />
        </LocalizationProvider>
    );
}

interface EmailLevelSelectorProps {
    emailLevel: EmailTriggers.emailLevel;
    onChange: (emailLevel: EmailTriggers.emailLevel) => void;
}
function EmailLevelSelector(props: EmailLevelSelectorProps) {
    const { emailLevel, onChange } = props;
    return (
        <TextField
            select
            label="Email Level"
            value={emailLevel}
            onChange={(e) => onChange(e.target.value as EmailTriggers.emailLevel)}
            variant="standard"
            slotProps={{
                select: {
                    MenuProps: {
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                        },
                        transformOrigin: {
                            vertical: "top",
                            horizontal: "left",
                        },
                    },
                },
            }}
        >
            {EmailTriggers.emailLevels.map((level) => (
                <MenuItem key={level} value={level}>
                    {level}
                </MenuItem>
            ))}
        </TextField>
    );
}
interface ButtonContainerProps {
    saveChanges: () => void;
    cancelChanges: () => void;
    printEvent: () => void;
}

function ButtonContainer(props: ButtonContainerProps) {
    const { saveChanges, cancelChanges, printEvent } = props;
    return (
        <Box id="TriggerModifyButtonContainer">
            <IconButton onClick={printEvent}>
                <PrintIcon />
            </IconButton>
            <IconButton onClick={saveChanges}>
                <SaveIcon />
            </IconButton>
            <IconButton onClick={cancelChanges}>
                <CancelIcon color="error" />
            </IconButton>
        </Box>
    );
}

interface ToggleActiveProps {
    isActive: boolean;
    toggle: () => void;
}

function ToggleActive(props: ToggleActiveProps) {
    const { isActive, toggle } = props;
    return (
        <FormControlLabel
            control={<Checkbox checked={isActive} onChange={toggle} title="Trigger Aktiv?" />}
            label="Trigger aktiv?"
        />
    );
}
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
