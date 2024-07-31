import { SxProps } from "@mui/material";

const styles: SxProps = {
    "&": {
        "--background-color": "white",
        position: "relative",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        // padding: "20px",

        "#TempMessageBox": {
            height: "fit-content",
            backgroundColor: "var(--background-color)",
            margin: "10px",
            marginBlock: "auto",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid black",
            textAlign: "center",
        },
        filter: { greyscale: "100%" },
        "@keyframes raveMode": {
            "50%": {
                filter: { greyscale: "100%" },
            },
        },
    },
};

export default styles;
