import styles from "./timeLineMenu.module.css";
import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ExtendButtonBase,
    FormControl,
    FormHelperText,
    Icon,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Influencer, TimelineEvent } from "@/app/ServerFunctions/databaseTypes";
import { createTimelineEvent, listTimelineEvents } from "@/app/ServerFunctions/serverActions";
import { DialogOptions, DialogProps } from "@/app/Definitions/types";
import { Webinar, Campaign } from "@/app/ServerFunctions/databaseTypes";

import {
    campaignTypes,
    influencerAssignments,
    timelineEventTypes,
    timelineEventTypesType,
} from "@/amplify/data/types";
import {
    DatePicker,
    DateTimePicker,
    LocalizationProvider,
    TimeClock,
    TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import { ChangeEvent, MouseEvent, MouseEventHandler, useState } from "react";
import dayjs, { Dayjs } from "@/app/configuredDayJs";
import {
    Add as AddIcon,
    Edit as EditIcon,
    DeleteOutlined as DeleteIcon,
    Save as SaveIcon,
    Close as CancelIcon,
} from "@mui/icons-material";
import { CustomIconButton } from "@/app/Components/IconButton";

type DialogType = TimelineEvent.TimelineEvent;
const initEvent: DialogType = {
    timelineEventType: "Generic",
    influencer: { id: "", firstName: "", lastName: "" },
    campaign: { id: "" },
};
function TimeLineEventDialog(props: {
    props: DialogProps<Campaign.Campaign>;
    options: DialogOptions<DialogType>;
    influencers: Influencer.Influencer[];
}) {
    const { influencers } = props;
    const { onClose, rows, setRows, columns, excludeColumns } = props.props;
    const { open = false, editing, editingData, campaignId = "" } = props.options;
    const [timelineEvent, setTimelineEvent] = useState<DialogType>(
        editingData ?? { ...initEvent, campaign: { id: campaignId } },
    );
    const [dates, setDates] = useState<{ number: number; dates: (Dayjs | null)[] }>({
        number: 1,
        dates: [null],
    });
    // const [inviteEvent, setInviteEvent] = useState<InviteEvent>();

    // const [isModalOpen, setIsModalOpen] = useState(open);

    function handleClose() {
        if (onClose) {
            onClose();
        }
        // setIsModalOpen(false);
    }
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(timelineEvent);

        if (editing) {
            // const updatedWebinar: Webinar = formJson as Webinar;
            // updatedWebinar.date = dayjs(
            //     updatedWebinar.date,
            //     "DD.MM.YYYY HH:MM",
            // ).toISOString();
            // const campaign = rows.find((x) => x.webinar.id === updatedWebinar.id);
            // console.log({ campaign, updatedWebinar });
            // if (campaign) campaign.webinar = updatedWebinar;
            // parseWebinarFormData(formJson);
        } else {
            const events = dates.dates.map((date) => {
                if (date === null) return;
                return { ...timelineEvent, date: date.toISOString() } satisfies DialogType;
            });
            const res = await Promise.all(events.map((x) => x && createTimelineEvent(x)));
            console.log(res);
            const dbEvents = await listTimelineEvents();
            console.log(dbEvents);
        }

        // handleClose();
    }
    function handleAddDateClick() {
        setDates((prev) => {
            return { number: prev.number + 1, dates: [...prev.dates, null] };
        });
    }
    function handleTypeChange(e: SelectChangeEvent) {
        const value = e.target.value as timelineEventTypesType;
        switch (value) {
            case "Invites":
                setTimelineEvent(
                    (prev) =>
                        ({
                            ...prev,
                            timelineEventType: value,

                            inviteEvent: { invites: 1000 },
                        } satisfies TimelineEvent.TimeLineEventInvites),
                );
                break;
            case "Video":
                setTimelineEvent(
                    (prev) =>
                        ({
                            ...prev,
                            timelineEventType: value,
                        } satisfies TimelineEvent.TimeLineEventVideo),
                );
                break;
            case "Post":
                setTimelineEvent(
                    (prev) =>
                        ({
                            ...prev,
                            timelineEventType: value,
                        } satisfies TimelineEvent.TimeLineEventPost),
                );
                break;
            default:
                setTimelineEvent(
                    (prev) =>
                        ({
                            ...prev,
                            timelineEventType: value,
                        } satisfies TimelineEvent.TimeLineEventGeneric),
                );
                break;
        }
    }
    function handleInfluencerChange(e: SelectChangeEvent) {
        const value = e.target.value;
        setTimelineEvent(
            (prev) =>
                ({
                    ...prev,
                    influencer: { ...prev.influencer, id: value },
                } satisfies TimelineEvent.TimelineEvent),
        );
    }
    function handleRemoveDateClick(i: number) {
        return function (e: MouseEvent<HTMLButtonElement>) {
            setDates((prev) => {
                const newValue = {
                    number: prev.number - 1,
                    dates: [...prev.dates.filter((_x, index) => index !== i)],
                };
                console.log({ prev, newValue });
                return newValue;
            });
        };
    }
    function handleDateChange(index: number) {
        return function changeDate(newDate: Dayjs | null) {
            if (!newDate) return;
            setDates((prev) => ({
                ...prev,
                dates: [...prev.dates.map((x, i) => (i === index ? newDate : x))],
            }));
        };
    }

    return (
        <Dialog
            // ref={modalRef}
            open={open}
            className={styles.dialog}
            onClose={handleClose}
            PaperProps={{
                component: "form",
                onSubmit,
            }}
            sx={{
                "& .MuiDialogContent-root": {
                    maxWidth: "80vw",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    // width: "520px",
                },
                "& .MuiFormControl-root": {
                    // padding: "5px",
                    minWidth: "20ch",
                    margin: "5px",
                    flex: 1,
                },
                "& .MuiDialogContentText-root": {
                    flexBasis: "100%",
                    flexShrink: 0,
                },
                "& .MuiDialogContent-dividers:nth-of-type(even)": {
                    // display: "none",
                    border: "none",
                },
            }}
        >
            <DialogTitle>{editing ? "Ereignis bearbeiten" : "Neues Ereignis"}</DialogTitle>
            {/* <button onClick={handleCloseModal}>x</button> */}

            <DialogContent dividers sx={{ "& .MuiFormControl-root": { flexBasis: "100%" } }}>
                <TextField
                    key="id"
                    id="id"
                    name="id"
                    className={styles.TextField}
                    label="ID"
                    type="text"
                    defaultValue={editingData?.id ?? "new"}
                    hidden
                />
                <FormControl sx={{ margin: "5px", flex: 1, minWidth: "200px" }}>
                    <InputLabel id="timelineEventType">Ereignistyp</InputLabel>
                    <Select
                        name="timelineEventType"
                        labelId="timelineEventType"
                        label="Event Typ"
                        value={timelineEvent.timelineEventType}
                        size="medium"
                        required
                        onChange={handleTypeChange}
                    >
                        {/* <MenuItem key={-1} value={undefined}>
                            ---
                        </MenuItem> */}
                        {timelineEventTypes.map((x, i) => {
                            return (
                                <MenuItem key={`eventtype${i}`} value={x}>
                                    {x}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <FormControl sx={{ margin: "5px", flex: 1, minWidth: "200px" }}>
                    <InputLabel id="influencerSelect">Influenzer</InputLabel>
                    <Select
                        name="influencer"
                        labelId="influencerSelect"
                        label="Influencer"
                        size="medium"
                        value={timelineEvent.influencer.id}
                        onChange={handleInfluencerChange}
                        required
                    >
                        {influencers.map((influencer, i) => {
                            if (!Influencer.isInfluencerFull(influencer)) return;
                            return (
                                <MenuItem key={`influencer${influencer.id}`} value={influencer.id}>
                                    {`${influencer.firstName} ${influencer.lastName}`}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogContent
                dividers
                sx={{ "& .MuiFormControl-root": { flexBasis: "100%", flex: 1 } }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                    <div style={{ flexBasis: "100%" }}>
                        {dates.dates.map((date, index) => {
                            return (
                                <div key={`dumb${index}`} className={styles.cellActionSplit}>
                                    <DateTimePicker
                                        key={`date${index}`}
                                        closeOnSelect={false}
                                        label="Termin"
                                        name="date"
                                        value={date}
                                        onChange={handleDateChange(index)}
                                        slotProps={{
                                            textField: {
                                                required: true,
                                            },
                                        }}
                                    />
                                    {dates.number > 1 && (
                                        <Button
                                            key={`removeButton${index}`}
                                            onClick={handleRemoveDateClick(index)}
                                        >
                                            <DeleteIcon />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <Button
                        key={"Add"}
                        aria-label="Add"
                        onClick={handleAddDateClick}
                        color="primary"
                        style={{ alignSelf: "flex-start" }}
                        variant="outlined"
                    >
                        <AddIcon />
                        An weiterem Termin wiederholen
                    </Button>

                    {/* <TimePicker name="time" /> */}
                </LocalizationProvider>
            </DialogContent>
            {TimelineEvent.isInviteEvent(timelineEvent) && (
                <>
                    <DialogContent
                        dividers
                        sx={{ "& .MuiFormControl-root": { flexBasis: "100%" } }}
                    >
                        <TextField
                            type="number"
                            id="invites"
                            name="invites"
                            label="Anzahl Invites"
                            value={timelineEvent.inviteEvent?.invites}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const value: number = parseInt(e.target.value);
                                // console.log(value);
                                setTimelineEvent((prev) => {
                                    if (!TimelineEvent.isInviteEvent(prev)) return prev;
                                    const newVal = {
                                        ...prev,
                                        inviteEvent: { ...prev.inviteEvent, invites: value },
                                    } satisfies TimelineEvent.TimelineEvent;
                                    console.log({ prev, newVal });
                                    return newVal;
                                });
                            }}
                            required
                        />
                    </DialogContent>
                </>
            )}

            <DialogActions
                sx={{
                    justifyContent: "space-between",
                }}
            >
                <Button onClick={handleClose} color="secondary">
                    Abbrechen
                </Button>
                <Button variant="contained" type="submit">
                    Speichern
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export default TimeLineEventDialog;
