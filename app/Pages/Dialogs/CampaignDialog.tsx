import { DialogProps } from "@/app/Definitions/types";
import { campaigns } from "@/app/ServerFunctions/database/dbOperations/.database";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Customer from "@/app/ServerFunctions/types/customer";
import dayjs, { Dayjs } from "@/app/configuredDayJs";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { DateTimeValidationError, PickerChangeHandlerContext } from "@mui/x-date-pickers";
import { ChangeEvent, useEffect, useState } from "react";
import stylesExporter from "../styles/stylesExporter";
import { CustomerDialogContent } from "./CustomerDialog";

const styles = stylesExporter.dialogs;
type DialogType = Campaign.Campaign;

const initialCustomer: Customer.Customer = {
    firstName: "",
    lastName: "",
    company: "",
    email: "",
};

const initialData: Campaign.Campaign = {
    id: "",
    campaignManagerId: "",
    campaignTimelineEvents: [],
    assignedInfluencers: [],
    customer: initialCustomer,
    billingAdress: {
        name: "",
        street: "",
        city: "",
        zip: "",
    },
} as const;
type CampaignDialogProps = DialogProps<Campaign.Campaign[], Campaign.Campaign>;

function CampaignDialog(props: CampaignDialogProps) {
    const { isOpen = false, onClose, editing, editingData, parent: rows, setParent: setRows } = props;

    const [campaign, setCampaign] = useState<Campaign.Campaign>(initialData);
    const [changedData, setChangedData] = useState<Partial<Campaign.Campaign>>(editingData ?? {});
    const [customer, setCustomer] = useState<Partial<Customer.Customer>>(
        editingData?.customer ?? { substitutes: [{ ...initialCustomer } /* , { ...initialCustomer } */] }
    );
    const [billingAdress, setBillingAdress] = useState<Campaign.BillingAdress>({
        name: "",
        street: "",
        city: "",
        zip: "",
    });
    // const [isModalOpen, setIsModalOpen] = useState(open);

    useEffect(() => {
        return () => setCampaign(initialData);
    }, []);
    useEffect(() => {
        // console.log(campaign);
        // console.log({ isWebinar: Campaign.isWebinar(campaign) });

        return () => {};
    }, [campaign]);

    function handleClose(hasChanged?: boolean) {
        if (onClose) {
            onClose(hasChanged);
        }
        // setIsModalOpen(false);
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        campaigns.create(campaign);
        const newRows = [...(rows ?? []), campaign];
        setRows([...newRows]);
        handleClose(true);
    }

    function handleDateChange(newValue: Dayjs | null, context: PickerChangeHandlerContext<DateTimeValidationError>) {
        // console.log("value", newValue);
        try {
            const newDate = dayjs(newValue);
            // console.log({ newDate });
            const dateString = newDate.toISOString();
            // console.log(newDate, dateString);
            setCampaign((prevState) => {
                return {
                    ...prevState,
                } satisfies Campaign.Campaign;
            });
        } catch (error) {
            console.log(newValue, context);
        }
    }
    return (
        <Dialog
            // ref={modalRef}
            open={isOpen}
            // className={styles.dialog}
            onClose={() => handleClose(false)}
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
            <DialogContent sx={{ "& .MuiFormControl-root:has(#customerEmail)": { flexBasis: "100%" } }}>
                <DialogContentText>Kunde</DialogContentText>
                <CustomerDialogContent {...{ customer: customer, setCustomer: setCustomer }} />
            </DialogContent>
            <DialogContent sx={{ "& .MuiFormControl-root": { margin: "5px" } }}>
                <DialogContentText>Budget</DialogContentText>
                <BudgetInfo campaign={campaign} setCampaign={setCampaign} />
            </DialogContent>
            <DialogContent sx={{ "& .MuiFormControl-root": { margin: "5px" } }}>
                <DialogContentText>Rechnungsadresse</DialogContentText>
                <BillingAdressInfo billingAdress={billingAdress} setBillingAdress={setBillingAdress} />
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: "space-between",
                }}
            >
                <Button onClick={() => handleClose(false)} color="secondary">
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

interface InfoProps {
    billingAdress: Campaign.BillingAdress;
    setBillingAdress: React.Dispatch<React.SetStateAction<Campaign.BillingAdress>>;
}
function BillingAdressInfo(props: InfoProps) {
    const { billingAdress, setBillingAdress } = props;
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setBillingAdress((prevState) => {
            return {
                ...prevState,
                [name]: value,
            } satisfies Campaign.BillingAdress;
        });
    };
    return (
        <DialogContent dividers sx={{ "& .MuiFormControl-root": { margin: "5px" } }}>
            <TextField
                name="name"
                label="Name"
                value={billingAdress.name}
                onChange={handleChange}
                fullWidth
                className={styles.TextField}
                variant="standard"
            />
            <TextField
                name="street"
                label="Straße"
                value={billingAdress.street}
                onChange={handleChange}
                fullWidth
                className={styles.TextField}
                variant="standard"
            />
            <TextField
                name="city"
                label="Stadt"
                value={billingAdress.city}
                onChange={handleChange}
                fullWidth
                className={styles.TextField}
                variant="standard"
            />
            <TextField
                name="zip"
                label="PLZ"
                value={billingAdress.zip}
                onChange={handleChange}
                fullWidth
                className={styles.TextField}
                variant="standard"
            />
        </DialogContent>
    );
}

interface BudgetinfoProps {
    campaign: Campaign.Campaign;
    setCampaign: React.Dispatch<React.SetStateAction<Campaign.Campaign>>;
}

function BudgetInfo(props: BudgetinfoProps) {
    const { campaign, setCampaign } = props;
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCampaign((prevState) => {
            return {
                ...prevState,
                [name]: value,
            } satisfies Campaign.Campaign;
        });
    };
    return (
        <DialogContent dividers sx={{ "& .MuiFormControl-root": { margin: "5px" } }}>
            <TextField
                name="budget"
                label="Budget"
                type="number"
                value={campaign.budget ?? null}
                onChange={handleChange}
                fullWidth
                className={styles.TextField}
                variant="standard"
            />
        </DialogContent>
    );
}
