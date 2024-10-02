import { PrintIcon, RefreshIcon } from "@/app/Definitions/Icons";
import { IconButton, Typography } from "@mui/material";
import { Query, QueryKey, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { Grid2 as Grid } from "@mui/material";
import { getUserGroups } from "../ServerFunctions/serverActions";
import { queryKeys } from "../(main)/queryClient/keys";

interface TimelineDebugDisplayProps {
    data: queryData[];
}
type queryData = UseQueryResult & {
    name: string;
    queryKey?: QueryKey;
};

export function QueryDebugDisplay(props: TimelineDebugDisplayProps) {
    const { data } = props;
    const queryClient = useQueryClient();
    const userGroups = useQuery({
        queryKey: queryKeys.currentUser.userGroups(),
        queryFn: () => {
            return getUserGroups();
        },
        placeholderData: [],
    });
    if (!userGroups.data?.includes("admin")) return <></>;
    return <></>;
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "100%",
                width: "100%",
                // justifyContent: "space-between",
            }}
        >
            {data.map((query, index) => {
                return (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            maxWidth: "100%",
                            width: "100%",
                            alignItems: "center",
                            // justifyContent: "space-between",
                        }}
                    >
                        <IconButton onClick={() => console.log(query)}>
                            <PrintIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                console.log(query);
                                queryClient.invalidateQueries({
                                    queryKey: query.queryKey ?? [query.name],
                                });
                                query.refetch();
                                console.log("Refetching", query.name);
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>

                        <Grid
                            container
                            width={"100%"}
                        >
                            <Grid
                                size={6}
                                style={{ paddingRight: "10px" }}
                            >
                                {query.name}
                            </Grid>
                            <Grid
                                size={"auto"}
                                style={{ paddingRight: "10px" }}
                            >
                                <StatusDisplay {...query} />
                            </Grid>
                            <ResultsDisplay {...query} />
                        </Grid>
                    </div>
                );
            })}
        </div>
    );
}

function StatusDisplay(query: queryData) {
    const { isLoading, isFetching, isError, error, data } = query;
    switch (true) {
        case isLoading:
            return (
                <Typography color={"darkgoldenrod"}>
                    Loading...{" "}
                    {query.failureCount > 0 ? `Failed ${query.failureCount} times` : null}
                </Typography>
            );
        case isFetching:
            return (
                <Typography color={"darkgoldenrod"}>
                    Fetching...{" "}
                    {query.failureCount > 0 ? `Failed ${query.failureCount} times` : null}
                </Typography>
            );
        case isError:
            return <Typography color={"error"}>Error: {error.message}</Typography>;
        default:
            return <Typography color={"darkgreen"}>{query.fetchStatus}</Typography>;
    }
}
function ResultsDisplay(props: queryData) {
    const { data } = props;
    switch (true) {
        case Array.isArray(data):
            return <Grid>Items: {data.length} </Grid>;
        default:
            return <></>;
            /**
             * Return a stringified version of the data inside a scrollable div of max height 200px
             */
            return (
                <Grid size={16}>
                    <Typography
                        style={{
                            maxHeight: "200px",
                            overflowY: "auto",
                            overflowX: "hidden",
                            flex: 1,
                            whiteSpace: "pre-wrap",
                            fontSize: "0.8em",
                        }}
                    >
                        {JSON.stringify(data, null, 2)}
                    </Typography>
                </Grid>
            );
    }
}
