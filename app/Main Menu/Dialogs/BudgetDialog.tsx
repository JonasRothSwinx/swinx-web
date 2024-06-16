import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from "@mui/material";
import React, { useState } from "react";
import TextFieldWithTooltip from "./Components/TextFieldWithTooltip";

interface BudgetDialogProps {
    previousBudget: number;
    onClose: () => void;
    onSave: (budget: number) => void;
}

function BudgetDialog(props: BudgetDialogProps) {
    const { onClose, onSave, previousBudget } = props;
    const [budget, setBudget] = useState<number>(previousBudget);

    const handleSave = () => {
        onSave(budget);
        onClose();
    };

    //MUI Component dialog to set dialog. UI is in german language
    return (
        <Dialog
            open={true}
            onClose={onClose}
        >
            <DialogTitle>Honorar</DialogTitle>
            <DialogContent>
                <TextFieldWithTooltip
                    autoFocus
                    InputProps={{
                        inputProps: { min: 0 },
                        endAdornment: "€",
                        style: { textAlign: "right" },
                    }}
                    margin="dense"
                    id="budget"
                    label="Honorar"
                    type="number"
                    fullWidth
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave();
                    }}
                    tooltipProps={{
                        title: "Das Honorar, das der Influencer für die Teilnahme an der Kampagne erhält.",
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="primary"
                >
                    Abbrechen
                </Button>
                <Button
                    onClick={handleSave}
                    color="primary"
                >
                    Speichern
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default BudgetDialog;
