import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { DialogProps } from "@/app/Definitions/types";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Customer from "@/app/ServerFunctions/types/customer";
import React, { ChangeEvent, useEffect, useState } from "react";
import stylesExporter from "../styles/stylesExporter";
import { customers } from "@/app/ServerFunctions/dbInterface";

const styles = stylesExporter.dialogs;
type DialogType = Customer.Customer;

const initialData: DialogType = {
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    companyPosition: "",
};
type CustomerDialogProps = DialogProps<Campaign.Campaign, Customer.Customer>;
function CustomerDialog(props: CustomerDialogProps) {
    // debugger;
    const { onClose, parent: campaign, setParent: setCampaign, isOpen = true, editing, editingData } = props;
    const [customer, setCustomer] = useState(editingData);

    // const [isModalOpen, setIsModalOpen] = useState(isOpen);
    useEffect(() => {
        // console.log({ isOpen, editingData });
        setCustomer(editingData);
        return () => {
            setCustomer(initialData);
        };
    }, [props, editingData]);

    function handleClose(hasChanged?: boolean) {
        return () => {
            setCustomer(initialData);
            if (onClose) {
                onClose(hasChanged);
            }
        };
        // setIsModalOpen(false);
    }

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!customer) return;
        customers.update(customer);
        const newCampaign = { ...campaign, customer };
        setCampaign({ ...newCampaign });
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
                    defaultValue={customer?.id ?? ""}
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
                    value={customer?.firstName ?? ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setCustomer(
                            (prev) =>
                                ({
                                    ...(prev ?? initialData),
                                    firstName: e.target.value,
                                } satisfies Customer.Customer)
                        );
                    }}
                    required
                />

                <TextField
                    id="customerNameLast"
                    name="customerNameLast"
                    className={styles.TextField}
                    label="Nachname"
                    type="text"
                    value={customer?.lastName ?? ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setCustomer(
                            (prev) =>
                                ({
                                    ...(prev ?? initialData),
                                    lastName: e.target.value,
                                } satisfies Customer.Customer)
                        );
                    }}
                    required
                />
                <TextField
                    id="customerEmail"
                    name="customerEmail"
                    className={styles.TextField}
                    label="E-Mail"
                    type="email"
                    value={customer?.email ?? ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setCustomer(
                            (prev) =>
                                ({
                                    ...(prev ?? initialData),
                                    email: e.target.value,
                                } satisfies Customer.Customer)
                        );
                    }}
                    required
                />
                <TextField
                    autoFocus
                    id="customerCompany"
                    name="customerCompany"
                    className={styles.TextField}
                    label="Firma"
                    type="text"
                    value={customer?.company ?? ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setCustomer(
                            (prev) =>
                                ({
                                    ...(prev ?? initialData),
                                    company: e.target.value,
                                } satisfies Customer.Customer)
                        );
                    }}
                />
                <TextField
                    autoFocus
                    id="customerPosition"
                    name="customerPosition"
                    className={styles.TextField}
                    label="Position in Firma"
                    type="text"
                    value={customer?.companyPosition ?? ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setCustomer(
                            (prev) =>
                                ({
                                    ...(prev ?? initialData),
                                    companyPosition: e.target.value,
                                } satisfies Customer.Customer)
                        );
                    }}
                />
            </DialogContent>

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
