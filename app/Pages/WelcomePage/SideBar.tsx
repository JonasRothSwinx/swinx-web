"use client";
import UserView from "@/app/Pages/WelcomePage/User";
import {
    getEnvironment,
    getUserAttributes,
    getUserGroups,
} from "@/app/ServerFunctions/serverActions";
import { useQuery } from "@tanstack/react-query";
import stylesExporter from "../styles/stylesExporter";
import DebugButtons from "./debug/debugButtons";
import { Link, SxProps } from "@mui/material";
import { withAuthenticator } from "@aws-amplify/ui-react";

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
    const environment = useQuery({ queryKey: ["environment"], queryFn: getEnvironment });
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
            {environment.data?.awsBranch === "sandbox" && (
                <SideBarLink link={"/FollowerAnalysis"} />
            )}
            {groups.data.includes("admin") && <DebugButtons />}
        </div>
    );
}
export default withAuthenticator(SideBar);

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
interface ISideBarLink {
    link: string;
}
function SideBarLink({ link }: ISideBarLink) {
    const style: SxProps = {
        "&": {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            padding: "1rem 0.2rem",
            borderRadius: "var(--border-radius)",
            background: "rgba(var(--card-rgb), 0)",
            border: "1px solid rgba(var(--card-border-rgb), 0)",
            transition: "background 200ms, border 200ms, box-shadow 200ms",
            cursor: "pointer",
        },
        "&:hover": {
            backgroundColor: "lightgrey",
        },
    };
    return (
        <Link href={link} sx={style}>
            <h2>
                <span>&lt;-</span> {link}
            </h2>
            <p>{"Ipsum Lorem"}</p>
        </Link>
    );
}

function getProjecManagerObject() {}
