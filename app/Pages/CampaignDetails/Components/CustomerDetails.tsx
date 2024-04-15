import { DialogConfig, DialogOptions } from "@/app/Definitions/types";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Customer from "@/app/ServerFunctions/types/customer";
import { MouseEvent, SyntheticEvent, useEffect, useState } from "react";
import CustomerDialog, { CustomerDialogContent } from "../../Dialogs/CustomerDialog";
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Tab } from "@mui/material";
import stylesExporter from "../../styles/stylesExporter";
import { AddIcon, EditIcon, ExpandMoreIcon, MailIcon } from "@/app/Definitions/Icons";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const styles = stylesExporter.campaignDetails;

type CustomerDetailsProps = {
    customers: Customer.Customer[];
    campaign: Campaign.Campaign;
    setCampaign: (data: Campaign.Campaign) => void;
};
type CustomerData = (
    | { name: string; value: string; insertAfter?: JSX.Element; insertBefore?: JSX.Element }
    | "spacer"
    | null
)[];
function getCustomerData(customers: Customer.Customer[]): CustomerData[] {
    const data = customers.map((customer) => {
        return [
            { name: "Firma", value: customer.company },
            "spacer",
            { name: "Kontakt", value: `${customer.firstName} ${customer.lastName}` },
            customer.companyPosition ? { name: "", value: `(${customer.companyPosition})` } : null,
            {
                name: "",
                value: customer.email,
                insertBefore: (
                    <a href={`mailto:${customer.email}`} rel="noreferrer" target="_blank">
                        <MailIcon />
                    </a>
                ),
            },
        ] satisfies CustomerData;
    });
    return data;
}
type openDialog = "none" | "editCustomer";

export default function CustomerDetails(props: CustomerDetailsProps) {
    const { campaign, setCampaign } = props;
    //######################
    //#region State
    const [customers, setCustomers] = useState<Partial<Customer.Customer>[]>(props.customers);
    const [customerData, setCustomerData] = useState<CustomerData[]>(
        getCustomerData(props.customers),
    );
    const [openDialog, setOpenDialog] = useState<openDialog>("none");
    const [tab, setTab] = useState("0");
    //#endregion
    //######################

    useEffect(() => {
        setCustomerData(getCustomerData(props.customers));
        return () => {};
    }, [props.customers]);

    const EventHandler = {
        onDialogClose: () => {
            setOpenDialog("none");
            DataHandler.setCustomers(customers);
        },
        editButtonClicked: (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenDialog("editCustomer");
        },
        handleTabChange: () => (e: SyntheticEvent, newValue: string) => {
            setTab(newValue);
        },
    };

    const DataHandler = {
        setCustomers: (data: Partial<Customer.Customer>[]) => {
            //verify data qualifies foor full object
            const verifiedData = data.map((x) => {
                if (Customer.satisfies(x)) return x;
                throw new Error("Invalid data");
            });
            setCampaign({ ...campaign, customers: verifiedData });
        },
    };

    const Dialogs: { [key in openDialog]: JSX.Element | null } = {
        none: null,
        editCustomer: (
            <CustomerDialog
                customers={customers}
                editing={true}
                setCustomers={setCustomers}
                editingData={customers}
                onClose={EventHandler.onDialogClose}
            />
        ),
    };
    return (
        <>
            {Dialogs[openDialog]}
            <Accordion defaultExpanded disableGutters variant="outlined">
                <AccordionSummary
                    className={styles.summaryWithEdit}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{
                        "& .MuiAccordionSummary-content:not(.Mui-expanded) button": {
                            display: "none",
                        },
                    }}
                >
                    <div className={styles.summaryWithEdit}>
                        Auftraggeber
                        <IconButton
                            className="textPrimary"
                            onClick={EventHandler.editButtonClicked}
                            color="inherit"
                        >
                            <EditIcon />
                        </IconButton>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <TabContext value={tab}>
                        <TabList onChange={EventHandler.handleTabChange()}>
                            {customerData.map((_, index) => (
                                <Tab
                                    key={index}
                                    value={index.toString()}
                                    label={index === 0 ? "Hauptkontakt" : `Vertretung ${index}`}
                                />
                            ))}
                        </TabList>
                        {/* <IconButton onClick={EventHandler.addSubstitute}>
                <AddIcon />
            </IconButton> */}
                        {customerData.map((dataSet, index) => {
                            return (
                                <TabPanel key={index} value={index.toString()}>
                                    {dataSet.map((data, i) => {
                                        if (!data) return null;
                                        if (data === "spacer") {
                                            return (
                                                <div
                                                    style={{
                                                        height: "1em",
                                                        borderTop: "1px solid black",
                                                    }}
                                                    key={`spacer${i}`}
                                                />
                                            );
                                        }
                                        return (
                                            <Grid key={i + data.name} container columnSpacing={8}>
                                                <Grid xs={4} display="flex" justifyContent="left">
                                                    {data.name}
                                                </Grid>
                                                <Grid
                                                    xs="auto"
                                                    display="flex"
                                                    justifyContent="left"
                                                >
                                                    {data.insertBefore}
                                                    {data.value}
                                                    {data.insertAfter}
                                                </Grid>
                                            </Grid>
                                        );
                                    })}
                                </TabPanel>
                            );
                        })}
                    </TabContext>
                </AccordionDetails>
            </Accordion>
        </>
    );
}
