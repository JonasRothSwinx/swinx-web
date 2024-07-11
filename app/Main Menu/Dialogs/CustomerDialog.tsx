import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
} from "@mui/material";
import { Customer, Customers } from "@/app/ServerFunctions/types";
import React, { ChangeEvent, useEffect, useState } from "react";
import stylesExporter from "../styles/stylesExporter";
import { dataClient } from "@/app/ServerFunctions/database";
import { Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { AddIcon } from "@/app/Definitions/Icons";
import sxStyles from "./sxStyles";

const styles = stylesExporter.dialogs;
interface InfoProps {
    customer: Partial<Customer>;
    setCustomer: (changedData: Partial<Customer>, index?: number) => void;
    deleteCustomer: () => void;
    index: number;
}
interface CustomerDialogProps {
    customers: Partial<Customer>[];
    editing: boolean;
    editingData?: Partial<Customer>[];
    setCustomers: React.Dispatch<React.SetStateAction<Partial<Customer>[]>>;
    onClose?: (hasChanged: boolean) => void;
}

function CustomerDialog(props: CustomerDialogProps) {
    // debugger;
    //##################
    //#region Variables
    const { onClose, editing, editingData, setCustomers, customers } = props;
    //#endregion Variables
    //##################

    //##################
    //#region State
    const [changedData, setChangedData] = useState<Partial<Customer>[]>(editingData ?? customers);

    //#endregion
    //##################

    //##################
    //#region Event Handlers
    const EventHandlers = {
        handleClose: (hasChanged = false) => {
            return () => {
                if (onClose) {
                    onClose(hasChanged);
                }
            };
        },
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!changedData) return;
            if (editing) {
                // console.log({ changedData });
                dataClient.customer;
            } else {
                //check required properties
                Customers.satisfies(changedData);
                // customers.create(changedData);
            }
            EventHandlers.handleClose(true)();
        },
    };

    //#endregion Event Handlers
    //##################
    return (
        <Dialog
            open
            className={styles.dialog}
            onClose={EventHandlers.handleClose()}
            PaperProps={{
                component: "form",
                onSubmit: EventHandlers.onSubmit,
            }}
            sx={sxStyles.DialogDefault}
        >
            <DialogTitle textAlign={"center"}>{"Kunde"}</DialogTitle>
            {/* <button onClick={handleCloseModal}>x</button> */}
            <FormContent
                customers={changedData}
                setCustomers={setChangedData}
                editing={editing}
                editingData={editingData}
                changedData={changedData}
                setChangedData={setChangedData}
            />
            <DialogActions
                sx={{
                    justifyContent: "space-between",
                }}
            >
                <Button
                    onClick={EventHandlers.handleClose(false)}
                    color="secondary"
                >
                    Abbrechen
                </Button>
                <Button
                    variant="contained"
                    type="submit"
                >
                    Speichern
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CustomerDialog;

const initialSubstitute: Customer = {
    firstName: "",
    lastName: "",
    email: "",
    company: "",
};
interface FormContentProps {
    customers: Partial<Customer>[];
    setCustomers: React.Dispatch<React.SetStateAction<Partial<Customer>[]>>;
    editing: boolean;
    editingData?: Partial<Customer>[];
    changedData: Partial<Customer>[];
    setChangedData: React.Dispatch<React.SetStateAction<Partial<Customer>[]>>;
}
function FormContent(props: FormContentProps) {
    const { customers, setCustomers, editing, editingData, changedData, setChangedData } = props;
    const [tab, setTab] = useState("0");
    const EventHandlers = {
        handleTabChange: () => (event: React.SyntheticEvent, newValue: string) => {
            setTab(newValue);
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
            <TabContext value={tab}>
                <TabList onChange={EventHandlers.handleTabChange()}>
                    {changedData.map((customer, index) => (
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
                {changedData.map((customer, index) => {
                    return (
                        <TabPanel
                            key={index}
                            value={index.toString()}
                        >
                            <CustomerDialogContent
                                customer={customer}
                                setCustomer={(changedData) =>
                                    StateChanges.handleCustomerChange(changedData, index)
                                }
                                deleteCustomer={() => StateChanges.deleteCustomer(index)}
                                index={index}
                            />
                        </TabPanel>
                    );
                })}
            </TabContext>
        </Box>
    );
}

export function CustomerDialogContent(props: InfoProps) {
    //##################
    //#region prop destructuring
    const { customer, setCustomer, index, deleteCustomer } = props;

    //#endregion prop destructuring
    //##################

    //##################
    //#region State

    //#endregion State
    //##################

    //##################
    //#region Event Handlers
    const EventHandler = {};
    //#endregion Event Handlers
    //##################
    return (
        <DialogContent>
            <ContactInfo {...props} />
            <Box />
            <JobInfo {...props} />
            {index > 0 && <Button onClick={() => deleteCustomer()}>Vertretung löschen</Button>}
        </DialogContent>
    );
}

/**
 * ContactInfo
 * Fields:
 *  firstName   - required
 *  lastName    - required
 *  email       - required
 *  phone       - optional
 */
function ContactInfo(props: InfoProps) {
    const { customer, setCustomer, index } = props;
    const ChangeHandlers = {
        firstName: (e: ChangeEvent<HTMLInputElement>) => {
            setCustomer({ firstName: e.target.value }, index);
        },
        lastName: (e: ChangeEvent<HTMLInputElement>) => {
            setCustomer({ lastName: e.target.value }, index);
        },
        email: (e: ChangeEvent<HTMLInputElement>) => {
            setCustomer({ email: e.target.value }, index);
        },
        phone: (e: ChangeEvent<HTMLInputElement>) => {
            setCustomer({ phoneNumber: e.target.value }, index);
        },
        companyLink: (e: ChangeEvent<HTMLInputElement>) => {
            setCustomer({ profileLink: e.target.value }, index);
        },
    };

    return (
        <>
            <TextField
                autoFocus
                id="customerNameFirst"
                name="customerNameFirst"
                className={styles.TextField}
                label="Vorname"
                type="text"
                value={customer.firstName ?? ""}
                onChange={ChangeHandlers.firstName}
                variant="standard"
                // fullWidth
                required
            />

            <TextField
                id="customerNameLast"
                name="customerNameLast"
                className={styles.TextField}
                label="Nachname"
                type="text"
                value={customer.lastName ?? ""}
                onChange={ChangeHandlers.lastName}
                variant="standard"
                // fullWidth
                required
            />
            <TextField
                id="customerEmail"
                name="customerEmail"
                className={styles.TextField}
                label="E-Mail"
                type="email"
                value={customer.email ?? ""}
                onChange={ChangeHandlers.email}
                variant="standard"
                // fullWidth
                required
            />
            <TextField
                id="customerPhone"
                name="customerPhone"
                className={styles.TextField}
                label="Telefon"
                type="tel"
                value={customer.phoneNumber ?? ""}
                onChange={ChangeHandlers.phone}
                // fullWidth
                variant="standard"
            />
            {index === 0 && (
                <TextField
                    id="customerCompanyLink"
                    name="customerCompanyLink"
                    className={styles.TextField}
                    label="LinkedIn Company Link"
                    type="url"
                    value={customer.profileLink ?? ""}
                    onChange={ChangeHandlers.companyLink}
                    fullWidth
                    variant="standard"
                    required
                />
            )}
        </>
    );
}

/**
 * JobInfo
 * Fields:
 * company         - required
 * companyPosition - optional
 */

function JobInfo(props: InfoProps) {
    const { customer: changedData, setCustomer: setChangedData, index } = props;

    const ChangeHandler = {
        company: (e: ChangeEvent<HTMLInputElement>) => {
            setChangedData({ company: e.target.value }, index);
        },
        companyPosition: (e: ChangeEvent<HTMLInputElement>) => {
            setChangedData({ companyPosition: e.target.value }, index);
        },
    };
    return (
        <>
            <TextField
                id="customerCompany"
                name="customerCompany"
                className={styles.TextField}
                label="Firma"
                type="text"
                value={changedData.company ?? ""}
                onChange={ChangeHandler.company}
                variant="standard"
                required
            />
            <TextField
                id="customerPosition"
                name="customerPosition"
                className={styles.TextField}
                label="Position in Firma"
                type="text"
                value={changedData.companyPosition ?? ""}
                onChange={ChangeHandler.companyPosition}
                variant="standard"
            />
        </>
    );
}
