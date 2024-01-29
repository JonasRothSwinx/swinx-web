import styles from "./campaignMenu.module.css";
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
    TextField,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import {
    Influencer,
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
import { campaignTypes, influencerAssignments } from "@/amplify/data/types";
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

const client = generateClient<Schema>();
type DialogType = InfluencerAssignment;

function InfluencerAssignmentDialog(props: {
    props: DialogProps<WebinarCampaign>;
    options: DialogOptions<DialogType>;
    influencers: Influencer[];
}) {
    const { influencers } = props;
    const { onClose, rows, setRows, columns, excludeColumns } = props.props;
    const { open = false, editing, editingData } = props.options;
    const [assignmentType, setAssignmentType] = useState<string>();
    // const [isModalOpen, setIsModalOpen] = useState(open);

    function handleClose() {
        if (onClose) {
            onClose();
        }
        // setIsModalOpen(false);
    }

    return (
        <Dialog
            // ref={modalRef}
            open={open}
            className={styles.dialog}
            onClose={handleClose}
            PaperProps={{
                component: "form",
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());
                    const { id, influencer: influencerId, assignmentType } = formJson;
                    if (editing) {
                        const updatedWebinar: Webinar = formJson as Webinar;
                        updatedWebinar.date = dayjs(
                            updatedWebinar.date,
                            "DD.MM.YYYY HH:MM",
                        ).toISOString();
                        const campaign = rows.find((x) => x.webinar.id === updatedWebinar.id);
                        console.log({ campaign, updatedWebinar });
                        if (campaign) campaign.webinar = updatedWebinar;
                        parseWebinarFormData(formJson);
                    } else {
                        const influencer = influencers.find((x) => x.id === influencerId);
                        if (!influencer) throw new Error("");

                        const assignment: InfluencerAssignment = {
                            assignmentType,
                            influencer: async (props) => {
                                return { data: influencer };
                            },
                        } as InfluencerAssignment;
                    }

                    handleClose();
                },
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
            <DialogTitle>{"Influenzer"}</DialogTitle>
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
                />{" "}
                <FormControl sx={{ margin: "5px", flex: 1, minWidth: "200px" }}>
                    <InputLabel id="influencerSelect">Influenzer</InputLabel>
                    <Select
                        name="influencer"
                        labelId="influencerSelect"
                        label="Influencer"
                        defaultValue={undefined}
                        size="medium"
                    >
                        <MenuItem key={-1} value={undefined}></MenuItem>
                        {influencers.map((x, i) => {
                            return (
                                <MenuItem key={x.public.id} value={x.public.id}>
                                    {`${x.public.firstName} ${x.public.lastName}`}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <FormControl sx={{ margin: "5px", flex: 1, minWidth: "200px" }}>
                    <InputLabel id="assignmentTypeSelect">Aufgabe</InputLabel>
                    <Select
                        name="assignmentType"
                        labelId="assignmentTypeSelect"
                        label="Aufgabe"
                        defaultValue={influencerAssignments[0]}
                        size="medium"
                        onChange={(event) => setAssignmentType(event.target.value)}
                    >
                        <MenuItem key={-1} value={undefined}></MenuItem>
                        {influencerAssignments.map((x, i) => {
                            return (
                                <MenuItem key={i} value={x}>
                                    {x}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </DialogContent>

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
export default InfluencerAssignmentDialog;
