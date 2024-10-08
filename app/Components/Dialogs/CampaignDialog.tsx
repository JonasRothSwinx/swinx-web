import { Campaign, Campaigns, Customer } from "@/app/ServerFunctions/types";
import { dayjs, Dayjs } from "@/app/utils";
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
import React, { ChangeEvent, useEffect, useState } from "react";
import { CustomerDialogContent } from "./CustomerDialog";
import { Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { AddIcon } from "@/app/Definitions/Icons";
import { dataClient } from "@dataClient";
import sxStyles from "./sxStyles";
import { useQuery } from "@tanstack/react-query";
import { TextFieldWithTooltip } from "./Components";
import { useRouter } from "next/navigation";

const initialCustomer: Customer = {
    firstName: "",
    lastName: "",
    company: "",
    email: "",
};

const initialData: Campaign = {
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

type CampaignDialogProps = {
    onClose?: (hasChanged?: boolean) => void;
    editing?: boolean;
    editingData?: Campaign;
    // parent: Campaign[];
    isOpen?: boolean;
};
export function CampaignDialog({ isOpen = false, onClose, editing, editingData }: CampaignDialogProps) {
    const router = useRouter();
    //##################
    //#region States
    const [campaign, setCampaign] = useState<Campaign>(initialData);
    const [customers, setCustomers] = useState<Partial<Customer>[]>(editingData?.customers ?? [{}]);
    const [billingAdress, setBillingAdress] = useState<Campaigns.BillingAdress>({
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
            return await dataClient.projectManager.getForUser();
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

        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const projectManagerId = projectManager.data?.id;
            if (!projectManagerId) {
                alert("Projektmanager nicht gefunden, bitte versuchen Sie es erneut");
                return;
            }
            //TODO Check if all customers are valid
            const checkedCustomers = customers as Customer[];

            //Assemble Campaign Object
            const assembledCampaign = {
                ...campaign,
                billingAdress,
                customers: checkedCustomers,
            } satisfies Campaign;
            console.log(assembledCampaign);

            const createdCampaign = await dataClient.campaign.create({
                campaign: assembledCampaign,
                projectManagerId,
            });
            router.push(`/campaign/${createdCampaign.id}`);
            router.refresh();

            // EventHandlers.handleClose(true);
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
                    } satisfies Campaign;
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
            className="dialog"
            onClose={(event, reason) => {
                if (reason === "backdropClick" || reason === "escapeKeyDown") return;
                EventHandlers.handleClose(false);
            }}
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

interface FormContentProps {
    customers: Partial<Customer>[];
    setCustomers: React.Dispatch<React.SetStateAction<Partial<Customer>[]>>;
    campaign: Campaign;
    setCampaign: React.Dispatch<React.SetStateAction<Campaign>>;
    billingAdress: Campaigns.BillingAdress;
    setBillingAdress: React.Dispatch<React.SetStateAction<Campaigns.BillingAdress>>;
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
        handleCustomerChange: (changedData: Partial<Customer>, index = 0) => {
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
    billingAdress: Campaigns.BillingAdress;
    setBillingAdress: React.Dispatch<React.SetStateAction<Campaigns.BillingAdress>>;
}
function BillingAdressInfo(props: InfoProps) {
    const { billingAdress, setBillingAdress } = props;
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setBillingAdress((prevState) => {
            return {
                ...prevState,
                [name]: value,
            } satisfies Campaigns.BillingAdress;
        });
    };
    return (
        <DialogContent>
            <TextFieldWithTooltip
                name="name"
                label="Empfänger"
                value={billingAdress.name}
                onChange={handleChange}
                // fullWidth
                className={"textField"}
                variant="standard"
            />
            <TextFieldWithTooltip
                name="street"
                label="Straße"
                value={billingAdress.street}
                onChange={handleChange}
                // fullWidth
                className={"textField"}
                variant="standard"
            />
            <TextFieldWithTooltip
                name="city"
                label="Stadt"
                value={billingAdress.city}
                onChange={handleChange}
                // fullWidth
                className={"textField"}
                variant="standard"
            />
            <TextFieldWithTooltip
                name="zip"
                label="PLZ"
                value={billingAdress.zip}
                onChange={handleChange}
                // fullWidth
                className={"textField"}
                variant="standard"
            />
        </DialogContent>
    );
}

interface BudgetinfoProps {
    campaign: Campaign;
    setCampaign: React.Dispatch<React.SetStateAction<Campaign>>;
}

function BudgetInfo(props: BudgetinfoProps) {
    const { campaign, setCampaign } = props;
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCampaign((prevState) => {
            return {
                ...prevState,
                [name]: value,
            } satisfies Campaign;
        });
    };
    return (
        <DialogContent>
            <TextFieldWithTooltip
                name="budget"
                label="Budget"
                type="number"
                value={campaign.budget ?? ""}
                onChange={handleChange}
                // fullWidth
                className={"textField"}
                variant="standard"
                InputProps={{
                    inputProps: { min: 0, style: { textAlign: "right" } },
                    endAdornment: "€",
                    style: { textAlign: "right" },
                }}
                tooltipProps={{
                    title: "Gesamtbudget für alle Webinare dieser Kampagne",
                }}
            />
        </DialogContent>
    );
}
