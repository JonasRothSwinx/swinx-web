import { CSSProperties } from "react";
const styleKeys = ["text", "buttonContainer", "responseButton", "largeDivider", "postContent", "debugBox"] as const;

const swinxBlue = "#1e88e5";
const styles: { [key in (typeof styleKeys)[number]]: CSSProperties } = {
    text: {
        marginBottom: "20px",
    },
    buttonContainer: {
        textAlign: "center",
        // paddingTop: "10px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "left",
        flexDirection: "row",
        gap: "10px",
        width: "100%",
    },
    responseButton: {
        color: "white",
        backgroundColor: swinxBlue,
        padding: "10px",
        borderRadius: "5px",
        textAlign: "center",
        fontSize: "16px",
        width: "max-content",
        maxWidth: "100%",
    },
    largeDivider: {
        backgroundColor: "black",
        height: "20px",
    },
    postContent: {
        backgroundColor: "lightgray",
        whiteSpace: "pre-line",
        padding: "10px",
        maxWidth: "300px",
    },
    debugBox: {
        padding: "10px",
        border: "1px solid black",
        borderRadius: "5px",
        margin: "10px",
    },
} as const;
export default styles;
