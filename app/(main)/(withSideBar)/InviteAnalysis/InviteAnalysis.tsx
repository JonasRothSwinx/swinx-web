import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { s3 } from "./serverActions";
import { GetObjectCommandOutput, ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";

export function InviteAnalysis() {
    const [output, setOutput] = useState<ListObjectsV2CommandOutput>();
    function listKeys() {
        s3.listBucket().then((res) => {
            console.log(res);
            setOutput(res);
        });
    }
    return (
        <Box maxHeight={"100%"} overflow={"hidden"} display="flex" flexDirection={"column"}>
            <Button variant="contained" onClick={listKeys}>
                Get Keys
            </Button>
            <Box flex={1} overflow="hidden" maxHeight={"100%"} display={"flex"} flexDirection={"column"}>
                {output?.CommonPrefixes?.map((prefix) => {
                    // const prefixString = prefix.Prefix;
                    if (!prefix.Prefix) return null;
                    return <Folder key={prefix.Prefix} prefix={prefix.Prefix} />;
                })}
            </Box>
        </Box>
    );
}

interface FolderParams {
    prefix: string;
}
function Folder({ prefix }: FolderParams) {
    const [output, setOutput] = useState<ListObjectsV2CommandOutput>();
    function listKeys() {
        s3.listBucket({ prefix }).then((res) => {
            console.log(res);
            setOutput(res);
        });
    }
    useEffect(() => {
        listKeys();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prefix]);
    return (
        <Box
            id="folder"
            flex={1}
            overflow={"hidden"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"flex-start"}
        >
            <Typography>{prefix}</Typography>
            {output?.Contents?.map((content) => {
                if (!content.Key) return null;
                return <File key={content.Key} path={content.Key} />;
            })}
        </Box>
    );
}

interface FileParams {
    path: string;
}
function File({ path }: FileParams) {
    const [content, setContent] = useState<string>();
    const [open, setOpen] = useState(false);
    function getContent() {
        s3.getFile({ path }).then((res) => {
            console.log(res);
            setContent(res);
        });
    }
    function handleClick() {
        setOpen(!open);
        if (!content) {
            getContent();
        }
    }
    return (
        <Box
            id="file"
            flex={open ? 1 : "0 0"}
            overflow={"hidden"}
            display="flex"
            flexDirection={"column"}
            minHeight={"min-content"}
            maxHeight={"100%"}
            maxWidth={"100%"}
            width={"100%"}
        >
            <Button color="info" onClick={handleClick} sx={{ flexGrow: 0 }}>
                {path}
            </Button>
            {open && (
                <Box overflow="scroll">
                    <Typography whiteSpace={"break-spaces"}>
                        {JSON.stringify(JSON.parse(content ?? "{}"), null, 2)}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
