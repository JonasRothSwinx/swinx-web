import { SxProps } from "@mui/material";

const styles: SxProps = {
    "&": {
        "--background-color": "white",
        position: "relative",
        width: "100vw",
        height: "100vh",
        display: "flex",
        "& #ResponseLandingContainer": {
            position: "relative",
            width: "calc(100vw - 40px)", // Account for left and right margins
            height: "fit-content", // Account for top and bottom margins
            maxHeight: "calc(100vh - 40px)",
            maxWidth: "100vw",
            padding: "20px",
            margin: "20px",
            borderRadius: "10px",
            backgroundColor: "var(--background-color)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
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
            // boxSizing: "border-box",
            // position: "absolute",
            // bottom: "0",
            // right: "0",
            float: "right",
            alignSelf: "flex-end",
            display: "flex",
            flexWrap: "wrap",
            // flexDirection: "column",
            justifyContent: "right",
            alignItems: "end",
            width: "max-content",
            maxWidth: "100%",
            "& button": {
                width: "fit-content",
                margin: "10px",
            },
            "#submitButton": {
                backgroundColor: "primary",
            },
            "#rejectButton": {
                backgroundColor: "secondary",
            },
        },
        "#DescriptionContainer": {
            display: "flex",
            flexDirection: "column",
            maxHeight: "400px",
            background: "var(--background-color)",
            // padding: "2px",
            // border: "1px solid black",
            // borderRadius: "5px",
            "#DescriptionTitle": {
                fontWeight: "bold",
                fontSize: "20px",
                padding: "10px",
                color: "white",
                backgroundColor: "var(--swinx-blue)",
            },
            "#SummaryContainer": {
                display: "flex",
                flexDirection: "row",
                paddingLeft: "10px",
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
        },
        "#AssignmentDescriptionsContainer": {
            overflowY: "auto",
            border: "1px solid black",
            borderRadius: "5px",
        },
        "#AssignmentDescriptionGroup": {
            display: "flex",
            flexDirection: "column",
            // padding: "10px",
            borderBlock: "1px solid black",
            overflow: "auto",

            borderBottom: "none",
            "&:first-of-type": {
                borderTop: "none",
                // borderTopLeftRadius: "5px",
                // borderTopRightRadius: "5px",
                // marginBottom: "10px",
            },
            "&:last-of-type": {
                borderBottom: "none",
                // borderBottomLeftRadius: "5px",
                // borderBottomRightRadius: "5px",
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
