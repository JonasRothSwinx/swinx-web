import dataClient from "@/app/ServerFunctions/database";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
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
import { useQueries, useQuery } from "@tanstack/react-query";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { Nullable } from "@/app/Definitions/types";
import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMemo, useState } from "react";
import { CancelIcon, SaveIcon } from "@/app/Definitions/Icons";
import { useConfirm } from "material-ui-confirm";

interface EmailTriggerMenuProps {
    eventId: string;
}

const emailTypeDisplayNames: {
    [key in TimelineEvent.eventType]: Nullable<{ [key in EmailTriggers.emailTriggerType]: string | null }>;
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
    const sxProps: SxProps = useMemo(() => {
        return {
            "&": {
                "&#EmailTriggerMenu": {
                    display: "flex",
                    flexDirection: "column",
                    // border: "1px solid black",
                    // borderRadius: "10px",
                    height: "100%",
                    maxHeight: "100%",
                    maxWidth: "100%",
                },
                "&#EmailTriggerMenuLoading": {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                },

                "#EmailTrigger": {
                    position: "relative",
                    border: "1px solid black",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                },
                "#EmailTrigger:hover > #TriggerModifyButtonContainer": {
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
            },
        };
    }, []);

    if (triggers.isLoading)
        return (
            <Box id="EmailTriggerMenuLoading" sx={sxProps}>
                <Typography>Loading...</Typography>
                <CircularProgress />
            </Box>
        );
    return (
        <Box id="EmailTriggerMenu" sx={sxProps}>
            {triggers.data?.map((trigger) => (
                <EmailTrigger key={trigger.id} trigger={trigger} event={trigger.event} />
            ))}
        </Box>
    );
}
interface EmailTriggerProps {
    trigger: EmailTriggers.EmailTrigger;
    event: TimelineEvent.Event;
}
function EmailTrigger(props: EmailTriggerProps) {
    const { trigger, event } = props;
    const isPlaceholder = event.assignments[0]?.isPlaceholder ?? true;
    const [changedData, setChangedData] = useState<Partial<EmailTriggers.EmailTrigger>>({});
    const confirm = useConfirm();

    if (isPlaceholder)
        return (
            <Box id="EmailTrigger">
                <Typography>{dayjs(trigger.date).format("DD.MM.YYYY")}</Typography>
                <Typography>{emailTypeDisplayNames[event.type]?.[trigger.type] ?? trigger.type}</Typography>
            </Box>
        );
    const EventHandler = {
        saveChanges: () => {
            console.log({ trigger, changedData });
        },
        cancelChanges: () => {
            confirm({ description: "Änderungen verwerfen?" }).then(() => setChangedData({}));
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
            setChangedData((prev) => {
                const newState = !prev.active;
                if (newState === trigger.active) {
                    delete prev.active;
                    return prev;
                }
                return { ...prev, active: newState };
            });
        },
    };
    const influencer = trigger.influencer;
    if (!influencer) return <Typography>Kein Influencer gefunden</Typography>;
    const emailLevel = trigger.emailLevelOverride ?? influencer.emailLevel ?? "new";
    const emailBodyOverride = trigger.emailBodyOverride;
    const subjectLineOverride = trigger.subjectLineOverride;
    return (
        <Box id="EmailTrigger">
            <ButtonContainer saveChanges={EventHandler.saveChanges} cancelChanges={EventHandler.cancelChanges} />
            <Typography variant="h5">{emailTypeDisplayNames[event.type]?.[trigger.type] ?? trigger.type}</Typography>
            <TriggerDatePicker event={event} trigger={trigger} dateChange={ChangeHandler.dateChange} />
            <EmailLevelSelector emailLevel={emailLevel} onChange={ChangeHandler.emailLevelChange} />
            {/* Overwrite Email */}
            <ToggleActive isActive={trigger.active} toggle={ChangeHandler.ToggleActive} />
        </Box>
    );
}
interface TriggerDatePickerProps {
    trigger: EmailTriggers.EmailTrigger;
    event: TimelineEvent.Event;
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
}

function ButtonContainer(props: ButtonContainerProps) {
    const { saveChanges, cancelChanges } = props;
    return (
        <Box id="TriggerModifyButtonContainer">
            <IconButton onClick={saveChanges}>
                <SaveIcon />
            </IconButton>
            <IconButton onClick={cancelChanges}>
                <CancelIcon />
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
            control={<Checkbox value={isActive} onChange={toggle} title="Trigger Aktiv?" />}
            label="Trigger aktiv?"
        />
    );
}
