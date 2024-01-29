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
import {
    Influencer,
    TimelineEvent,
    createNewInfluencer,
    parseCampaignFormData,
    parseCustomerFormData,
    parseWebinarFormData,
    updateInfluencer,
} from "@/app/ServerFunctions/serverActions";
import {
    Customer,
    DialogOptions,
    DialogProps,
    InviteEvent,
    // Influencer,
    Webinar,
    WebinarCampaign,
} from "@/app/Definitions/types";
import { campaignTypes, influencerAssignments, timelineEventTypes } from "@/amplify/data/types";
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
import dayjs, { Dayjs } from "dayjs";
import {
    Add as AddIcon,
    Edit as EditIcon,
    DeleteOutlined as DeleteIcon,
    Save as SaveIcon,
    Close as CancelIcon,
} from "@mui/icons-material";
import { CustomIconButton } from "@/app/Components/IconButton";

type DialogType = Partial<TimelineEvent>;
const initEvent: DialogType = {
    timelineEventType: "",
    id: "",
    timelineEventInfluencerId: "",
    createdAt: "",
    updatedAt: "",
};
function TimeLineEventDialog(props: {
    props: DialogProps<WebinarCampaign>;
    options: DialogOptions<DialogType>;
    influencers: Influencer[];
}) {
    const { influencers } = props;
    const { onClose, rows, setRows, columns, excludeColumns } = props.props;
    const { open = false, editing, editingData } = props.options;
    const [timelineEvent, setTimelineEvent] = useState<Partial<TimelineEvent>>(
        editingData ?? initEvent,
    );
    const [dates, setDates] = useState<{ number: number; dates: (Dayjs | null)[] }>({
        number: 1,
        dates: [null],
    });
    const [inviteEvent, setInviteEvent] = useState<InviteEvent>();

    // const [isModalOpen, setIsModalOpen] = useState(open);

    function handleClose() {
        if (onClose) {
            onClose();
        }
        // setIsModalOpen(false);
    }
    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(timelineEvent);
        return;
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const { id, influencer: influencerId, assignmentType } = formJson;
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
            // const influencer = influencers.find((x) => x.id === influencerId);
            // if (!influencer) throw new Error("");
            // const assignment: InfluencerAssignment = {
            //     assignmentType,
            //     influencer: async (props) => {
            //         return { data: influencer };
            //     },
            // } as InfluencerAssignment;
        }

        handleClose();
    }
    function handleAddDateClick() {
        setDates((prev) => {
            return { number: prev.number + 1, dates: [...prev.dates, null] };
        });
    }
    function handleTypeChange(e: SelectChangeEvent) {
        const value = e.target.value;
        setTimelineEvent(
            (prev) =>
                ({
                    ...prev,
                    timelineEventType: value,
                } satisfies Partial<TimelineEvent>),
        );
    }
    function handleInfluencerChange(e: SelectChangeEvent) {
        const value = e.target.value;
        setTimelineEvent(
            (prev) =>
                ({
                    ...prev,
                    timelineEventInfluencerId: value,
                } satisfies Partial<TimelineEvent>),
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
                        value={timelineEvent.timelineEventInfluencerId}
                        onChange={handleInfluencerChange}
                        required
                    >
                        {influencers.map((x, i) => {
                            return (
                                <MenuItem key={`influencer${x.id}`} value={x.id}>
                                    {`${x.firstName} ${x.lastName}`}
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
            {timelineEvent.timelineEventType === "Invites" && (
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
                            value={inviteEvent?.invites ?? 1000}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const value: number = parseInt(e.target.value);
                                // console.log(value);
                                setInviteEvent((prev) => {
                                    const newValue = prev
                                        ? { ...prev, invites: value }
                                        : { invites: value };
                                    // console.log({ prev, newValue });
                                    return newValue;
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
