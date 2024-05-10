import { SxProps } from "@mui/material";

const styles: SxProps = {
    "&": {
        width: "100vw",
        height: "100vh",
        display: "flex",
        "#ResponseLandingContainer": {
            padding: "20px",
        },
        "#ErrorText": {
            width: "100%",
            height: "100%",
            textAlign: "center",
            fontSize: "30px",
            marginTop: "100px",
            textShadow: "2px 2px 2px black",

            color: "red",
        },
    },
};

export default styles;
