import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { Html, Button, Text, Head, Preview, Container } from "@react-email/components";
import styles from "../../styles";
import { Placeholder } from "../../_components";
import { type TemplateVariables } from ".";

interface PostActionReminderMailProps {
    emailLevel: EmailTriggers.emailLevel;
}

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
};
export default function PostActionReminderMail(props: PostActionReminderMailProps) {
    switch (props.emailLevel) {
        case "new":
            return <NewPostActionReminder />;
        case "reduced":
            return <ReducedPostActionReminder />;
        default:
            throw new Error("Invalid email level");
    }
}

PostActionReminderMail.PreviewProps = {
    emailLevel: "new",
} satisfies PostActionReminderMailProps;

function NewPostActionReminder() {
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Beitragsveröffentlichung</Preview>
            <Text style={styles.text}>Hallo {placeholders.name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du noch einen Beitrag veröffentlichen musst.
            </Text>
            <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container>
        </Html>
    );
}

function ReducedPostActionReminder() {
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Beitragsveröffentlichung</Preview>
            <Text style={styles.text}>Hallo {placeholders.name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du noch einen Beitrag veröffentlichen musst.
            </Text>
            <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container>
        </Html>
    );
}
