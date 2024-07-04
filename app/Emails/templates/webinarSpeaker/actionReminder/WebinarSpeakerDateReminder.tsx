import { EmailTriggers } from "@/app/ServerFunctions/types";
import { Html, Button, Text, Head, Preview, Container } from "@react-email/components";
import styles from "../../styles";
import { Placeholder } from "../../_components";
import { DebugToggle, EmailProps } from "../../types";
import DebugTemplates from "../../../DebugTemplates";

export type TemplateVariables = {
    name: string;
    time: string;
    webinarTitle: string;
    topic: string;
};

export const subjectLineBase = "Erinnerung: Webinar";

export const defaultParams: TemplateVariables = {
    name: "testName",
    time: "00:00",
    webinarTitle: "TestWebinar",
    topic: "TestTopic",
};

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
    time: Placeholder({ name: "time" }),
    webinarTitle: Placeholder({ name: "webinarTitle" }),
    topic: Placeholder({ name: "topic" }),
};
const EmailTemplates: {
    [key in Exclude<EmailTriggers.emailLevel, "none">]: (debug?: boolean) => JSX.Element;
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
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Erinnerung: Webinar</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten sie daran erinnern, dass sie heute um {time} als Speaker*in im Webinar{" "}
                {webinarTitle} auftreten werden.
                <br />
                Sie werden dabei über {topic} sprechen.
            </Text>
        </Html>
    );
}

function ReducedWebinarSpeakerDateReminder(props: DebugToggle) {
    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Erinnerung: Webinar</Preview>
            <Text style={styles.text}>Hallo {placeholders.name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du heute als Speaker in einem Webinar
                auftreten wirst.
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
