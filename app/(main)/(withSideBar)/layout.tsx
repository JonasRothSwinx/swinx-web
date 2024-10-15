"use client";
import { Box, Typography } from "@mui/material";
import { SideBar } from "./SideBar";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import { useQuery } from "@tanstack/react-query";
import { LoadingElement } from "@/app/Components/Loading";
import { queryKeys } from "../queryClient/keys";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const usergroups = useQuery({
        queryKey: queryKeys.currentUser.userGroups(),
        queryFn: async () => {
            const userGroups = await getUserGroups();
            return userGroups;
        },
        refetchOnWindowFocus: false,
    });

    return (
        <Box id="withSideBarRoot" sx={{ display: "flex", width: "100%", height: "100%" }}>
            {usergroups.isLoading ? (
                <LoadingElement hideLogo />
            ) : (
                <>
                    {["projektmanager", "admin"].some((group) => usergroups.data?.includes(group)) ? (
                        <Box id="mainContent" flex={1}>
                            {children}
                        </Box>
                    ) : (
                        <Box
                            width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                        >
                            <Typography variant="h6">Sie haben keine Berechtigung für diese Seite</Typography>
                        </Box>
                    )}
                    <SideBar />
                </>
            )}
        </Box>
    );
}
