"use client";
import { getEnvironment, getUserGroups } from "@/app/ServerFunctions/serverActions";
import { Box, SxProps, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { SideBarLink } from "./components";
import { sideBarButtons } from "./config";
import DebugButtons from "./debug/debugButtons";
import { UserView } from "./User";
import { queryKeys } from "../../queryClient/keys";
import { SwinxLogo } from "@/app/Components";

export function SideBar() {
    const groups = useQuery({
        queryKey: queryKeys.currentUser.userGroups(),
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
    const sx: SxProps = {
        "&.sideBar": {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            width: "300px",
            /* max-width: 200px; */
            padding: "1em 1em 0em 1em",
            height: "100%",
            marginLeft: "0",
            flexGrow: 0,
            backgroundColor: "#f0f0f0",
            "#SwinxLogo": {
                margin: "0 auto",
                // margin: "0 0 0 auto",
                img: {
                    width: "auto",
                },
            },
            "#sideBarButtons": {
                marginBottom: "auto",
            },
            "#debugButtons": {
                background: "black",
                // marginTop: "auto",
                margin: "auto -1em 0 -1em",
                padding: "1em",
            },
        },
    };
    return (
        <Box id="SideBar" className="sideBar" sx={sx}>
            <SwinxLogo /* raveMode */ />
            <UserView />
            <Box id="sideBarButtons">
                {sideBarButtons.map((sb) => {
                    //User is not in buttons allowed groups

                    if (!sb.allowedGroups.some((x) => groups.data.includes(x))) return null;
                    return <SideBarLink key={sb.id.toString()} link={sb.url} title={sb.title} />;
                })}
                {environment.data?.awsBranch === "sandbox" && <SideBarLink link={"/FollowerAnalysis"} />}
            </Box>
            <Box id="debugButtons">
                {groups.data.includes("admin") && (
                    <>
                        <Typography variant="h6">Debug</Typography>
                        <DebugButtons />
                    </>
                )}
            </Box>
        </Box>
    );
}
