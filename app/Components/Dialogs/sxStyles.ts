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

/**
 * Default styles, intended to be applied to a Mui dialog Element with classname "dialog"
 */
const DialogDefault: SxProps = {
    "&.dialog": {
        margin: "auto",
        maxWidth: "80vw",
        height: "fit-content",
        padding: "10px",

        ".cellActionSplit": {
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignSelf: "flex-start",
            gap: "5px",
            "> div:first-of-type": {
                flex: 1,
                wordWrap: "break-word",
            },
            "&.timeline > div:last-of-type:not(:only-of-type)": {
                /* background: linear-gradient(90deg, #5f5f5f, #ffffff, 10%, #ffffff, 90%, #5f5f5f 100%); */
                background: "whitesmoke",
                /* background: linear-gradient(
                90deg,
                rgba(95, 95, 95, 1) 0%,
                rgba(255, 255, 255, 1) 5%,
                rgba(255, 255, 255, 1) 95%,
                rgba(95, 95, 95, 1) 100%
            ); */
            },
        },
        ".actions, .cellActionSplit > div:last-of-type:not(:only-of-type)": {
            position: "relative",
            top: 0,
            right: 0,
            flexGrow: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "5px",
            /* border: 1px solid black; */
            height: "fit-content",
            borderRadius: "20px",
            gap: "10px",
        },
        "&::backdrop": {
            backdropFilter: "blur(5px)",
        },
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
        "> button": {
            position: "absolute",
            top: 0,
            right: 0,
            height: "2ch",
            padding: "-4px",
            margin: 0,
        },
        "> h1": {
            textAlign: "center",
        },
        "*": {
            textColor: "unset",
        },
        ".MuiBox-root": {
            display: "flex",
            flexWrap: "wrap",
            // maxHeight: "calc(100% - 64px - 52.5px - 1px)",
            flexDirection: "column",
            width: "100%",
        },
        ".MuiDialogActions-root": {
            maxWidth: "100%",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #e0e0e0",
            ".MuiButton-root": {},
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
                // flex: 1,
            },
            overflow: "hidden",
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
        ".MuiFormControl-root": {
            // padding: "5px",
            minWidth: "20ch",
            margin: "5px",
            flex: 1,
        },
        ".MuiGrid2-root": {
            maxHeight: "50%",
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
        ".textField": {
            color: "white",
            borderColor: "gray",
        },
        ".textField[hidden]": {
            display: "none",
        },
        "&.timelineDialog": {
            ".MuiPaper-root": {
                maxWidth: "90vw",
                minWidth: "max-content",
                maxHeight: "90vh",
                height: "fit-content",
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
                // flex: 1,
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
                flex: 1,
                maxWidth: "max-content",
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
    },
};

const TimelineEventDialog: SxProps = {};
const sxStyles = {
    DialogDefault,
    TimelineEventDialog,
};

export default sxStyles;
