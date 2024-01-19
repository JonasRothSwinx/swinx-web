import UserView from "@/app/Pages/WelcomePage/User";
import styles from "./sideBar.module.css";
import { useEffect, useState } from "react";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";

export interface ISideBarButton {
    id: sideBarButtonId;
    title: string;
    description: string;
    allowedGroups: string[];
}
export enum sideBarButtonId {
    campaigns,
    influencers,
}
export const sideBarButtons = [
    {
        id: sideBarButtonId.campaigns,
        title: "Kampagnen",
        description: "Campaign Menu Description placeholder",
        allowedGroups: ["admin", "projektmanager"],
    },
    {
        id: sideBarButtonId.influencers,
        title: "Influenzer",
        description: "Influencer Menu Description placeholder",
        allowedGroups: ["admin", "projektmanager"],
    },
];
interface ISideBar {
    setMenuCallback: (menu: sideBarButtonId) => any;
}

function SideBar(props: ISideBar) {
    const { setMenuCallback } = props;
    const [groups, setGroups] = useState<string[]>([]);
    useEffect(() => {
        getUserGroups().then((result) => setGroups(result));

        return () => {};
    }, []);

    return (
        <div className={styles.sideBar}>
            <UserView />
            {sideBarButtons.map((sb) => (
                <SideBarButton
                    key={sb.id.toString()}
                    buttonProps={sb}
                    groups={groups}
                    callback={setMenuCallback}
                />
            ))}
        </div>
    );
}
export default SideBar;

function SideBarButton(props: {
    buttonProps: ISideBarButton;
    groups: string[];
    callback: (menu: sideBarButtonId) => any;
}) {
    const { id, title, description, allowedGroups } = props.buttonProps;
    const { groups, callback } = props;
    if (!allowedGroups.some((x) => groups.includes(x))) return null;

    return (
        <button id={id.toString()} className={styles.sideBarButton} onClick={() => callback(id)}>
            <h2>
                <span>&lt;-</span> {title}
            </h2>
            <p>{description}</p>
        </button>
    );
}
