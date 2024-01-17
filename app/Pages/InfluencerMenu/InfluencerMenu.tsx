import InfluencerList from "./InfluencerList";
import commonstyles from "../sharedStyles.module.css";
import styles from "./influencerMenu.module.css";
import { useState } from "react";
import CreateInfluencerDialog from "./CreateNewInfluencer";

function InfluencerMenu(props: {}) {
    const [showDialog, setShowDialog] = useState(false);
    return (
        <>
            {showDialog && <CreateInfluencerDialog open={showDialog} onClose={() => setShowDialog(false)} />}
            <div className={commonstyles.buttonContainer}>
                <button onClick={() => setShowDialog(true)}>Neuen Influenzer anlegen</button>
            </div>
            InfluencerMenu
            <InfluencerList />
        </>
    );
}

export default InfluencerMenu;
