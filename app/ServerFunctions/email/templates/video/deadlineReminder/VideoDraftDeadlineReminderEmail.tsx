import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { Html, Button, Text, Head, Preview, Container, Link } from "@react-email/components";
import styles from "../../styles";
import { Placeholder } from "../../_components";
import { TemplateVariables } from ".";

interface VideoDraftDeadlineReminderEmailProps {
    emailLevel: EmailTriggers.emailLevel;
}

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
};
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
            <Preview>Erinnerung: Deadline für Video</Preview>
            <Text style={styles.text}>Hallo {placeholders.name}!</Text>
            <Text style={styles.text}>
                Wir möchten sie daran erinnern, dass sie noch Video für den Kunden {"{{customername}}"}
                zum Thema {"{{topic}}"} bei uns einreichen müssen.
            </Text>
            {/* <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container> */}
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
