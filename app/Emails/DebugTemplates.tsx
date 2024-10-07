import React from "react";
import { Hr, Html } from "@react-email/components";
import styles from "./templates/styles";
import { Box } from "@mui/material";
interface DebugTemplatesProps {
    templates: { [key: string]: (debug?: boolean) => React.JSX.Element };
}
export default function DebugTemplates(props: DebugTemplatesProps) {
    return (
        <>
            {Object.entries(props.templates).map(([key, template], index) => (
                <React.Fragment key={index}>
                    <h1>Level: {key}</h1>
                    <div key={index} style={styles.debugBox}>
                        <Html dir="ltr" lang="de">
                            {template(true)}
                            <Hr
                                style={{
                                    visibility: "hidden",
                                    margin: 0,
                                    marginBlockEnd: 0,
                                    marginBlockStart: 0,
                                    marginInlineEnd: 0,
                                    marginInlineStart: 0,
                                }}
                            />
                        </Html>
                    </div>
                </React.Fragment>
            ))}
        </>
    );
}
