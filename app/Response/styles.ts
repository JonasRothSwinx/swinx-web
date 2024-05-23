import { SxProps } from "@mui/material";

const styles: SxProps = {
    "&": {
        "--background-color": "white",
        position: "relative",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        "#LoadingContainer": {
            width: "100%",
            maxWidth: "80vw",
            height: "--webkit-fill-available",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textWrap: "wrap",
            textAlign: "center",
            wordWrap: "break-word",
        },
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
    },
};

export default styles;
