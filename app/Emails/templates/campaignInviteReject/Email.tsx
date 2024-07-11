import { EmailTriggers } from "@/app/ServerFunctions/types";
import { Html, Button, Text, Head, Preview, Container, Hr, Body } from "@react-email/components";
import { Placeholder } from "../_components";
import styles from "../styles";
import PlaceholderList from "../_components/placeholderList";
import { DebugToggle, EmailProps } from "../types";
import * as React from "react";
import DebugTemplates from "../../DebugTemplates";
import { TemplateVariables } from "./TemplateVariables";

export const defaultParams: TemplateVariables = {
    influencerName: "Max Mustermann",
    customerName: "Musterfirma",
};

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    influencerName: Placeholder({ name: "influencerName" }),
    customerName: Placeholder({ name: "customerName" }),
};
const EmailTemplates: {
    [key in Exclude<EmailTriggers.emailLevel, "none">]: (debug?: boolean) => JSX.Element;
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

export const subjectLineBase = "Unser Kunde hat sich leider nicht für sie entschieden!";
function NewCampaignInvite(props: DebugToggle) {
    const { influencerName, customerName } = props.debug ? defaultParams : placeholders;

    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Unser Kunde hat sich nicht für Sie entschieden</Preview>
            <Body>
                <Text style={styles.text}>Hallo {influencerName}!</Text>
                <Text style={styles.text}>
                    Unser Kunde {customerName} hat sich für eine*n andere*n Kooperationspartner
                    entschieden.
                    <br />
                    Wir danken Ihnen dennoch für ihr Interesse und freuen uns auf eine zukünftige
                    Zusammenarbeit.
                </Text>
            </Body>
        </Html>
    );
}

function ReducedCampaignInvite(props: DebugToggle) {
    const { influencerName, customerName } = props.debug ? defaultParams : placeholders;

    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Unser Kunde hat sich nicht für Sie entschieden</Preview>
            <Body>
                <Text style={styles.text}>Hallo {influencerName}!</Text>
                <Text style={styles.text}>
                    Unser Kunde {customerName} hat sich für eine*n andere*n Kooperationspartner
                    entschieden.
                    <br />
                    Wir danken Ihnen dennoch für ihr Interesse und freuen uns auf eine zukünftige
                    Zusammenarbeit.
                </Text>
            </Body>
        </Html>
    );
}
