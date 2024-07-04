import { dataClient } from "@/app/ServerFunctions/database";
import {
    Box,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    IconButton,
    MenuItem,
    SxProps,
    TextField,
    Typography,
} from "@mui/material";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { dayjs, Dayjs } from "@/app/utils";
import { EmailTriggers, Event, Events } from "@/app/ServerFunctions/types";
import { Nullable } from "@/app/Definitions/types";
import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMemo, useState } from "react";
import { CancelIcon, PrintIcon, SaveIcon } from "@/app/Definitions/Icons";
import { useConfirm } from "material-ui-confirm";

interface EmailTriggerMenuProps {
    eventId: string;
}

const emailTypeDisplayNames: {
    [key in Events.eventType]: Nullable<{
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

export default function EmailTriggerMenu(props: EmailTriggerMenuProps) {
    const { eventId } = props;
    const triggers = useQuery({
        queryKey: ["emailTriggers", eventId],
        queryFn: async () => {
            const data = await dataClient.emailTrigger.byEvent({ id: eventId });
            console.log("Email triggers", data);

            return data;
        },
    });

    const ChangeHandlers = {
        eventCompletionChange: useMutation({}),
    };
    //#region Query States
    if (triggers.isLoading)
        return (
            <Box id="EmailTriggerMenuLoading">
                <Typography>Loading...</Typography>
                <CircularProgress />
            </Box>
        );
    if (triggers.isError) return <Typography>Error</Typography>;
    if (!triggers.data) return <Typography>Keine Daten</Typography>;
    //#endregion
    return (
        <Box id="EmailTriggerMenu">
            {triggers.data?.map((trigger) => (
                <EmailTrigger
                    key={trigger.id}
                    trigger={trigger}
                    event={trigger.event}
                />
            ))}
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
    const emailLevel =
        changedData.emailLevelOverride ??
        trigger.emailLevelOverride ??
        influencer?.emailLevel ??
        "new";
    const emailBodyOverride = trigger.emailBodyOverride;
    const subjectLineOverride = trigger.subjectLineOverride;
    if (isPlaceholder)
        return (
            <Box id="EmailTrigger">
                <Typography>{dayjs(trigger.date).format("DD.MM.YYYY")}</Typography>
                <Typography>
                    {emailTypeDisplayNames[event.type]?.[trigger.type] ?? trigger.type}
                </Typography>
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
            <Typography variant="h5">
                {emailTypeDisplayNames[event.type]?.[trigger.type] ?? trigger.type}
            </Typography>
            <TriggerDatePicker
                event={event}
                trigger={trigger}
                dateChange={ChangeHandler.dateChange}
            />
            <EmailLevelSelector
                emailLevel={emailLevel}
                onChange={ChangeHandler.emailLevelChange}
            />
            {/* Overwrite Email */}
            <ToggleActive
                isActive={changedData.active ?? trigger.active}
                toggle={ChangeHandler.ToggleActive}
            />
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
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="de"
        >
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
            SelectProps={{
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
            }}
        >
            {EmailTriggers.emailLevels.map((level) => (
                <MenuItem
                    key={level}
                    value={level}
                >
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
            control={
                <Checkbox
                    checked={isActive}
                    onChange={toggle}
                    title="Trigger Aktiv?"
                />
            }
            label="Trigger aktiv?"
        />
    );
}
