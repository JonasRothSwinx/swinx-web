import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { Html, Button, Text, Head, Preview, Container } from "@react-email/components";
import styles from "../../styles";
import { Placeholder } from "../../_components";
import { type TemplateVariables } from ".";

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
};

interface VideoPublishReminderEmailProps {
    emailLevel: EmailTriggers.emailLevel;
}

export default function VideoPublishReminderEmail(props: VideoPublishReminderEmailProps) {
    switch (props.emailLevel) {
        case "new":
            return <NewVideoActionReminder />;
        case "reduced":
            return <ReducedVideoActionReminder />;
        default:
            throw new Error("Invalid email level");
    }
}

VideoPublishReminderEmail.PreviewProps = {
    emailLevel: "new",
} satisfies VideoPublishReminderEmailProps;

function NewVideoActionReminder() {
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Videoaktion</Preview>
            <Text style={styles.text}>Hallo {placeholders.name}</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du heute deinen Videobeitrag veröffentlichen musst.
            </Text>
            <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container>
        </Html>
    );
}

function ReducedVideoActionReminder() {
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
        </Html>
    );
}
