import { DataGrid, GridColDef, useGridApiRef } from "@mui/x-data-grid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { s3 } from "../serverActions";
import { ListObjectsV2Command, ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import { useEffect, useState } from "react";
import { getValueFromValueOptions } from "@mui/x-data-grid/components/panel/filterPanel/filterPanelUtils";
import { Box, SxProps } from "@mui/material";

export function FileList() {
    const apiRef = useGridApiRef();
    const files = useQuery({
        queryKey: queryKeys.files.all,
        queryFn: async () => {
            const buckets = await s3.listBucket();
            console.log(buckets);
            return buckets;
        },
    });
    useEffect(() => {
        apiRef.current.autosizeColumns();
    }, [files.data, apiRef]);
    const queryClient = useQueryClient();
    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            // width: "auto",
            minWidth: 300,
            valueGetter: (
                value,
                row: NonNullable<ListObjectsV2CommandOutput["CommonPrefixes"]>[number],
            ) => {
                // console.log({ value, row });
                return row.Prefix ?? "AAAAAH";
            },
        },
    ];
    function getRowId(row: NonNullable<ListObjectsV2CommandOutput["CommonPrefixes"]>[number]) {
        return row?.Prefix ?? "";
    }
    const sx: SxProps = {
        flex: "1 0",
        height: "100%",
        minWidth: "300px",

        ".MuiDataGrid-filler": { maxWidth: "100%" },
        ".MuiDataGrid-scrollbarContent": { maxWidth: "100%" },
        ".MuiDataGrid-virtualScrollerContent": {
            maxWidth: "100%",
            ".MuiDataGrid-virtualScrollerRenderZone": {
                maxWidth: "100%",
                ".MuiDataGrid-row": {
                    maxWidth: "100%",
                    ".MuiDataGrid-cell": {
                        wordBreak: "break-all",
                        "&.fileCell": {
                            cursor: "pointer",
                            flex: "1",
                        },
                    },
                },
            },
        },
    };
    return (
        <Box
            id="FileListWrapper"
            sx={sx}
        >
            <DataGrid
                apiRef={apiRef}
                getRowId={getRowId}
                rows={files.data?.CommonPrefixes ?? []}
                columns={columns}
                checkboxSelection
                disableMultipleRowSelection
                onRowSelectionModelChange={(selection) => {
                    // console.log(selection);
                    queryClient.setQueryData(queryKeys.files.selected(), selection[0] ?? "none");
                }}
                autoPageSize
                columnHeaderHeight={0}
                autosizeOnMount
                autosizeOptions={{
                    columns: ["id"],
                    includeOutliers: true,
                }}
                getCellClassName={(params) => {
                    if (params.field === "id") {
                        return "fileCell";
                    }
                    return "";
                }}
                getRowHeight={() => "auto"}
            />
        </Box>
    );
}
