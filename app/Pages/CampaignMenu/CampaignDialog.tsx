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
    createNewCampaign,
    createNewInfluencer,
    // parseCampaignFormData,
    updateInfluencer,
} from "@/app/ServerFunctions/serverActions";
import { DialogOptions, DialogProps } from "@/app/Definitions/types";
import { Campaign, Customer, Webinar } from "@/app/ServerFunctions/databaseTypes";
import { campaignTypes } from "@/amplify/data/types";
import {
    DatePicker,
    DateTimePicker,
    LocalizationProvider,
    TimeClock,
    TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "@/app/configuredDayJs";

type DialogType = Campaign.Campaign;

const initialCustomer: Customer = {
    firstName: "",
    lastName: "",
    company: "",
    email: "",
};
const initialWebinar: Webinar = {
    title: "",
    date: "",
};
const initialData: Campaign.Campaign = {
    id: "",
    campaignType: "Webinar",
    campaignManagerId: "",
    campaignTimelineEvents: [],
    campaignStep: "",
    webinar: initialWebinar,
    customer: initialCustomer,
};

function CampaignDialog(props: DialogProps<DialogType> & DialogOptions<DialogType>) {
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

    const [campaign, setCampaign] = useState<Campaign.Campaign>(initialData);
    // const [isModalOpen, setIsModalOpen] = useState(open);

    useEffect(() => {
        return () => setCampaign(initialData);
    }, [open]);
    useEffect(() => {
        // console.log(campaign);
        // console.log({ isWebinar: Campaign.isWebinar(campaign) });

        return () => {};
    }, [campaign]);

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
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        createNewCampaign(campaign);
        setRows((prevState) => [...(prevState ?? []), campaign]);
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
            <DialogTitle>{"Neue Kampagne"}</DialogTitle>
            {/* <button onClick={handleCloseModal}>x</button> */}
            <DialogContent dividers>
                <FormControl sx={{ margin: "5px", flex: 1, minWidth: "200px" }}>
                    <InputLabel id="campaignTypeSelect">Kampagnen-Typ</InputLabel>
                    <Select
                        name="campaignType"
                        labelId="campaignTypeSelect"
                        label="Kampagnen Typ"
                        size="medium"
                        value={campaign.campaignType}
                        onChange={(event) => {
                            const value = event.target.value;
                            switch (value) {
                                case "Invites":
                                    setCampaign(
                                        (prevState) =>
                                            ({
                                                ...prevState,
                                                campaignType: value,
                                            } satisfies Campaign.Campaign),
                                    );
                                    break;
                                default:
                                    return;
                            }
                        }}
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
                    id="customerNameFirst"
                    name="customerNameFirst"
                    className={styles.TextField}
                    label="Vorname"
                    type="text"
                    value={campaign.customer?.firstName}
                    onChange={(event) =>
                        setCampaign(
                            (prevState) =>
                                ({
                                    ...prevState,
                                    customer: {
                                        ...prevState.customer,
                                        firstName: event.target.value,
                                    },
                                } satisfies Campaign.Campaign),
                        )
                    }
                    required
                />

                <TextField
                    id="customerNameLast"
                    name="customerNameLast"
                    className={styles.TextField}
                    label="Nachname"
                    type="text"
                    value={campaign.customer?.lastName}
                    onChange={(event) =>
                        setCampaign(
                            (prevState) =>
                                ({
                                    ...prevState,
                                    customer: {
                                        ...prevState.customer,
                                        lastName: event.target.value,
                                    },
                                } satisfies Campaign.Campaign),
                        )
                    }
                    required
                />
                <TextField
                    id="customerEmail"
                    name="customerEmail"
                    className={styles.TextField}
                    label="E-Mail"
                    type="email"
                    value={campaign.customer?.email}
                    onChange={(event) =>
                        setCampaign(
                            (prevState) =>
                                ({
                                    ...prevState,
                                    customer: {
                                        ...prevState.customer,
                                        email: event.target.value,
                                    },
                                } satisfies Campaign.Campaign),
                        )
                    }
                    required
                />
                <TextField
                    autoFocus
                    id="customerCompany"
                    name="customerCompany"
                    className={styles.TextField}
                    label="Firma"
                    value={campaign.customer?.company}
                    onChange={(event) =>
                        setCampaign(
                            (prevState) =>
                                ({
                                    ...prevState,
                                    customer: {
                                        ...prevState.customer,
                                        company: event.target.value,
                                    },
                                } satisfies Campaign.Campaign),
                        )
                    }
                    type="text"
                    required
                />
                <TextField
                    autoFocus
                    id="customerPosition"
                    name="customerPosition"
                    className={styles.TextField}
                    label="Position in Firma"
                    type="text"
                    value={campaign.customer?.companyPosition}
                    onChange={(event) =>
                        setCampaign(
                            (prevState) =>
                                ({
                                    ...prevState,
                                    customer: {
                                        ...prevState.customer,
                                        companyPosition: event.target.value,
                                    },
                                } satisfies Campaign.Campaign),
                        )
                    }
                />
            </DialogContent>
            {Campaign.isWebinar(campaign) && (
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
                        value={campaign.webinar?.title}
                        onChange={(event) => {
                            setCampaign((prevState) => {
                                if (!Campaign.isWebinar(prevState)) return prevState;
                                return {
                                    ...prevState,
                                    webinar: {
                                        ...prevState.webinar,
                                        title: event.target.value,
                                    },
                                } satisfies Campaign.Campaign;
                            });
                        }}
                        sx={{ color: "red", flexBasis: "100%" }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                        <DateTimePicker
                            closeOnSelect={false}
                            label="Termin"
                            name="webinarDate"
                            slotProps={{
                                textField: {
                                    required: true,
                                },
                            }}
                            value={campaign.webinar?.date ? campaign.webinar?.date : null}
                            onChange={(value) => {
                                console.log("value", value);
                                setCampaign((prevState) => {
                                    if (!Campaign.isWebinar(prevState)) return prevState;
                                    return {
                                        ...prevState,
                                        webinar: {
                                            ...prevState.webinar,
                                            date:
                                                dayjs(value, "DD.MM.YYYY HH:MM").toISOString() ??
                                                "",
                                        },
                                    } satisfies Campaign.Campaign;
                                });
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
