"use client";
import UserView from "@/app/Pages/WelcomePage/User";
import { getUserAttributes, getUserGroups } from "@/app/ServerFunctions/serverActions";
import { useQuery } from "@tanstack/react-query";
import stylesExporter from "../styles/stylesExporter";
import DebugButtons from "./debug/debugButtons";

const styles = stylesExporter.sideBar;

export interface ISideBarButton {
    id: sideBarButtonId;
    title: string;
    description: string;
    allowedGroups: string[];
    link?: string;
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
        title: "Influencer",
        description: "Influencer Menu Description placeholder",
        allowedGroups: ["admin", "projektmanager"],
    },
];
interface ISideBar {
    setMenuCallback?: (menu: sideBarButtonId) => unknown;
}

function SideBar(props: ISideBar) {
    const { setMenuCallback } = props;
    const groups = useQuery({ queryKey: ["userGroups"], queryFn: getUserGroups });
    // const userAttributes = useQuery({ queryKey: ["userAttributes"], queryFn: getUserAttributes });
    if (groups.isLoading) return <div>Loading...</div>;
    if (groups.isError) return <div>Error: {JSON.stringify(groups.error)}</div>;
    if (groups.data === undefined) return <div>Groups not found</div>;

    return (
        <div className={styles.sideBar}>
            <UserView />
            {sideBarButtons.map((sb) => (
                <SideBarButton
                    key={sb.id.toString()}
                    buttonProps={sb}
                    groups={groups.data}
                    callback={setMenuCallback ?? (() => {})}
                />
            ))}
            {groups.data.includes("admin") && <DebugButtons />}
        </div>
    );
}
export default SideBar;

function SideBarButton(props: {
    buttonProps: ISideBarButton;
    groups: string[];
    callback: (menu: sideBarButtonId) => unknown;
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

function getProjecManagerObject() {}
