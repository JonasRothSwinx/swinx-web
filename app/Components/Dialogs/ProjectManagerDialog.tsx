import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    SelectChangeEvent,
    SxProps,
    TextField,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { dataClient } from "@dataClient";
import { useQueryClient } from "@tanstack/react-query";
import sxStyles from "./sxStyles";
import { Grid2 as Grid } from "@mui/material";
import { ProjectManager, ProjectManagers } from "@/app/ServerFunctions/types";
import { queryKeys } from "@/app/(main)/queryClient/keys";
interface ProjectManagerDialogProps {
    onClose?: () => void;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    cognitoId: string;
}

export function ProjectManagerDialog(props: ProjectManagerDialogProps) {
    // debugger;
    const { onClose, firstName, lastName, email, phoneNumber, cognitoId } = props;
    // const [isModalOpen, setIsModalOpen] = useState(open);
    const [data, setData] = useState<Partial<ProjectManager>>({
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        email: email ?? "",
        phoneNumber: phoneNumber ?? "",
        cognitoId: cognitoId,
        jobTitle: "Projektmanager*in",
    });

    const queryClient = useQueryClient();
    const EventHandlers = {
        handleClose: () => {
            if (onClose) {
                onClose();
            }
        },
        submitData: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            console.log(event);
            if (!data.email?.endsWith("@swinx.de")) {
                alert("Projektmanager Emails müssen auf @swinx.de enden");
                return;
            }
            console.log("submitting data", data);
            if (!ProjectManagers.validate(data)) {
                alert("Bitte füllen Sie alle Felder aus");
                return;
            }
            try {
                await dataClient.projectManager.create({ projectManager: data });
            } catch (error) {
                console.error(error);
                alert("Fehler beim Erstellen des Projektmanagers");
                return;
            }
            queryClient.invalidateQueries({ queryKey: queryKeys.currentUser.projectManager() });
            // debugger;
            EventHandlers.handleClose();
        },
    };

    const styles: SxProps = useMemo(
        () => ({
            "&": {
                margin: "auto",
                // minWidth: "max(50vw,500px)",
                width: "80vw",
                maxWidth: "80vw",
                "#DialogTitle": {
                    width: "100%",
                    textAlign: "center",
                },
                "& .MuiPaper-root": {
                    width: "100%",
                    minWidth: "100%",
                },
                "#FormInputWrapper": {
                    width: "100%",
                    minWidth: "100%",
                    display: "flex",
                    justifyContent: "center",
                },
                "#FormInputContainer": {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "1rem",
                    padding: "1rem",
                    "& .MuiTextField-root": {
                        width: "30em",
                    },
                },
            },
        }),
        []
    );

    return (
        <Dialog
            // ref={modalRef}
            className="dialog"
            open={true}
            // className={styles.dialog}
            onClose={EventHandlers.handleClose}
            PaperProps={{
                component: "form",
                onSubmit: EventHandlers.submitData,
            }}
            sx={{
                ...sxStyles.DialogDefault,
                ...styles,
            }}
        >
            <Box>
                <DialogTitle id="DialogTitle">{"Projekt Manager Daten"}</DialogTitle>
                {/* <button onClick={handleCloseModal}>x</button> */}
                <FormInputs data={data} setData={setData} />
                <DialogActions>
                    <Button onClick={EventHandlers.handleClose} color="secondary">
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

interface FormInputsProps {
    data: Partial<ProjectManager>;
    setData: React.Dispatch<React.SetStateAction<Partial<ProjectManager>>>;
}
function FormInputs(props: FormInputsProps) {
    const { data, setData } = props;
    const ChangeHandler = {
        firstName: (event: React.ChangeEvent<HTMLInputElement>) => {
            setData((prev) => ({ ...prev, firstName: event.target.value }));
        },
        lastName: (event: React.ChangeEvent<HTMLInputElement>) => {
            setData((prev) => ({ ...prev, lastName: event.target.value }));
        },
        email: (event: React.ChangeEvent<HTMLInputElement>) => {
            setData((prev) => ({ ...prev, email: event.target.value }));
            setIsEmailValid(Validator.validateEmail(event.target.value));
        },
        phoneNumber: (event: React.ChangeEvent<HTMLInputElement>) => {
            setData((prev) => ({ ...prev, phoneNumber: event.target.value }));
        },
        jobTitle: (event: React.ChangeEvent<HTMLInputElement>) => {
            setData((prev) => ({ ...prev, jobTitle: event.target.value }));
        },
    };
    const Validator = {
        validateEmail: (email: string): boolean => {
            return email.endsWith("@swinx.de");
        },
    } as const;
    const [isEmailValid, setIsEmailValid] = useState<boolean>(Validator.validateEmail(data.email ?? ""));
    return (
        <DialogContent id="FormInputWrapper">
            <Box id="FormInputContainer">
                <TextField label="Cognito Id" value={data.cognitoId} disabled />
                <TextField label="Vorname" value={data.firstName} onChange={ChangeHandler.firstName} required />
                <TextField label="Nachname" value={data.lastName} onChange={ChangeHandler.lastName} required />
                <TextField
                    label="Email"
                    value={data.email}
                    onChange={ChangeHandler.email}
                    type="email"
                    error={!isEmailValid}
                    helperText={isEmailValid ? "" : "Projektmanager Emails müssen auf @swinx.de enden"}
                    required
                />
                <TextField
                    label="Jobtitel"
                    value={data.jobTitle}
                    onChange={ChangeHandler.jobTitle}
                    helperText="Wird in Emailsignatur angegeben"
                />
                <TextField
                    label="Telefonnummer"
                    value={data.phoneNumber}
                    onChange={ChangeHandler.phoneNumber}
                    helperText="Wird in Emailsignatur angegeben"
                />
            </Box>
        </DialogContent>
    );
}
