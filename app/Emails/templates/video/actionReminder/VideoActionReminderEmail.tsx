import { EmailTriggers } from "@/app/ServerFunctions/types";
import { Html, Button, Text, Head, Preview, Container, Link, Hr } from "@react-email/components";
import styles from "../../styles";
import { Placeholder } from "../../_components";
import { DebugToggle, EmailProps } from "../../types";
import React from "react";
import DebugTemplates from "../../../DebugTemplates";

export type TemplateVariables = {
    name: string;
    customerName: string;
    customerLink: string;
    // postContent: string;
    postTime: string;
};
const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
    customerName: Placeholder({ name: "customerName" }),
    customerLink: Placeholder({ name: "customerLink" }),
    // postContent: Placeholder({ name: "postContent" }),
    postTime: Placeholder({ name: "postTime" }),
};
export const defaultParams: TemplateVariables = {
    name: "testName",
    customerName: "TestCustomer",
    customerLink: "https://www.swinx.de",
    // postContent: "TestContent",
    postTime: "09:00",
};
export const subjectLineBase = "Erinnerung: Beitragsveröffentlichung";

const EmailTemplates: {
    [key in Exclude<EmailTriggers.emailLevel, "none">]: (debug?: boolean) => JSX.Element;
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
    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Erinnerung: Beitragsveröffentlichung</Preview>
            <Text style={styles.text}>Hallo {placeholders.name}!</Text>
            <Text style={styles.text}>
                Wir möchten sie daran erinnern, dass sie heute um {"{{zeit}}"} einen Beitrag für{" "}
                {"{{customername}}"}
                veröffentlichen sollen.
            </Text>
            <Text style={styles.text}>
                Wichtig: <br />
                <ul>
                    <li>
                        Vergiss bitte nicht <Link href="{{customerLink}}">{"customerName"}</Link>{" "}
                        aktiv zu markieren (= anklickbar)
                    </li>
                    <li>
                        Bitte keine Dritt-Marken /-Personen taggen und am selben Tag auch sonst
                        keinen anderen Beitrag posten (für 24 h)
                    </li>
                    <li>Bitte verwende das freigegebene Video und den Beitragstext</li>
                </ul>
            </Text>
            {/* <Text style={styles.text}>
                Der freigegebene Beitragstext ist:
                <br />
                {"{{PostContent}}"}
            </Text> */}
            <Text style={styles.text}>
                Bitte teilen sie uns danach mit, ob alles funktioniert hat.
            </Text>
            {/* <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container> */}
        </Html>
    );
}

function ReducedVideoActionReminder(props: DebugToggle) {
    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Erinnerung: Videoaktion</Preview>
            <Text style={styles.text}>Hallo {placeholders.name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du heute deinen Videobeitrag veröffentlichen
                musst.
            </Text>
            <Container
                align="left"
                style={styles.buttonContainer}
            >
                <Button
                    style={styles.responseButton}
                    href="https://www.swinx.de"
                >
                    Zu Swinx
                </Button>
            </Container>
        </Html>
    );
}
