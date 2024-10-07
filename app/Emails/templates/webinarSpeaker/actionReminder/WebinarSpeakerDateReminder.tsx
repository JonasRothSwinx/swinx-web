import { EmailTriggers } from "@/app/ServerFunctions/types";
import { Html, Button, Text, Head, Preview, Container } from "@react-email/components";
import styles from "../../styles";
import { Placeholder, Signature } from "../../_components";
import { DebugToggle, EmailProps } from "../../types";

import { TemplateVariables } from "./TemplateVariables";
import DebugTemplates from "@/app/Emails/DebugTemplates";
import React from "react";

export const subjectLineBase = "Erinnerung: Webinar";

export const defaultParams: TemplateVariables = {
    name: "testName",
    time: "00:00",
    webinarTitle: "TestWebinar",
    topic: "TestTopic",
    taskPageLink: "https://www.swinx.de",
};

const placeholders: { [key in keyof TemplateVariables]: React.JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
    time: Placeholder({ name: "time" }),
    webinarTitle: Placeholder({ name: "webinarTitle" }),
    topic: Placeholder({ name: "topic" }),
    taskPageLink: Placeholder({ name: "taskPageLink" }),
};
const EmailTemplates: {
    [key in Exclude<EmailTriggers.emailLevel, "none">]: (debug?: boolean) => React.JSX.Element;
} = {
    new: (debug?) => <NewWebinarSpeakerDateReminder debug={debug} />,
    reduced: (debug?) => <ReducedWebinarSpeakerDateReminder debug={debug} />,
};

export default function WebinarSpeakerDateReminder(props: EmailProps) {
    if (props.debug) return <DebugTemplates templates={EmailTemplates} />;
    return EmailTemplates[props.emailLevel]();
}

WebinarSpeakerDateReminder.PreviewProps = {
    emailLevel: "new",
    debug: true,
} satisfies EmailProps;

function NewWebinarSpeakerDateReminder(props: DebugToggle) {
    const { name, time, webinarTitle, topic } = props.debug ? defaultParams : placeholders;
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Webinar</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten sie daran erinnern, dass sie heute um {time} als Speaker*in im Webinar {webinarTitle}{" "}
                auftreten werden.
                <br />
                Sie werden dabei über {topic} sprechen.
            </Text>
            {/* <Container> */}
            <Button style={styles.responseButton} href={placeholders.taskPageLink.toString()}>
                Zur Übersicht
            </Button>
            <Signature />
        </Html>
    );
}

function ReducedWebinarSpeakerDateReminder(props: DebugToggle) {
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Webinar</Preview>
            <Text style={styles.text}>Hallo {placeholders.name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du heute als Speaker in einem Webinar auftreten wirst.
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
