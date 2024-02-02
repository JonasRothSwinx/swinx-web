import styles from "./campaignMenu.module.css";
import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { DialogOptions, DialogProps } from "@/app/Definitions/types";
import { Campaign, Customer } from "@/app/ServerFunctions/databaseTypes";
import { ChangeEvent, useEffect, useState } from "react";
import { updateCustomer } from "@/app/ServerFunctions/serverActions";

const client = generateClient<Schema>();
type DialogType = Customer;

const initialData: DialogType = {
    firstName: "",
    lastName: "",
    company: "",
    email: "",
};

function CustomerDialog(props: {
    props: DialogProps<Campaign.Campaign>;
    options: DialogOptions<DialogType>;
}) {
    const { onClose, rows, setRows, columns, excludeColumns } = props.props;
    const { open = false, editing, editingData } = props.options;
    const [customer, setCustomer] = useState(editingData ?? initialData);

    // const [isModalOpen, setIsModalOpen] = useState(open);
    useEffect(() => {
        return () => {
            setCustomer(initialData);
        };
    }, [open]);

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
                    if (!customer) return;
                    updateCustomer(customer);
                    const campaign = rows.find((x) => x.customer?.id === customer.id);
                    console.log({ campaign, customer });
                    if (campaign) campaign.customer = customer;
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

            <DialogContent
                dividers
                sx={{ "& .MuiFormControl-root:has(#customerEmail)": { flexBasis: "100%" } }}
            >
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
                    value={customer?.firstName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setCustomer(
                            (prev) =>
                                ({
                                    ...prev,
                                    firstName: e.target.value,
                                } satisfies Customer),
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
                    value={customer?.lastName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setCustomer(
                            (prev) =>
                                ({
                                    ...prev,
                                    lastName: e.target.value,
                                } satisfies Customer),
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
                    value={customer?.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setCustomer(
                            (prev) =>
                                ({
                                    ...prev,
                                    email: e.target.value,
                                } satisfies Customer),
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
                    value={customer?.company}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setCustomer(
                            (prev) =>
                                ({
                                    ...prev,
                                    company: e.target.value,
                                } satisfies Customer),
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
                    value={customer?.companyPosition}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setCustomer(
                            (prev) =>
                                ({
                                    ...prev,
                                    companyPosition: e.target.value,
                                } satisfies Customer),
                        );
                    }}
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
