import { SxProps } from "@mui/material";
const DialogButtonContainer: SxProps = {
    "&": {
        justifyContent: "center",
        borderTop: "1px solid #e0e0e0",
    },
    "& .MuiButton-root": {
        margin: "5px",
    },
} as const;

const DialogDefault: SxProps = {
    "&, & .MuiDialog-root": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // maxHeight: "80vh",
        height: "100%",
        padding: "10px",
        // width: "fit-content",
        "--dialogMaxHeight": "80vh",
        maxHeight: "var(--dialogMaxHeight)",
        margin: "auto",
    },

    ".MuiDialog-container": {
        maxWidth: "max(80vw,1000px)",
        minWidth: "min(1000px,100vw)",
        height: "100%",
        maxHeight: "var(--dialogMaxHeight)",
    },
    ".MuiPaper-root": {
        display: "flex",
        flexDirection: "column",
        //padding: "10px",
        maxWidth: "max(80vw,500px)",
        minWidth: "min(1000px,100vw)",
        height: "100%",
        maxHeight: "var(--dialogMaxHeight)",
        // maxHeight: "80vh",
        "& > .MuiBox-root": {
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            flex: 1,
            maxHeight: "100%",
        },
    },
    ".MuiDialogContent-root": {
        maxWidth: "max(80vw,500px)",
        minWidth: "min(500px,100vw)",
        width: "max(40vh,500px)",
        display: "flex",
        flexWrap: "wrap",
        flex: "0 0 fit-content",
        padding: "5px 20px",
        //width: "520px",
        ".MuiTextField-root": {
            flex: 1,
        },
        overflow: "hidden",
    },
    ".MuiFormControl-root": {
        // padding: "5px",
        minWidth: "20ch",
        margin: "5px",
        flex: 1,
    },
    ".MuiBox-root": {
        display: "flex",
        flexWrap: "wrap",
        maxHeight: "calc(100% - 64px - 52.5px - 1px)",
        flexDirection: "column",
        width: "100%",
    },
    ".MuiGrid2-root": {
        maxHeight: "50%",
    },
    ".MuiDialogActions-root": {
        maxWidth: "100%",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        borderTop: "1px solid #e0e0e0",
        ".MuiButton-root": {},
    },
    ".MuiDialogContentText-root": {
        flex: 1,
        flexBasis: "100%",
        flexShrink: 0,
        marginTop: "10px",
        paddingBottom: "4px",
    },
    ".MuiDialogTitle-root": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        borderBottom: "1px solid #e0e0e0",
        textAlign: "center",
    },
};

const TimelineEventDialog: SxProps = {
    "&": {
        ".MuiPaper-root": {
            maxWidth: "90vw",
        },
        ".MuiDialogContent-root": {
            maxWidth: "max(80vw,1000px)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            // width: "520px",
        },
        ".MuiFormControl-root": {
            // padding: "5px",
            minWidth: "20ch",
            margin: "5px",
            flex: 1,
        },
        ".MuiDialogContentText-root": {
            flexBasis: "100%",
            flexShrink: 0,
        },
        ".MuiDialogContent-dividers:nth-of-type(even)": {
            // display: "none",
            border: "none",
        },
        "#EventTriggerSplit": {
            display: "flex",
            flexDirection: "row",
            ".MuiBox-root": {
                padding: "5px",
            },
        },
        "#Event": {
            maxWidth: "600px",
            flex: 2,
            borderRight: "1px solid #e0e0e0",
        },
        "#Trigger": {
            flex: 1,
            padding: "5px",
        },
    },
};
const sxStyles = {
    DialogDefault,
    TimelineEventDialog,
};

export default sxStyles;
