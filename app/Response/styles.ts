import { SxProps } from "@mui/material";

const styles: SxProps = {
    "&": {
        position: "relative",
        width: "100vw",
        height: "100vh",
        display: "flex",
        "& #ResponseLandingContainer": {
            width: "calc(100vw - 40px)", // Account for left and right margins
            height: "fit-content", // Account for top and bottom margins
            maxHeight: "calc(100vh - 40px)",
            maxWidth: "100vw",
            padding: "10px",
            margin: "20px",
            backgroundColor: "#f0f0f0",
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
        "#LoadingContainer": {
            width: "100%",
            height: "--webkit-fill-available",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        },
        "#ButtonContainer": {
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            "& button": {
                margin: "10px",
            },
            "#submitButton": {
                backgroundColor: "primary",
            },
            "#rejectButton": {
                backgroundColor: "darkRed",
            },
        },
        "#DescriptionContainer": {
            display: "flex",
            // flexDirection: "row",
            maxHeight: "400px",
            background: "#f0f0f0",
            padding: "2px",
            // border: "1px solid black",
            // borderRadius: "5px",
            "#SummaryBox": {
                flex: 3,
            },
            "#InvitesTable": {
                overflowY: "auto",
                flex: 1,
                "& .MuiTableCell-head": {
                    fontWeight: "bold",
                    padding: "10px",
                },
                "& .MuiTableCell-root": {
                    padding: "5px",
                    width: "10em",
                    textAlign: "center",
                },
            },
        },
        "#AssignmentDescriptionGroup": {
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            border: "1px solid black",
            borderBottom: "none",
            "&:first-of-type": {
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
                // marginBottom: "10px",
            },
            "&:last-of-type": {
                borderBottom: "1px solid black",
                borderBottomLeftRadius: "5px",
                borderBottomRightRadius: "5px",
            },
        },
        "#ResponseReceivedContainer": {
            padding: "40px",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
            border: "1px solid black",
            "& #ResponseReceivedText": {
                fontSize: "30px",
                margin: "10px",
            },
            "& #ResponseReceivedButton": {
                margin: "10px",
            },
        },
    },
};

export default styles;
