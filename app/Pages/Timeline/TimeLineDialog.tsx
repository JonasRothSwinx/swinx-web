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
    FormControl,
    FormHelperText,
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
    // Influencer,
    InfluencerAssignment,
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
import { useState } from "react";
import dayjs from "dayjs";

type DialogType = TimelineEvent;
const initEvent: TimelineEvent = {
    timelineEventType: "",
    id: "",
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
    const [assignmentType, setAssignmentType] = useState<string>();
    const [timelineEventForm, setTimelineEventForm] = useState<TimelineEvent>(
        editingData ?? initEvent,
    );
    const [dates, setDates] = useState<dayjs.Dayjs[]>([]);
    // const [isModalOpen, setIsModalOpen] = useState(open);

    function handleClose() {
        if (onClose) {
            onClose();
        }
        // setIsModalOpen(false);
    }
    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
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
            }}
        >
            <DialogTitle>{editing ? "Ereignis bearbeiten" : "Neues Ereignis"}</DialogTitle>
            {/* <button onClick={handleCloseModal}>x</button> */}

            <DialogContent dividers sx={{ "& .MuiFormControl-root": { flexBasis: "100%" } }}>
                <TextField
                    id="id"
                    name="id"
                    className={styles.TextField}
                    label="ID"
                    type="text"
                    defaultValue={editingData?.id}
                    required
                    hidden
                />
                <FormControl sx={{ margin: "5px", flex: 1, minWidth: "200px" }}>
                    <InputLabel id="influencerSelect">Ereignistyp</InputLabel>
                    <Select
                        name="timelineEventType"
                        labelId="timelineEventType"
                        label="Event Typ"
                        // defaultValue={undefined}
                        size="medium"
                        required
                        onChange={(e: SelectChangeEvent) => {
                            const value = e.target.value;
                            setTimelineEventForm(
                                (prev) =>
                                    ({
                                        ...prev,
                                        timelineEventType: value,
                                    } satisfies TimelineEvent),
                            );
                        }}
                    >
                        {/* <MenuItem key={-1} value={undefined}>
                            ---
                        </MenuItem> */}
                        {timelineEventTypes.map((x, i) => {
                            return (
                                <MenuItem key={i} value={x}>
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
                        required
                    >
                        {influencers.map((x, i) => {
                            return (
                                <MenuItem key={x.id} value={x.id}>
                                    {`${x.firstName} ${x.lastName}`}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                    {dates.map((date, index) => {
                        return (
                            <DateTimePicker
                                key={index}
                                closeOnSelect={false}
                                label="Termin"
                                name="date"
                                slotProps={{
                                    textField: {
                                        required: true,
                                    },
                                }}
                            />
                        );
                    })}

                    {/* <TimePicker name="time" /> */}
                </LocalizationProvider>
            </DialogContent>

            {timelineEventForm.timelineEventType === "Invites" && (
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
