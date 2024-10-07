import { Campaign, Customer, Customers } from "@/app/ServerFunctions/types";
import React, { MouseEvent, SyntheticEvent, useEffect, useState } from "react";
import { CustomerDialog } from "@/app/Components/Dialogs";
import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Link, SxProps, Tab } from "@mui/material";
import { AddIcon, EditIcon, ExpandMoreIcon, MailIcon } from "@/app/Definitions/Icons";
import Grid from "@mui/material/Grid2/Grid2";
import { TabContext, TabList, TabPanel } from "@mui/lab";

type CustomerDetailsProps = {
    customers: Customer[];
    campaign: Campaign;
    setCampaign: (data: Campaign) => void;
};
type CustomerData = (
    | { name: string; value: string; insertAfter?: React.JSX.Element; insertBefore?: React.JSX.Element }
    | "spacer"
    | null
)[];
function getCustomerData(customers: Customer[]): CustomerData[] {
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
                    <Link href={`mailto:${customer.email}`} rel="noreferrer" target="_blank">
                        <MailIcon />
                    </Link>
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
    const [customers, setCustomers] = useState<Partial<Customer>[]>(props.customers);
    const [customerData, setCustomerData] = useState<CustomerData[]>(getCustomerData(props.customers));
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
        setCustomers: (data: Partial<Customer>[]) => {
            //verify data qualifies foor full object
            const verifiedData = data.map((x) => {
                if (Customers.satisfies(x)) return x;
                throw new Error("Invalid data");
            });
            setCampaign({ ...campaign, customers: verifiedData });
        },
    };

    const Dialogs: { [key in openDialog]: React.JSX.Element | null } = {
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
    const sx: SxProps = {
        "& .summaryWithEdit": {
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
    };
    return (
        <>
            {Dialogs[openDialog]}
            <Accordion defaultExpanded disableGutters variant="outlined">
                <AccordionSummary
                    className={"summaryWithEdit"}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    // sx={{
                    //     "& .MuiAccordionSummary-content:not(.Mui-expanded) button": {
                    //         display: "none",
                    //     },
                    // }}
                >
                    <Box className={"summaryWithEdit"}>
                        Auftraggeber
                        <IconButton className="textPrimary" onClick={EventHandler.editButtonClicked} color="inherit">
                            <EditIcon />
                        </IconButton>
                    </Box>
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
                                                <Grid size={4} display="flex" justifyContent="left">
                                                    {data.name}
                                                </Grid>
                                                <Grid size="auto" display="flex" justifyContent="left">
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
