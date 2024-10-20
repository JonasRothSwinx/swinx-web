import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { s3 } from "../serverActions";
import { Box, Button, SxProps, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { _Object, GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { DataView } from "./Data";

interface FileDetailProps {
    // prefix: string;
    _?: never;
}
export function FileDetails({}: FileDetailProps = {}) {
    const [dataFile, setDataFile] = useState<_Object>();
    const [filterFile, setFilterFile] = useState<_Object>();
    const selectedFolder = useQuery<string>({
        queryKey: queryKeys.files.selected(),
        placeholderData: "none",
    });
    const folder = useQuery({
        enabled: !!selectedFolder.data,
        queryKey: queryKeys.files.folder.all(selectedFolder.data ?? "none"),
        queryFn: async () => {
            if (!selectedFolder.data) return null;
            const prefix = selectedFolder.data;
            const files = (await s3.listBucket({ prefix })).Contents;
            if (!files) return null;
            console.log("files", files);

            return files;
        },
    });

    useEffect(() => {
        setDataFile(undefined);
    }, [selectedFolder.data]);

    useEffect(() => {
        const dataJson = folder.data?.find((content) => content.Key?.endsWith("data.json"));
        const filterCsv = folder.data?.find((content) => content.Key?.endsWith(".csv"));
        setDataFile(dataJson);
        setFilterFile(filterCsv);
    }, [folder.data]);

    if (!selectedFolder.data || selectedFolder.data === "none") return null;
    const sx: SxProps = {
        height: "100%",
        maxHeight: "100%",
        flex: 100,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "10px",
    };
    return (
        <Box
            id="folder"
            sx={sx}
        >
            <Typography>{selectedFolder.data}</Typography>
            <Box
                id="ButtonContainer"
                display={"flex"}
                gap={1}
                flexGrow={0}
                flexShrink={0}
            >
                <DownloadButton
                    path={dataFile?.Key ?? ""}
                    label={"Download Data"}
                />
                <DownloadButton
                    path={filterFile?.Key ?? ""}
                    label={"Download used Filter"}
                />
            </Box>
            <DataView path={dataFile?.Key ?? ""} />
        </Box>
    );
}
// interface FileParams {
//     path: string;
// }
// function File({ path }: FileParams) {
//     const [content, setContent] = useState<string>();
//     const [open, setOpen] = useState(false);
//     function getContent() {
//         s3.getFile({ path }).then((res) => {
//             console.log(res);
//             setContent(res);
//         });
//     }
//     function handleClick() {
//         setOpen(!open);
//         if (!content) {
//             getContent();
//         }
//     }
//     const sx: SxProps = useMemo(
//         () => ({
//             flex: open ? 1 : "0 0 min-content",
//             overflow: "hidden",
//             display: "flex",
//             flexDirection: "column",
//             minHeight: "min-content",
//             maxHeight: "100%",
//             maxWidth: "100%",
//             width: "100%",
//         }),
//         [open],
//     );
//     return (
//         <Box
//             id="file"
//             sx={sx}
//         >
//             <Button
//                 color="info"
//                 onClick={handleClick}
//                 sx={{ flexGrow: 0 }}
//             >
//                 {path}
//             </Button>
//             {open && (
//                 <Box overflow="scroll">
//                     <Typography whiteSpace={"break-spaces"}>
//                         {JSON.stringify(JSON.parse(content ?? "{}"), null, 2)}
//                     </Typography>
//                 </Box>
//             )}
//         </Box>
//     );
// }

interface DownloadButtonProps {
    path: string;
    label: string;
}
export function DownloadButton({ path, label }: DownloadButtonProps) {
    async function downloadFile() {
        const file = await s3.getFileString({ path });
        console.log(file);
        if (!file) return;

        const blob = new Blob([file]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const fileName = path.split("/").pop() ?? path;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }
    return (
        <Button
            disabled={!path}
            variant="contained"
            onClick={() => {
                downloadFile();
            }}
        >
            {label}
        </Button>
    );
}
