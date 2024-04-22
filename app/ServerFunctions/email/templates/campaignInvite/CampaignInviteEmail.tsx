import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { Html, Button, Text, Head, Preview, Container } from "@react-email/components";
import { Placeholder } from "../_components";
import styles from "../styles";
import PlaceholderList from "../_components/placeholderList";
import { type TemplateVariables } from ".";

interface CampaignInviteEmailProps {
    emailLevel: EmailTriggers.emailLevel;
}

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
    assignments: PlaceholderList({ parentName: "assignments", listItemName: "assignmentDescription" }),
    honorar: Placeholder({ name: "honorar" }),
    linkBase: Placeholder({ name: "linkBase" }),
    linkData: Placeholder({ name: "linkData" }),
};

export default function CampaignInviteEmail(props: CampaignInviteEmailProps) {
    switch (props.emailLevel) {
        case "new":
            return <NewCampaignInvite />;
        case "reduced":
            return <ReducedCampaignInvite />;
        default:
            throw new Error("Invalid email level");
    }
}
CampaignInviteEmail.PreviewProps = {
    emailLevel: "new",
} satisfies CampaignInviteEmailProps;

function NewCampaignInvite() {
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Einladung zur Kampagne</Preview>
            <Text style={styles.text}>Hallo {placeholders.name}!</Text>
            <Text style={styles.text}>Wir laden dich herzlich zur Teilnahme an unserer Kampagne ein.</Text>
            <Text style={styles.text}>Du wärst dabei für folgende Aufgaben zuständig:</Text>
            {placeholders.assignments}
            <Text style={styles.text}>Das Honorar dafür ist {placeholders.honorar}</Text>
            <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href={`${placeholders.linkBase}?q=${placeholders.linkData}`}>
                    Zur Kampagne
                </Button>
            </Container>
        </Html>
    );
}

function ReducedCampaignInvite() {
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Einladung zur Kampagne</Preview>
            <Text style={styles.text}>Hallo {placeholders.name}!</Text>
            <Text style={styles.text}>Wir laden dich herzlich zur Teilnahme an unserer Kampagne ein.</Text>
            <Text style={styles.text}>Du wärst dabei für folgende Aufgaben zuständig:</Text>
            {placeholders.assignments}
            <Text style={styles.text}>Das Honorar dafür ist {placeholders.honorar}</Text>
            <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href={`${placeholders.linkBase}?q=${placeholders.linkData}`}>
                    Zur Kampagne
                </Button>
            </Container>
        </Html>
    );
}
