import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { Html, Button, Text, Head, Preview, Container } from "@react-email/components";
import styles from "../../styles";
import { Placeholder } from "../../_components";

interface VideoDraftDeadlineReminderEmailProps {
    emailLevel: EmailTriggers.emailLevel;
}

export default function VideoDraftDeadlineReminderEmail(props: VideoDraftDeadlineReminderEmailProps) {
    switch (props.emailLevel) {
        case "new":
            return <NewVideoDraftDeadlineReminder />;
        case "reduced":
            return <ReducedVideoDraftDeadlineReminder />;
        default:
            throw new Error("Invalid email level");
    }
}

VideoDraftDeadlineReminderEmail.PreviewProps = {
    emailLevel: "new",
} satisfies VideoDraftDeadlineReminderEmailProps;

function NewVideoDraftDeadlineReminder() {
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Deadline für Videobeitrag</Preview>
            <Text style={styles.text}>
                Hallo <Placeholder name="name" />!
            </Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du noch einen Entwurf für einen Videobeitrag einreichen musst.
            </Text>
            <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container>
        </Html>
    );
}

function ReducedVideoDraftDeadlineReminder() {
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Deadline für Videobeitrag</Preview>
            <Text style={styles.text}>
                Hallo <Placeholder name="name" />!
            </Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du noch einen Entwurf für einen Videobeitrag einreichen musst.
            </Text>
            <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container>
        </Html>
    );
}
