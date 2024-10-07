import { EmailTriggers } from "@/app/ServerFunctions/types";
import { Html, Button, Text, Head, Preview, Container, Hr, Body } from "@react-email/components";
import { Placeholder, Signature } from "../_components";
import styles from "../styles";
import PlaceholderList from "../_components/placeholderList";
import { DebugToggle, EmailProps } from "../types";
import * as React from "react";
import DebugTemplates from "../../DebugTemplates";
import { TemplateVariables, defaultParams } from "./TemplateVariables";

const placeholders: { [key in keyof TemplateVariables]: React.JSX.Element | string } = {
    influencerName: Placeholder({ name: "influencerName" }),
    customerName: Placeholder({ name: "customerName" }),
    taskPageUrl: Placeholder({ name: "taskPageUrl" }),
};
const EmailTemplates: {
    [key in Exclude<EmailTriggers.emailLevel, "none">]: (debug?: boolean) => React.JSX.Element;
} = {
    new: (debug?) => <NewCampaignInvite debug={debug} />,
    reduced: (debug?) => <ReducedCampaignInvite debug={debug} />,
};

export default function Email(props: EmailProps) {
    if (props.debug) return DebugTemplates({ templates: EmailTemplates });
    return EmailTemplates[props.emailLevel]();
}
Email.PreviewProps = {
    emailLevel: "new",
    debug: true,
} satisfies EmailProps;

//MARK: - Subjectline
export const subjectLineBase = "Rückmeldung zur Kooperationsanfrage";
function NewCampaignInvite(props: DebugToggle) {
    const { influencerName, customerName, taskPageUrl } = props.debug ? defaultParams : placeholders;

    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Rückmeldung zur Kooperationsanfrage</Preview>
            <Body>
                <Text style={styles.text}>Hallo {influencerName},</Text>
                <Text style={styles.text}>
                    Ich habe gute Neuigkeiten. <br />
                    Unser Auftraggeber {customerName} war sehr begeistert von Ihrem Interesse an der Kooperation.
                    <br />
                    <br />
                    Gerne würde {customerName} mit Ihnen zusammenarbeiten.
                </Text>
                <Text style={styles.text}>
                    Eine Übersicht über ihren Leistungumfang finden Sie auf unserer Plattform.
                </Text>
                <Text style={styles.text}>Ich freue mich auf die gemeinsame Zusammenarbeit.</Text>
                <Container align="left" style={styles.buttonContainer}>
                    <Button href={taskPageUrl.toString()} style={styles.responseButton}>
                        Zur Leistungsübersicht
                    </Button>
                </Container>
                <Signature />
            </Body>
        </Html>
    );
}

function ReducedCampaignInvite(props: DebugToggle) {
    const { influencerName, customerName } = props.debug ? defaultParams : placeholders;

    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Unser Kunde hat sich für Sie entschieden</Preview>
            <Body>
                <Text style={styles.text}>Hallo {influencerName}!</Text>
                <Text style={styles.text}>
                    Unser Kunde {customerName} hat sich für Sie entschieden und möchte mit ihnen zusammenarbeiten.
                </Text>
                <Container align="left" style={styles.buttonContainer}>
                    {/* <Button
                        href="https://www.google.com"
                        style={styles.responseButton}
                    >
                        Zur Kampagne
                    </Button> */}
                </Container>
            </Body>
        </Html>
    );
}
