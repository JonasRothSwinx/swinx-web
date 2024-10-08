import { EmailTriggers } from "@/app/ServerFunctions/types";
import { Html, Hr, Button, Text, Head, Preview, Container, Link } from "@react-email/components";
import styles from "../../styles";
import { Placeholder, Signature } from "../../_components";
import { DebugToggle, EmailProps } from "../../types";
import React from "react";
import DebugTemplates from "../../../DebugTemplates";
import { TemplateVariables, defaultParams } from "./TemplateVariables";

const placeholders: { [key in keyof TemplateVariables]: string } = {
    name: Placeholder({ name: "name" }),
    postTime: Placeholder({ name: "postTime" }),
    customerName: Placeholder({ name: "customerName" }),
    customerProfileLink: Placeholder({ name: "customerProfileLink" }),
    taskPageLink: Placeholder({ name: "taskPageLink" }),
    // postContent: Placeholder({ name: "postContent" }),
};
const EmailTemplates: {
    [key in Exclude<EmailTriggers.emailLevel, "none">]: (debug?: boolean) => React.JSX.Element;
} = {
    new: (debug?) => <NewPostActionReminder />,
    reduced: (debug?) => <ReducedPostActionReminder />,
};
export default function PostActionReminderMail(props: EmailProps) {
    if (props.debug) return DebugTemplates({ templates: EmailTemplates });
    return EmailTemplates[props.emailLevel]();
}

PostActionReminderMail.PreviewProps = {
    emailLevel: "new",
    debug: true,
} satisfies EmailProps;

function NewPostActionReminder(props: DebugToggle) {
    const { name, postTime, customerName, customerProfileLink /*  postContent */, taskPageLink } =
        props.debug ? defaultParams : placeholders;
    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Erinnerung: Beitragsveröffentlichung</Preview>
            <Text style={styles.text}>Sehr geehrte/r {name}!</Text>
            <Text style={styles.text}>
                Wir möchten Sie daran erinnern, dass Sie {postTime} einen Beitrag für {customerName}{" "}
                veröffentlichen sollen.
            </Text>
            <Text style={styles.text}>
                Wichtig: <br />
                <ul>
                    <li>
                        Vergessen Sie bitte nicht,{" "}
                        <Link href={customerProfileLink}>{customerName}</Link> aktiv zu markieren (=
                        anklickbar).
                    </li>
                    <li>
                        Bitte taggen Sie keine Dritt-Marken/-Personen und posten Sie am selben Tag
                        auch sonst keinen anderen Beitrag (für 24 Stunden).
                    </li>
                    <li>Bitte verwenden Sie das freigegebene Bild und den Beitragstext.</li>
                </ul>
            </Text>
            {/* <Text style={styles.text}>
                Der freigegebene Beitragstext lautet:
                <br />
                <Text style={styles.postContent}>{postContent}</Text>
            </Text> */}
            <Text style={styles.text}>
                Bitte tragen sie im Anschluss den Link auf den veröffentlichten Beitrag auf unserer
                Plattform ein
                <br />
                Dort können sie auch die für den Beitrag freigegebenen Medien herunterladen.
            </Text>
            <Button
                style={styles.responseButton}
                href={placeholders.taskPageLink.toString()}
            >
                Zur Übersicht
            </Button>

            {/* <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container> */}
            <Signature />
        </Html>
    );
}

function ReducedPostActionReminder(props: DebugToggle) {
    const { name, postTime, customerName, customerProfileLink /* postContent */ } = props.debug
        ? defaultParams
        : placeholders;
    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Erinnerung: Beitragsveröffentlichung</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du heute um {postTime} einen Beitrag für{" "}
                {customerName}
                veröffentlichen sollst.
            </Text>
            <Text style={styles.text}>
                Wichtig: <br />
                <ul>
                    <li>
                        Vergiss bitte nicht <Link href={customerProfileLink}>{customerName}</Link>{" "}
                        aktiv zu markieren (= anklickbar)
                    </li>
                    <li>
                        Bitte keine Dritt-Marken /-Personen taggen und am selben Tag auch sonst
                        keinen anderen Beitrag posten (für 24 h)
                    </li>
                    <li>Bitte verwende das freigegebene Bild und den Beitragstext</li>
                </ul>
            </Text>
            {/* <Text style={styles.text}>
                Der freigegebene Beitragstext ist:
                <br />
                {postContent}
            </Text> */}
            <Text style={styles.text}>Bitte teile uns danach mit, ob alles funktioniert hat.</Text>
            {/* <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container> */}
            <Signature />
        </Html>
    );
}
