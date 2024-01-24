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
    parseCustomerFormData,
    updateInfluencer,
} from "@/app/ServerFunctions/serverActions";
import { Customer, DialogOptions, DialogProps, WebinarCampaign } from "@/app/Definitions/types";
import { campaignTypes } from "@/amplify/data/types";
import { DatePicker, DateTimePicker, LocalizationProvider, TimeClock, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";

const client = generateClient<Schema>();
type DialogType = Customer;

function CustomerDialog(props: { props: DialogProps<WebinarCampaign>; options: DialogOptions<DialogType> }) {
    const { onClose, rows, setRows, columns, excludeColumns } = props.props;
    const { open = false, editing, editingData } = props.options;
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
                    parseCustomerFormData(formJson);

                    const updatedCustomer: Customer = formJson as Customer;
                    const campaign = rows.find((x) => x.customer.id === updatedCustomer.id);
                    console.log({ campaign, updatedCustomer });
                    if (campaign) campaign.customer = updatedCustomer;
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
            <DialogTitle>{"Kunde"}</DialogTitle>
            {/* <button onClick={handleCloseModal}>x</button> */}

            <DialogContent dividers sx={{ "& .MuiFormControl-root:has(#customerEmail)": { flexBasis: "100%" } }}>
                <TextField
                    autoFocus
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
                    id="customerNameFirst"
                    name="customerNameFirst"
                    className={styles.TextField}
                    label="Vorname"
                    type="text"
                    defaultValue={editingData?.customerNameFirst}
                    required
                />

                <TextField
                    id="customerNameLast"
                    name="customerNameLast"
                    className={styles.TextField}
                    label="Nachname"
                    type="text"
                    defaultValue={editingData?.customerNameLast}
                    required
                />
                <TextField
                    id="customerEmail"
                    name="customerEmail"
                    className={styles.TextField}
                    label="E-Mail"
                    type="email"
                    defaultValue={editingData?.customerEmail}
                    required
                />
                <TextField
                    autoFocus
                    id="customerCompany"
                    name="customerCompany"
                    className={styles.TextField}
                    label="Firma"
                    type="text"
                    defaultValue={editingData?.customerCompany}
                />
                <TextField
                    autoFocus
                    id="customerPosition"
                    name="customerPosition"
                    className={styles.TextField}
                    label="Position in Firma"
                    type="text"
                    defaultValue={editingData?.customerPosition}
                />
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
export default CustomerDialog;
