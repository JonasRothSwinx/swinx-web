import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { Html, Button, Text, Head, Preview, Container } from "@react-email/components";
import styles from "../../styles";
import { Placeholder } from "../../_components";
import { type TemplateVariables } from ".";

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
};

interface PostDraftDeadlineReminderEmailProps {
    emailLevel: EmailTriggers.emailLevel;
}

export default function PostDraftDeadlineReminderEmail(props: PostDraftDeadlineReminderEmailProps) {
    switch (props.emailLevel) {
        case "new":
            return <NewPostDraftDeadlineReminder />;
        case "reduced":
            return <ReducedDraftPostDeadlineReminder />;
        default:
            throw new Error("Invalid email level");
    }
}

PostDraftDeadlineReminderEmail.PreviewProps = {
    emailLevel: "new",
} satisfies PostDraftDeadlineReminderEmailProps;

function NewPostDraftDeadlineReminder() {
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Deadline für Beitragsentwurf</Preview>
            <Text style={styles.text}>Hallo {placeholders.name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du noch einen Beitragsentwurf für den Kunden {"{{customername}}"}
                zum Thema {"{{topic}}"} bei uns einreichen musst.
            </Text>
            {/* <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container> */}
        </Html>
    );
}

function ReducedDraftPostDeadlineReminder() {
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Deadline für Beitragsentwurf</Preview>
            <Text style={styles.text}>Hallo {placeholders.name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du noch einen Beitragsentwurf einreichen musst.
            </Text>
            <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container>
        </Html>
    );
}
