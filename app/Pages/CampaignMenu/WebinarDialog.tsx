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
import { parseWebinarFormData } from "@/app/ServerFunctions/serverActions";
import { DialogOptions, DialogProps } from "@/app/Definitions/types";
import { Webinar, Campaign, Customer } from "@/app/ServerFunctions/databaseTypes";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import dayjs from "@/app/configuredDayJs";

const client = generateClient<Schema>();
type DialogType = Webinar;

function WebinarDialog(props: {
    props: DialogProps<Campaign.Campaign>;
    options: DialogOptions<DialogType>;
}) {
    const { onClose, rows, setRows, columns, excludeColumns } = props.props;
    const { open = false, editing, editingData } = props.options;
    const [date, setDate] = useState(dayjs(editingData?.date ?? ""));
    // const [isModalOpen, setIsModalOpen] = useState(open);

    function handleClose() {
        if (onClose) {
            onClose();
        }
        // setIsModalOpen(false);
    }

    // async function makeInfluencer(args: { firstName: string; lastName: string; email: string }) {
    //     const { firstName, lastName, email } = args;
    //     console.log({ firstName, lastName, email });
    //     if (!(firstName && lastName && email)) {
    //         return;
    //     }
    //     const { data: privateData } = await client.models.InfluencerPrivate.create({
    //         email,
    //     });
    //     const { data: newPublicInfluencer } = await client.models.InfluencerPublic.create({
    //         firstName,
    //         lastName,
    //         details: privateData,
    //     });
    //     // console.log({ newPublicInfluencer });
    //     // console.log(data.get("firstName"), data.get("lastName"),data.);
    //     handleClose();
    // }

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
                    parseWebinarFormData(formJson);

                    const updatedWebinar: Webinar = formJson as Webinar;
                    updatedWebinar.date = dayjs(
                        updatedWebinar.date,
                        "DD.MM.YYYY HH:MM",
                    ).toISOString();
                    const campaign = rows.find(
                        (campaign): campaign is Campaign.WebinarCampaign =>
                            Campaign.isWebinar(campaign) &&
                            campaign.webinar.id === updatedWebinar.id,
                    );
                    console.log({ campaign, updatedWebinar });
                    if (campaign) campaign.webinar = updatedWebinar;
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
            <DialogTitle>{"Webinar"}</DialogTitle>
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
                <TextField
                    autoFocus
                    id="title"
                    name="title"
                    className={styles.TextField}
                    label="Titel"
                    type="text"
                    defaultValue={editingData?.title}
                    required
                />
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                    <DateTimePicker
                        closeOnSelect={false}
                        name="date"
                        label="Termin"
                        defaultValue={date}
                        slotProps={{
                            textField: {
                                required: true,
                            },
                        }}
                    />
                    {/* <TimePicker name="time" /> */}
                </LocalizationProvider>
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
export default WebinarDialog;
