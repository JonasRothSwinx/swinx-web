import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { Html, Button, Text, Head, Preview, Container } from "@react-email/components";
import { Placeholder } from "../_components";
import styles from "../styles";
import { type TemplateVariables } from ".";

interface InvitesReminderMailProps {
    emailLevel: EmailTriggers.emailLevel;
}

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
    inviteAmount: Placeholder({ name: "inviteAmount" }),
};

export default function InvitesReminderMail(props: InvitesReminderMailProps) {
    switch (props.emailLevel) {
        case "new":
            return <NewInvitesReminder />;
        case "reduced":
            return <ReducedInvitesReminder />;
        default:
            throw new Error("Invalid email level");
    }
}
InvitesReminderMail.PreviewProps = {
    emailLevel: "new",
} satisfies InvitesReminderMailProps;

function NewInvitesReminder() {
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Einladungen</Preview>
            <Text style={styles.text}>Hallo {placeholders.name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du noch {placeholders.inviteAmount} Einladungen offen hast.
            </Text>
            <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container>
        </Html>
    );
}

function ReducedInvitesReminder() {
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Einladungen</Preview>
            <Text style={styles.text}>Hallo {placeholders.name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du noch {placeholders.inviteAmount} Einladungen offen hast.
            </Text>
            <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container>
        </Html>
    );
}
