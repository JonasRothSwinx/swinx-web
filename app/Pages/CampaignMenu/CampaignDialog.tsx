import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
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
    createNewInfluencer,
    parseCampaignFormData,
    updateInfluencer,
} from "@/app/ServerFunctions/serverActions";
import { DialogOptions, DialogProps } from "@/app/Definitions/types";
import { campaignTypes } from "@/amplify/data/types";
import {
    DatePicker,
    DateTimePicker,
    LocalizationProvider,
    TimeClock,
    TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";

const client = generateClient<Schema>();

function CampaignDialog<WebinarCampaign>(
    props: DialogProps<WebinarCampaign> & DialogOptions<WebinarCampaign>,
) {
    const {
        open = false,
        onClose,
        editing,
        editingData,
        rows,
        setRows,
        columns,
        excludeColumns,
    } = props;
    const [campaignType, setcampaignType] = useState<string>("Webinar");
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
                    parseCampaignFormData(formJson);
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
            <DialogTitle>{"Neue Kampagne"}</DialogTitle>
            {/* <button onClick={handleCloseModal}>x</button> */}
            <DialogContent dividers>
                <FormControl sx={{ margin: "5px", flex: 1, minWidth: "200px" }}>
                    <InputLabel id="campaignTypeSelect">Kampagnen-Typ</InputLabel>
                    <Select
                        name="campaignType"
                        labelId="campaignTypeSelect"
                        label="Kampagnen Typ"
                        defaultValue={campaignTypes[0]}
                        size="medium"
                    >
                        {campaignTypes.map((x, i) => {
                            return (
                                <MenuItem key={i} value={x}>
                                    {x}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogContent
                dividers
                sx={{ "& .MuiFormControl-root:has(#customerEmail)": { flexBasis: "100%" } }}
            >
                <DialogContentText>Kunde</DialogContentText>
                <TextField
                    autoFocus
                    id="customerFirstName"
                    name="customerFirstName"
                    className={styles.TextField}
                    label="Vorname"
                    type="text"
                    required
                />

                <TextField
                    id="customerLastName"
                    name="customerLastName"
                    className={styles.TextField}
                    label="Nachname"
                    type="text"
                    required
                />
                <TextField
                    id="customerEmail"
                    name="customerEmail"
                    className={styles.TextField}
                    label="E-Mail"
                    type="email"
                    required
                />
                <TextField
                    autoFocus
                    id="customerCompany"
                    name="customerCompany"
                    className={styles.TextField}
                    label="Firma"
                    type="text"
                />
                <TextField
                    autoFocus
                    id="customerPosition"
                    name="customerPosition"
                    className={styles.TextField}
                    label="Position in Firma"
                    type="text"
                />
            </DialogContent>
            {campaignType === "Webinar" && (
                <DialogContent
                    dividers
                    sx={{ "& .MuiFormControl-root:has(#webinarTitle)": { flexBasis: "100%" } }}
                >
                    <DialogContentText>Webinar</DialogContentText>
                    <TextField
                        autoFocus
                        id="webinarTitle"
                        name="webinarTitle"
                        className={styles.TextField}
                        label="Titel"
                        type="text"
                        required
                        fullWidth
                        sx={{ color: "red", flexBasis: "100%" }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                        <DateTimePicker
                            name="webinarDate"
                            slotProps={{
                                textField: {
                                    required: true,
                                },
                            }}
                        />
                        {/* <TimePicker name="time" /> */}
                    </LocalizationProvider>
                </DialogContent>
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
export default CampaignDialog;
