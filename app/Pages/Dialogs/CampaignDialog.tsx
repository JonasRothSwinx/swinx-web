import { DialogProps } from "@/app/Definitions/types";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Customer from "@/app/ServerFunctions/types/customer";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField,
} from "@mui/material";
import { DateTimeValidationError, PickerChangeHandlerContext } from "@mui/x-date-pickers";
import { ChangeEvent, useEffect, useState } from "react";
import stylesExporter from "../styles/stylesExporter";
import { CustomerDialogContent } from "./CustomerDialog";
import { Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { AddIcon } from "@/app/Definitions/Icons";
import { deleteCustomer } from "@/app/ServerFunctions/database/dbOperations/customers";
import dataClient from "@/app/ServerFunctions/database";
import sxStyles from "./sxStyles";
import { useQuery } from "@tanstack/react-query";

const styles = stylesExporter.dialogs;

const initialCustomer: Customer.Customer = {
    firstName: "",
    lastName: "",
    company: "",
    email: "",
};

const initialData: Campaign.Campaign = {
    id: "",
    campaignTimelineEvents: [],
    assignedInfluencers: [],
    customers: [initialCustomer],
    billingAdress: {
        name: "",
        street: "",
        city: "",
        zip: "",
    },
    projectManagers: [],
} as const;
type CampaignDialogProps = DialogProps<Campaign.Campaign[], Campaign.Campaign>;

function CampaignDialog(props: CampaignDialogProps) {
    //##################
    //#region Prop Destructuring
    const { isOpen = false, onClose, editing, editingData, parent: rows, setParent: setRows } = props;
    //#endregion Prop Destructuring
    //##################

    //##################
    //#region States
    const [campaign, setCampaign] = useState<Campaign.Campaign>(initialData);
    const [changedData, setChangedData] = useState<Partial<Campaign.Campaign>>(editingData ?? {});
    const [customers, setCustomers] = useState<Partial<Customer.Customer>[]>(editingData?.customers ?? [{}]);
    const [billingAdress, setBillingAdress] = useState<Campaign.BillingAdress>({
        name: "",
        street: "",
        city: "",
        zip: "",
    });
    //#endregion States
    //##################

    //##################
    //#region Queries
    const projectManager = useQuery({
        queryKey: ["projectManager"],
        queryFn: async () => {
            return await dataClient.projectManager.list();
        },
    });

    //##################
    //#region Effects
    useEffect(() => {
        return () => setCampaign(initialData);
    }, []);
    useEffect(() => {
        // console.log(campaign);
        // console.log({ isWebinar: Campaign.isWebinar(campaign) });

        return () => {};
    }, [campaign]);
    //#endregion Effects
    //##################

    //##################
    //#region Functions

    const EventHandlers = {
        handleClose: (hasChanged?: boolean) => {
            if (onClose) {
                onClose(hasChanged);
            }
            // setIsModalOpen(false);
        },

        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const projectManagerId = projectManager.data?.[0].id;
            if (!projectManagerId) {
                alert("Projektmanager nicht gefunden, bitte versuchen Sie es erneut");
                return;
            }
            //TODO Check if all customers are valid
            const checkedCustomers = customers as Customer.Customer[];

            //Assemble Campaign Object
            const assembledCampaign = {
                ...campaign,
                billingAdress,
                customers: checkedCustomers,
            } satisfies Campaign.Campaign;
            console.log(assembledCampaign);

            dataClient.campaign.create({ campaign: assembledCampaign, projectManagerId });
            EventHandlers.handleClose(true);
        },

        handleDateChange: (newValue: Dayjs | null, context: PickerChangeHandlerContext<DateTimeValidationError>) => {
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
        },
    };

    //#endregion Functions
    //##################

    //##################
    //#region Query States

    //#endregion
    //##################
    if (!projectManager.data)
        return (
            <Dialog open>
                <CircularProgress />
            </Dialog>
        );
    return (
        <Dialog
            // ref={modalRef}
            open={isOpen}
            // className={styles.dialog}
            onClose={() => EventHandlers.handleClose(false)}
            PaperProps={{
                component: "form",
                onSubmit: EventHandlers.onSubmit,
            }}
            sx={sxStyles.DialogDefault}
        >
            <Box>
                <DialogTitle>{"Neue Kampagne"}</DialogTitle>
                <FormContent
                    customers={customers}
                    setCustomers={setCustomers}
                    campaign={campaign}
                    setCampaign={setCampaign}
                    billingAdress={billingAdress}
                    setBillingAdress={setBillingAdress}
                />
                <DialogActions>
                    <Button onClick={() => EventHandlers.handleClose(false)} color="secondary">
                        Abbrechen
                    </Button>
                    <Button variant="contained" type="submit">
                        Speichern
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
export default CampaignDialog;

interface FormContentProps {
    customers: Partial<Customer.Customer>[];
    setCustomers: React.Dispatch<React.SetStateAction<Partial<Customer.Customer>[]>>;
    campaign: Campaign.Campaign;
    setCampaign: React.Dispatch<React.SetStateAction<Campaign.Campaign>>;
    billingAdress: Campaign.BillingAdress;
    setBillingAdress: React.Dispatch<React.SetStateAction<Campaign.BillingAdress>>;
}

function FormContent(props: FormContentProps) {
    const { customers, setCustomers, campaign, setCampaign, billingAdress, setBillingAdress } = props;

    const [tab, setTab] = useState("0");
    const EventHandlers = {
        handleTabChange: () => (event: React.SyntheticEvent, newValue: string) => {
            setTab(newValue);
        },
        addCustomer: () => {
            setCustomers((prevState) => {
                return [...prevState, {}];
            });
            setTab((prevState) => (customers.length - 1).toString());
        },
    };
    const StateChanges = {
        handleCustomerChange: (changedData: Partial<Customer.Customer>, index = 0) => {
            setCustomers((prevState) => {
                const newCustomers = [...prevState];
                const prevcustomer = newCustomers[index];
                newCustomers[index] = { ...prevcustomer, ...changedData };
                return newCustomers;
            });
        },
        deleteCustomer: (index: number) => {
            if (customers.length <= 1) return;
            setTab("0");
            setCustomers((prevState) => {
                const newCustomers = [...prevState];
                newCustomers.splice(index, 1);
                return newCustomers;
            });
        },
    };
    return (
        <Box>
            <DialogContent
            // sx={{ "& .MuiFormControl-root:has(#customerEmail)": { flexBasis: "100%" } }}
            >
                <DialogContentText>Kunde</DialogContentText>
                <TabContext value={tab}>
                    <TabList onChange={EventHandlers.handleTabChange()}>
                        {customers.map((customer, index) => (
                            <Tab
                                key={index}
                                value={index.toString()}
                                label={index === 0 ? "Hauptkontakt" : `Vertretung ${index}`}
                            />
                        ))}
                        <IconButton onClick={EventHandlers.addCustomer}>
                            <AddIcon />
                        </IconButton>
                    </TabList>
                    {/* <IconButton onClick={EventHandler.addSubstitute}>
                <AddIcon />
            </IconButton> */}
                    {customers.map((customer, index) => {
                        return (
                            <TabPanel key={index} value={index.toString()}>
                                <CustomerDialogContent
                                    customer={customer}
                                    setCustomer={(changedData) => StateChanges.handleCustomerChange(changedData, index)}
                                    deleteCustomer={() => StateChanges.deleteCustomer(index)}
                                    index={index}
                                />
                            </TabPanel>
                        );
                    })}
                </TabContext>
            </DialogContent>
            <DialogContent>
                <DialogContentText>Budget</DialogContentText>
                <BudgetInfo campaign={campaign} setCampaign={setCampaign} />
            </DialogContent>
            <DialogContent>
                <DialogContentText>Rechnungsadresse</DialogContentText>
                <BillingAdressInfo billingAdress={billingAdress} setBillingAdress={setBillingAdress} />
            </DialogContent>
        </Box>
    );
}
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
        <DialogContent>
            <TextField
                name="name"
                label="Name"
                value={billingAdress.name}
                onChange={handleChange}
                // fullWidth
                className={styles.TextField}
                variant="standard"
            />
            <TextField
                name="street"
                label="Straße"
                value={billingAdress.street}
                onChange={handleChange}
                // fullWidth
                className={styles.TextField}
                variant="standard"
            />
            <TextField
                name="city"
                label="Stadt"
                value={billingAdress.city}
                onChange={handleChange}
                // fullWidth
                className={styles.TextField}
                variant="standard"
            />
            <TextField
                name="zip"
                label="PLZ"
                value={billingAdress.zip}
                onChange={handleChange}
                // fullWidth
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
        <DialogContent>
            <TextField
                name="budget"
                label="Budget"
                type="number"
                value={campaign.budget ?? ""}
                onChange={handleChange}
                // fullWidth
                className={styles.TextField}
                variant="standard"
            />
        </DialogContent>
    );
}
