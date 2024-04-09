import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { DialogProps } from "@/app/Definitions/types";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Customer from "@/app/ServerFunctions/types/customer";
import React, { ChangeEvent, useEffect, useState } from "react";
import stylesExporter from "../styles/stylesExporter";
import dataClient from "@/app/ServerFunctions/database";
import { Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { AddIcon } from "@/app/Definitions/Icons";

const styles = stylesExporter.dialogs;
type DialogType = Customer.Customer;

// const initialData: DialogType = {
//     firstName: "",
//     lastName: "",
//     company: "",
//     email: "",
//     companyPosition: "",
// };
type CustomerDialogProps = DialogProps<Campaign.Campaign, Customer.Customer>;
function CustomerDialog(props: CustomerDialogProps) {
    // debugger;
    const { onClose, parent: campaign, setParent: setCampaign, isOpen = true, editing, editingData } = props;
    const [changedData, setChangedData] = useState<Partial<Customer.Customer>>(
        editingData ?? { substitutes: [{ ...initialSubstitute }] }
    );

    // const [isModalOpen, setIsModalOpen] = useState(isOpen);
    // useEffect(() => {
    //     // console.log({ isOpen, editingData });
    //     setChangedData(editingData ?? "");
    //     return () => {
    //         setChangedData(initialData);
    //     };
    // }, [props, editingData]);

    function handleClose(hasChanged?: boolean) {
        return () => {
            if (onClose) {
                onClose(hasChanged);
            }
            setChangedData({ substitutes: [{ ...initialSubstitute }] });
        };
        // setIsModalOpen(false);
    }

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!changedData) return;
        if (editing) {
            // console.log({ changedData });
            dataClient.customer;
        } else {
            //check required properties
            Customer.satisfies(changedData);
            // customers.create(changedData);
        }
        handleClose(true)();
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
    const InfoProps: InfoProps = { customer: changedData, setCustomer: setChangedData };
    return (
        <Dialog
            // ref={modalRef}
            open={isOpen}
            className={styles.dialog}
            onClose={handleClose(false)}
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
            <DialogTitle textAlign={"center"}>{"Kunde"}</DialogTitle>
            {/* <button onClick={handleCloseModal}>x</button> */}

            <ContactInfo {...InfoProps} />
            <JobInfo {...InfoProps} />

            <DialogActions
                sx={{
                    justifyContent: "space-between",
                }}
            >
                <Button onClick={handleClose(false)} color="secondary">
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
interface InfoProps {
    customer: Partial<Customer.Customer>;
    setCustomer: React.Dispatch<React.SetStateAction<Partial<Customer.Customer>>>;
    isSubstitute?: boolean;
    substituteIndex?: number;
}
const initialSubstitute: Customer.Customer = {
    firstName: "",
    lastName: "",
    email: "",
    company: "",
};

export function CustomerDialogContent(props: InfoProps) {
    const { customer, setCustomer } = props;
    const [tab, setTab] = useState("main");

    const EventHandler = {
        handleChange: () => (event: React.SyntheticEvent, newValue: string) => {
            if (newValue === "new") {
                EventHandler.addSubstitute();
                setTab("main");
                return;
            }
            setTab(newValue);
        },
        addSubstitute: () => {
            setCustomer((prev) => {
                if (!prev.substitutes) {
                    prev.substitutes = [];
                }
                if (prev.substitutes.length >= 2) return prev;

                prev.substitutes.push({ ...initialSubstitute, company: prev.company ?? "" });
                console.log(prev.substitutes);
                setTab((prev) => prev.toString());
                return prev;
            });
        },
    };
    return (
        <TabContext value={tab}>
            <TabList onChange={EventHandler.handleChange()}>
                <Tab value="main" label="Hauptkontakt" />
                {customer.substitutes?.map((substitute, index) => (
                    <Tab key={index} value={index.toString()} label={`Vertretung ${index + 1}`} />
                ))}
            </TabList>
            {/* <IconButton onClick={EventHandler.addSubstitute}>
                <AddIcon />
            </IconButton> */}
            <TabPanel value="main">
                <DialogContent>
                    <ContactInfo {...props} />
                    <JobInfo {...props} />
                </DialogContent>
            </TabPanel>
            {customer.substitutes?.map((substitute, index) => {
                return (
                    <TabPanel key={index} value={index.toString()}>
                        <DialogContent>
                            <ContactInfo
                                {...{ customer: substitute, setCustomer, isSubstitute: true, substituteIndex: index }}
                            />
                            <JobInfo
                                {...{ customer: substitute, setCustomer, isSubstitute: true, substituteIndex: index }}
                            />
                        </DialogContent>
                    </TabPanel>
                );
            })}
        </TabContext>
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
    const { customer, setCustomer, isSubstitute = false, substituteIndex } = props;
    const ChangeHandlers = {
        firstName: (e: ChangeEvent<HTMLInputElement>) => {
            if (isSubstitute && substituteIndex !== undefined) {
                setCustomer((prev) => ({
                    ...prev,
                    substitutes: prev.substitutes?.map((substitute, index) => {
                        if (index === substituteIndex) {
                            return {
                                ...substitute,
                                firstName: e.target.value,
                            };
                        }
                        return substitute;
                    }),
                }));
                return;
            }
            setCustomer((prev) => ({
                ...prev,
                firstName: e.target.value,
            }));
        },
        lastName: (e: ChangeEvent<HTMLInputElement>) => {
            if (isSubstitute && substituteIndex !== undefined) {
                setCustomer((prev) => ({
                    ...prev,
                    substitutes: prev.substitutes?.map((substitute, index) => {
                        if (index === substituteIndex) {
                            return {
                                ...substitute,
                                lastName: e.target.value,
                            };
                        }
                        return substitute;
                    }),
                }));
                return;
            }
            setCustomer((prev) => ({
                ...prev,
                lastName: e.target.value,
            }));
        },
        email: (e: ChangeEvent<HTMLInputElement>) => {
            if (isSubstitute && substituteIndex !== undefined) {
                setCustomer((prev) => ({
                    ...prev,
                    substitutes: prev.substitutes?.map((substitute, index) => {
                        if (index === substituteIndex) {
                            return {
                                ...substitute,
                                email: e.target.value,
                            };
                        }
                        return substitute;
                    }),
                }));
                return;
            }
            setCustomer((prev) => ({
                ...prev,
                email: e.target.value,
            }));
        },
        phone: (e: ChangeEvent<HTMLInputElement>) => {
            if (isSubstitute && substituteIndex !== undefined) {
                setCustomer((prev) => ({
                    ...prev,
                    substitutes: prev.substitutes?.map((substitute, index) => {
                        if (index === substituteIndex) {
                            return {
                                ...substitute,
                                phoneNumber: e.target.value,
                            };
                        }
                        return substitute;
                    }),
                }));
                return;
            }
            setCustomer((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
            }));
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
    const { customer: changedData, setCustomer: setChangedData, isSubstitute, substituteIndex } = props;

    const ChangeHandler = {
        company: (e: ChangeEvent<HTMLInputElement>) => {
            if (isSubstitute && substituteIndex !== undefined) {
                setChangedData((prev) => ({
                    ...prev,
                    substitutes: prev.substitutes?.map((substitute, index) => {
                        if (index === substituteIndex) {
                            return {
                                ...substitute,
                                company: e.target.value,
                            };
                        }
                        return substitute;
                    }),
                }));
                return;
            }
            setChangedData((prev) => ({
                ...prev,
                company: e.target.value,
            }));
        },
        companyPosition: (e: ChangeEvent<HTMLInputElement>) => {
            if (isSubstitute && substituteIndex !== undefined) {
                setChangedData((prev) => ({
                    ...prev,
                    substitutes: prev.substitutes?.map((substitute, index) => {
                        if (index === substituteIndex) {
                            return {
                                ...substitute,
                                companyPosition: e.target.value,
                            };
                        }
                        return substitute;
                    }),
                }));
                return;
            }
            setChangedData((prev) => ({
                ...prev,
                companyPosition: e.target.value,
            }));
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
