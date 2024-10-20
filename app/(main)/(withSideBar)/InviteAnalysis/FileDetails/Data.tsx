import { _Object } from "@aws-sdk/client-s3";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { getFileString } from "../serverActions/s3";
import {
    Box,
    Button,
    CircularProgress,
    Collapse,
    IconButton,
    SxProps,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { dayjs, Dayjs, Duration } from "@/app/utils";
import { useMemo, useState } from "react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

interface DataViewProps {
    path: string;
}
export function DataView({ path }: DataViewProps) {
    const file = useQuery({
        queryKey: queryKeys.files.folder.one(path),
        queryFn: async () => {
            const data = await getFileString({ path });
            if (!data) return null;
            const dataFile = parseData(data);
            return dataFile;
        },
    });
    if (file.isLoading) return <CircularProgress />;
    if (!file.data) return <Typography>Error loading file</Typography>;
    const sx: SxProps = {
        flex: "1",
        padding: "0 10px",
        gap: "10px",
        display: "flex",
        width: "100%",
        flexDirection: "column",
        // maxHeight: "100%",
        overflow: "auto",

        ".spacer": {
            height: "10px",
            borderBottom: "1px solid #000",
        },
        ".withBorders": {
            borderBottom: "1px solid #000",
            "&:last-of-type": {
                borderBottom: "none",
            },
        },
    };
    return (
        <Box
            sx={sx}
            id="dataWrapper"
        >
            <RuntimeData data={file.data} />
            <FilterData data={file.data} />
            <PerformanceData data={file.data} />
        </Box>
    );
}
type FilterData = {
    name: string;
    company: string;
    firstName: string;
    lastName: string;
};
type SearchSuccess = {
    time: number;
    hits: number;
    profiles: FilterData[];
};
type SearchFailure = {
    time: number;
    failureType: string;
    details: unknown;
};
type rawData = {
    startTime: string;
    endTime: string;
    runtime: string;
    filter: {
        fileName: string;
        data: FilterData[];
        locationData: string[];
    };
    foundProfiles: FilterData[];
    performanceData: {
        searchSuccesses: SearchSuccess[];
        searchFailures: SearchFailure[];
    };
};
type DataFile = {
    startTime: Dayjs;
    endTime: Dayjs;
    runtime: Duration;
    filter: {
        fileName: string;
        data: FilterData[];
        locationData: string[];
    };
    foundProfiles: FilterData[];
    performanceData: {
        searchSuccesses: SearchSuccess[];
        searchFailures: SearchFailure[];
    };
};
function parseData(data: string): DataFile {
    const json = JSON.parse(data) as rawData;
    const startTime = json.startTime ? dayjs(json.startTime) : null;
    const endTime = json.endTime ? dayjs(json.endTime) : null;
    const runtime = json.runtime ? dayjs.duration(json.runtime) : null;
    const filter = json.filter ?? null;
    const foundProfiles = json.foundProfiles ?? null;
    const performanceData = json.performanceData ?? null;
    if (!startTime || !endTime || !runtime) throw new Error("Invalid data file");
    return { startTime, endTime, runtime, filter, foundProfiles, performanceData };
}

interface DataProps {
    data: DataFile;
}
function RuntimeData({ data }: DataProps) {
    const runtimeData = useMemo(() => {
        return [
            { key: "Start", value: data.startTime.format("YYYY-MM-DD HH:mm:ss") },
            { key: "Ende", value: data.endTime.format("YYYY-MM-DD HH:mm:ss") },
            { key: "Laufzeit", value: data.runtime.format("HH:mm:ss") },
        ];
    }, [data]);
    const sx: SxProps = {
        ".MuiTableCell-root": {
            padding: "5px",
            border: "none",
            "&:first-of-type": {
                paddingLeft: 0,
                paddingRight: "10px",
            },
        },
    };
    return (
        <Box
            id="RuntimeData"
            sx={sx}
        >
            <Table>
                {runtimeData.map((row) => (
                    <TableRow key={row.key}>
                        <TableCell>{row.key}:</TableCell>
                        <TableCell>{row.value}</TableCell>
                    </TableRow>
                ))}
            </Table>
        </Box>
    );
}

function FilterData({ data: { filter, foundProfiles } }: DataProps) {
    const { filterEntries, filterEntryCount, companies, companyCount, locationData } =
        useMemo(() => {
            const filterEntries = filter.data;
            const filterEntryCount = filter.data.length;
            const companies = new Set(filter.data.map((entry) => entry.company));
            const companyCount = companies.size;
            const locationData = filter.locationData;
            return {
                filterEntries,
                filterEntryCount,
                companies,
                companyCount,
                locationData,
            };
        }, [filter]);
    const sx: SxProps = {
        flex: "0 0 min-content",
        overflowY: "auto",
        maxHeight: "100%",
        ".MuiTable-root": {
            maxHeight: "100%",
            ".MuiTableCell-root": {
                padding: "5px",
                border: "none",
                "&.collapsible": {
                    padding: 0,
                },
                // "&:first-of-type": {
                //     paddingLeft: 0,
                //     paddingRight: "10px",
                // },
            },
            ".spacer": {
                height: "10px",
                borderBottom: "1px solid #000",
            },
        },
    };
    return (
        <TableContainer sx={sx}>
            <Table
                size="small"
                id="FilterData"
            >
                {/* <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Unternehmen</TableCell>
                    </TableRow>
                </TableHead> */}
                <TableBody>
                    {/* <Typography variant="h6">Filter</Typography> */}
                    <CollapsibleDataRow
                        title={`Einträge: ${filterEntryCount}`}
                        tableCols={2}
                    >
                        {filterEntries
                            .sort((a, b) => {
                                return a.lastName
                                    .toLowerCase()
                                    .localeCompare(b.lastName.toLowerCase());
                            })
                            .map((entry, index) => (
                                <TableRow key={index}>
                                    <TableCell>{entry.name}</TableCell>
                                    <TableCell>{entry.company}</TableCell>
                                </TableRow>
                            ))}
                    </CollapsibleDataRow>
                    <CollapsibleDataRow
                        title={`Unternehmen: ${companyCount}`}
                        tableCols={2}
                    >
                        {Array.from(companies)
                            .sort((a, b) => {
                                return a.toLowerCase().localeCompare(b.toLowerCase());
                            })
                            .map((company, index) => (
                                <TableRow key={index}>
                                    <TableCell>{company}</TableCell>
                                </TableRow>
                            ))}
                    </CollapsibleDataRow>
                    <CollapsibleDataRow
                        title={`Standortfilter: ${
                            locationData.length !== 0 ? locationData.length : "keine"
                        }`}
                        tableCols={2}
                    >
                        {locationData.map((location, index) => (
                            <TableRow key={index}>
                                <TableCell>{location}</TableCell>
                            </TableRow>
                        ))}
                    </CollapsibleDataRow>
                    <TableRow className="spacer" />
                    <CollapsibleDataRow
                        title={`Gefundene Profile: ${foundProfiles.length}`}
                        tableCols={2}
                    >
                        {foundProfiles
                            .sort((a, b) => {
                                return a.lastName
                                    .toLowerCase()
                                    .localeCompare(b.lastName.toLowerCase());
                            })
                            .map((entry, index) => (
                                <TableRow key={index}>
                                    <TableCell>{entry.name}</TableCell>
                                    <TableCell>{entry.company}</TableCell>
                                </TableRow>
                            ))}
                    </CollapsibleDataRow>
                    <TableRow className="spacer" />

                    {/* <Typography>{`Unternehmen: ${companyCount}`}</Typography> */}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
interface CollapsibleDataRowProps {
    children?: React.ReactNode;
    title: string;
    tableCols: number;
}
function CollapsibleDataRow({ children = [], title, tableCols }: CollapsibleDataRowProps) {
    const sx: SxProps = {};
    const [open, setOpen] = useState(false);
    return (
        <>
            <TableRow sx={sx}>
                <TableCell
                    align="left"
                    width={20}
                >
                    <IconButton
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell align="left">{title}</TableCell>
            </TableRow>
            <TableRow sx={{ maxHeight: "100%" }}>
                <TableCell
                    className="collapsible"
                    colSpan={tableCols}
                    padding="none"
                    sx={{ padding: 0 }}
                >
                    <Collapse in={open}>
                        <Box>
                            <Table
                                size="small"
                                sx={{ maxHeight: "200px", overflowY: "auto" }}
                            >
                                {children}
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

function PerformanceData({
    data: {
        performanceData: { searchSuccesses, searchFailures },
    },
}: DataProps) {
    const { successCount, failureCount } = useMemo(() => {
        const successCount = searchSuccesses.length;
        const failureCount = searchFailures.length;
        return { successCount, failureCount };
    }, [searchSuccesses, searchFailures]);
    const sx: SxProps = {
        flex: "0 0 min-content",
        overflowY: "auto",
        maxHeight: "100%",
        ".MuiTable-root": {
            maxHeight: "100%",
            ".MuiTableCell-root": {
                padding: "5px",
                border: "none",
                "&.collapsible": {
                    padding: 0,
                },
                "&.paddingRight": {
                    paddingRight: "10px",
                },
                // "&:first-of-type": {
                //     paddingLeft: 0,
                //     paddingRight: "10px",
                // },
            },
        },
    };
    return (
        <TableContainer sx={sx}>
            <Table
                size="small"
                id="FilterData"
            >
                <TableBody>
                    <CollapsibleDataRow
                        title={`Sucherfolge: ${searchSuccesses.length}`}
                        tableCols={3}
                    >
                        <TableHead>
                            <TableRow>
                                {/* <TableCell /> */}
                                <TableCell>Zeit</TableCell>
                                <TableCell>Treffer</TableCell>
                                <TableCell>Profile</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {searchSuccesses.map((success, index) => (
                                <TableRow
                                    key={index}
                                    className="withBorders"
                                >
                                    <TableCell>
                                        {dayjs.duration(success.time).asSeconds().toFixed(3)}
                                    </TableCell>
                                    <TableCell>{success.hits}</TableCell>
                                    <TableCell align="right">
                                        {success.profiles.map((profile, index) => (
                                            <Typography key={index}>
                                                {profile.name} - ({profile.company})
                                            </Typography>
                                        ))}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </CollapsibleDataRow>
                    <CollapsibleDataRow
                        title={`Suchfehler: ${searchFailures.length}`}
                        tableCols={2}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Zeit</TableCell>
                                <TableCell align="center">Fehler</TableCell>
                                <TableCell>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {searchFailures.map((failure, index) => (
                                <TableRow
                                    key={index}
                                    className="withBorders"
                                >
                                    <TableCell
                                        align="right"
                                        className="paddingRight"
                                    >
                                        {dayjs.duration(failure.time).asSeconds().toFixed(3)}s
                                    </TableCell>
                                    <TableCell align="center">{failure.failureType}</TableCell>
                                    <TableCell>
                                        {typeof failure.details === "string" ? (
                                            failure.details
                                        ) : (
                                            <CollapsibleCell>
                                                {(() => {
                                                    const details = failure.details as {
                                                        filterData: FilterData[];
                                                        companyNames: string[];
                                                    };
                                                    if (!details) return null;
                                                    try {
                                                        return details.filterData
                                                            .sort((a, b) => {
                                                                return a.company
                                                                    .toLowerCase()
                                                                    .localeCompare(
                                                                        b.company.toLowerCase(),
                                                                    );
                                                            })
                                                            .map((detail, index) => (
                                                                <Typography
                                                                    fontSize={12}
                                                                    key={index}
                                                                >
                                                                    {detail.name} - (
                                                                    {detail.company})
                                                                </Typography>
                                                            ));
                                                    } catch (error) {
                                                        console.log("PerformanceData", {
                                                            failure,
                                                            error,
                                                            details,
                                                        });
                                                        return null;
                                                    }
                                                })()}
                                            </CollapsibleCell>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </CollapsibleDataRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function CollapsibleCell({ children = [] }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <Box>
            <Button onClick={() => setOpen(!open)}>
                {open ? (
                    <>
                        Close Details
                        <KeyboardArrowUp />
                    </>
                ) : (
                    <>
                        Open Details <KeyboardArrowDown />
                    </>
                )}
            </Button>
            <Collapse in={open}>{children}</Collapse>
        </Box>
    );
}
