import InfluencerList from "./InfluencerList";
import commonstyles from "../sharedStyles.module.css";
import styles from "./influencerMenu.module.css";
import { useState } from "react";
import InfluencerDialog from "./InfluencerDialog";
import { Button } from "@mui/material";

function InfluencerMenu(props: {}) {
    return (
        <>
            {/* <div className={commonstyles.buttonContainer}>
                <Button variant="contained" onClick={() => setShowDialog(true)}>
                    Neuen Influenzer anlegen
                </Button>
            </div> */}
            <InfluencerList />
        </>
    );
}

export default InfluencerMenu;
