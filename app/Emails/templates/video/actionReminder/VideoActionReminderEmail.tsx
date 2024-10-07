import { EmailTriggers } from "@/app/ServerFunctions/types";
import { Html, Button, Text, Head, Preview, Container, Link, Hr } from "@react-email/components";
import styles from "../../styles";
import { Placeholder, Signature } from "../../_components";
import { DebugToggle, EmailProps } from "../../types";
import DebugTemplates from "../../../DebugTemplates";
import { TemplateVariables } from "./TemplateVariables";
import React from "react";

const placeholders: { [key in keyof TemplateVariables]: string } = {
    name: Placeholder({ name: "name" }),
    customerName: Placeholder({ name: "customerName" }),
    customerLink: Placeholder({ name: "customerLink" }),
    // postContent: Placeholder({ name: "postContent" }),
    postTime: Placeholder({ name: "postTime" }),
    taskPageLink: Placeholder({ name: "taskPageLink" }),
};

const EmailTemplates: {
    [key in Exclude<EmailTriggers.emailLevel, "none">]: (debug?: boolean) => React.JSX.Element;
} = {
    new: (debug?) => <NewVideoActionReminder debug={debug} />,
    reduced: (debug?) => <ReducedVideoActionReminder debug={debug} />,
};

export default function VideoPublishReminderEmail(props: EmailProps) {
    if (props.debug) return DebugTemplates({ templates: EmailTemplates });
    return EmailTemplates[props.emailLevel]();
}

VideoPublishReminderEmail.PreviewProps = {
    emailLevel: "new",
    debug: true,
} satisfies EmailProps;

function NewVideoActionReminder(props: DebugToggle) {
    const {
        name,
        customerName,
        customerLink,
        // postContent,
        postTime,
        taskPageLink,
    } = placeholders;
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Beitragsveröffentlichung</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten sie daran erinnern, dass sie {postTime} einen Beitrag für {customerName}
                veröffentlichen sollen.
            </Text>
            <Text style={styles.text}>
                Wichtig: <br />
                <ul>
                    <li>
                        Vergiss bitte nicht <Link href={customerLink}>{customerName}</Link> aktiv zu markieren (=
                        anklickbar)
                    </li>
                    <li>
                        Bitte keine Dritt-Marken /-Personen taggen und am selben Tag auch sonst keinen anderen Beitrag
                        posten (für 24 h)
                    </li>
                    <li>Bitte verwende das freigegebene Video und den Beitragstext</li>
                </ul>
            </Text>
            <Text style={styles.text}>
                Bitte tragen sie im Anschluss den Link auf den veröffentlichten Beitrag auf unserer Plattform ein
                <br />
                Dort können sie auch die für den Beitrag freigegebenen Medien herunterladen.
            </Text>
            <Button style={styles.responseButton} href={placeholders.taskPageLink.toString()}>
                Zur Übersicht
            </Button>
            <Signature />
        </Html>
    );
}

function ReducedVideoActionReminder(props: DebugToggle) {
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Videoaktion</Preview>
            <Text style={styles.text}>Hallo {placeholders.name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du heute deinen Videobeitrag veröffentlichen musst.
            </Text>
            <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container>
            <Signature />
        </Html>
    );
}
