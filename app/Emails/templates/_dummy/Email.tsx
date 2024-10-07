import { EmailTriggers } from "@/app/ServerFunctions/types";
import { Html, Button, Text, Head, Preview, Container, Hr } from "@react-email/components";
import { Placeholder } from "../_components";
import styles from "../styles";
import PlaceholderList from "../_components/placeholderList";
import { DebugToggle, EmailProps } from "../types";
import React from "react";
import DebugTemplates from "../../DebugTemplates";

export type TemplateVariables = {
    lorem: string;
};
export const defaultParams: TemplateVariables = {
    lorem: "ipsum",
};

const placeholders: { [key in keyof TemplateVariables]: React.JSX.Element | string } = {
    lorem: Placeholder({ name: "lorem" }),
};
const EmailTemplates: {
    [key in Exclude<EmailTriggers.emailLevel, "none">]: (debug?: boolean) => React.JSX.Element;
} = {
    new: (debug?) => <NewCampaignInvite debug={debug} />,
    reduced: (debug?) => <ReducedCampaignInvite debug={debug} />,
};

export default function Email(props: EmailProps) {
    if (props.debug) return DebugTemplates({ templates: EmailTemplates });
    return EmailTemplates[props.emailLevel]();
}
Email.PreviewProps = {
    emailLevel: "new",
    debug: true,
} satisfies EmailProps;

export const subjectLineBase = "Anfrage für Kooperation";
function NewCampaignInvite(props: DebugToggle) {
    const {} = props.debug ? defaultParams : placeholders;

    return (
        <Html dir="ltr" lang="de">
            <Head />
            {/* <Preview>Anfrage für Kooperation</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir würden sie gerne als Speaker für eine Kampagne unseres Kunden {customerName}{" "}
                gewinnen.
            </Text>
            <Text style={styles.text}>Sie wären dabei für folgende Aufgaben zuständig:</Text>
            {assignments}
            <Text style={styles.text}>
                Das Honorar dafür ist {honorar}. <br />
                Bitte teilen sie uns unter folgendem Link mit, ob sie Interesse haben.
            </Text>
            <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href={`${linkBase}${linkData}`}>
                    Zur Kampagne
                </Button>
            </Container> */}
        </Html>
    );
}

function ReducedCampaignInvite(props: DebugToggle) {
    const {} = props.debug ? defaultParams : placeholders;
    const assignments = props.debug;

    return (
        <Html dir="ltr" lang="de">
            {/* <Head />
            <Preview>Einladung zur Kampagne</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir würden dich gerne als Speaker für eine Kampagne unseres Kunden {customerName}{" "}
                gewinnen.
            </Text>
            <Text style={styles.text}>Du wärst dabei für folgende Aufgaben zuständig:</Text>
            {assignments}
            <Text style={styles.text}>
                Das Honorar dafür ist {honorar}. <br />
                Bitte teile uns unter folgendem Link mit, ob du Interesse hast.
            </Text>
            <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href={`${linkBase}${linkData}`}>
                    Zur Kampagne
                </Button>
            </Container> */}
        </Html>
    );
}
