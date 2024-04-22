import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { Html, Button, Text, Head, Preview, Container } from "@react-email/components";
import styles from "../../styles";
import { Placeholder } from "../../_components";
import { type TemplateVariables } from ".";

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
};

interface WebinarSpeakerDateReminderProps {
    emailLevel: EmailTriggers.emailLevel;
}

export default function WebinarSpeakerDateReminder(props: WebinarSpeakerDateReminderProps) {
    switch (props.emailLevel) {
        case "new":
            return <NewWebinarSpeakerDateReminder />;
        case "reduced":
            return <ReducedWebinarSpeakerDateReminder />;
        default:
            throw new Error("Invalid email level");
    }
}

WebinarSpeakerDateReminder.PreviewProps = {
    emailLevel: "new",
} satisfies WebinarSpeakerDateReminderProps;

function NewWebinarSpeakerDateReminder() {
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
        </Html>
    );
}

function ReducedWebinarSpeakerDateReminder() {
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
        </Html>
    );
}
