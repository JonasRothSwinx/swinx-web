"use client";
import { getEnvironment, getUserGroups } from "@/app/ServerFunctions/serverActions";
import { Box, Link, SxProps } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import stylesExporter from "../../styles/stylesExporter";
import DebugButtons from "./debug/debugButtons";
import { UserView } from "./User";
import { sideBarButtonId, sideBarButtons } from "./config";
import { SideBarButton, SideBarLink } from "./components";

const styles = stylesExporter.sideBar;

interface ISideBar {
    setMenuCallback?: (menu: sideBarButtonId) => unknown;
}

export function SideBar(props: ISideBar) {
    const { setMenuCallback } = props;
    const groups = useQuery({
        queryKey: ["userGroups"],
        queryFn: async () => {
            const groups = await getUserGroups();
            console.log("Groups: ", groups);
            return groups;
        },
    });
    const environment = useQuery({
        queryKey: ["environment"],
        queryFn: async () => {
            console.log("Getting environment");
            const env = await getEnvironment();
            console.log("Environment: ", env);
            return env;
        },
    });
    // const userAttributes = useQuery({ queryKey: ["userAttributes"], queryFn: getUserAttributes });
    if (groups.isLoading) return <div>Loading...</div>;
    if (groups.isError) return <div>Error: {JSON.stringify(groups.error)}</div>;
    if (groups.data === undefined) return <div>Groups not found</div>;

    return (
        <Box className={styles.sideBar}>
            <UserView />
            {sideBarButtons.map((sb) => {
                //User is not in buttons allowed groups

                if (!sb.allowedGroups.some((x) => groups.data.includes(x))) return null;
                return (
                    <SideBarLink
                        key={sb.id.toString()}
                        link={sb.url}
                        title={sb.title}
                    />
                );
            })}
            {environment.data?.awsBranch === "sandbox" && (
                <SideBarLink link={"/FollowerAnalysis"} />
            )}
            {groups.data.includes("admin") && <DebugButtons />}
        </Box>
    );
}
