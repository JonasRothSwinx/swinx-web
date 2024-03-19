import { useAuthenticator, withAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import SideBar, { sideBarButtonId } from "./SideBar";
import InfluencerMenu from "../InfluencerMenu/InfluencerMenu";
import CampaignMenu from "../CampaignMenu/CampaignMenu";
import stylesExporter from "../styles/stylesExporter";

const styles = stylesExporter.welcomePage;
function WelcomePage({}) {
    const { signOut, user, authStatus } = useAuthenticator((context) => [context.user, context.authStatus]);
    const [openMenu, setOpenMenu] = useState<sideBarButtonId>(sideBarButtonId.campaigns);
    if (authStatus !== "authenticated") return null;

    return (
        <main className={styles.main}>
            <div className={styles.mainContent}>
                {/* {openMenu}
                <br /> */}
                {openMenu === sideBarButtonId.campaigns && <CampaignMenu />}
                {openMenu === sideBarButtonId.influencers && <InfluencerMenu />}
                {/* 
                <div className={styles.center}>
                    <Image
                        className={styles.logo}
                        src="/next.svg"
                        alt="Next.js Logo"
                        width={180}
                        height={37}
                        priority
                    />
                    <span>+</span>
                    <Image src="/amplify.svg" alt="Amplify Logo" width={45} height={37} priority />
                </div>

                <div className={styles.grid}></div> */}
            </div>
            <SideBar setMenuCallback={setOpenMenu} />
        </main>
    );
}

export default withAuthenticator(WelcomePage);
