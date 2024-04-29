import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { Html, Button, Text, Head, Preview, Container, Hr } from "@react-email/components";
import { Placeholder } from "../_components";
import styles from "../styles";
import PlaceholderList from "../_components/placeholderList";
import { DebugToggle, EmailProps } from "../types";
import React from "react";
import DebugTemplates from "../../DebugTemplates";

export type TemplateVariables = {
    name: string;
    assignments: { assignmentDescription: string }[];
    honorar: string;
    linkBase: string;
    linkData: string;
    customerCompany: string;
};
export const defaultParams: TemplateVariables = {
    name: "testName",
    assignments: [{ assignmentDescription: "Fliege zum Mars" }],
    honorar: "0€",
    linkBase: "http://localhost:3000/Response?",
    linkData: "testData",
    customerCompany: "TestCustomer",
};
export const subjectLineBase = "Einladung zur Kampagne";

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
    assignments: PlaceholderList({ parentName: "assignments", listItemName: "assignmentDescription" }),
    honorar: Placeholder({ name: "honorar" }),
    linkBase: Placeholder({ name: "linkBase" }),
    linkData: Placeholder({ name: "linkData" }),
    customerCompany: Placeholder({ name: "customerName" }),
};
const EmailTemplates: { [key in Exclude<EmailTriggers.emailLevel, "none">]: (debug?: boolean) => JSX.Element } = {
    new: (debug?) => <NewCampaignInvite debug={debug} />,
    reduced: (debug?) => <ReducedCampaignInvite debug={debug} />,
};

export default function CampaignInviteEmail(props: EmailProps) {
    if (props.debug) return DebugTemplates({ templates: EmailTemplates });
    return EmailTemplates[props.emailLevel]();
}
CampaignInviteEmail.PreviewProps = {
    emailLevel: "new",
    debug: true,
} satisfies EmailProps;

function NewCampaignInvite(props: DebugToggle) {
    const {
        name,
        honorar,
        linkBase,
        linkData,
        customerCompany: customerName,
    } = props.debug ? defaultParams : placeholders;
    const assignments = props.debug
        ? defaultParams.assignments.map((a) => a.assignmentDescription).join("\n")
        : placeholders.assignments;

    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Anfrage für Kooperation</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir würden sie gerne als Speaker für eine Kampagne unseres Kunden {customerName} gewinnen.
            </Text>
            <Text style={styles.text}>Sie wären dabei für folgende Aufgaben zuständig:</Text>
            {assignments}
            <Text style={styles.text}>
                Das Honorar dafür ist {honorar}. <br />
                Bitte teilen sie uns unter folgendem Link mit, ob sie Interesse haben.
            </Text>
            <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href={`${linkBase}${linkData}`}>
                    Zur Kampagne
                </Button>
            </Container>
        </Html>
    );
}

function ReducedCampaignInvite(props: DebugToggle) {
    const {
        name,
        honorar,
        linkBase,
        linkData,
        customerCompany: customerName,
    } = props.debug ? defaultParams : placeholders;
    const assignments = props.debug
        ? defaultParams.assignments.map((a) => a.assignmentDescription).join("\n")
        : placeholders.assignments;
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Einladung zur Kampagne</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir würden dich gerne als Speaker für eine Kampagne unseres Kunden {customerName} gewinnen.
            </Text>
            <Text style={styles.text}>Du wärst dabei für folgende Aufgaben zuständig:</Text>
            {assignments}
            <Text style={styles.text}>
                Das Honorar dafür ist {honorar}. <br />
                Bitte teile uns unter folgendem Link mit, ob du Interesse hast.
            </Text>
            <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href={`${linkBase}${linkData}`}>
                    Zur Kampagne
                </Button>
            </Container>
        </Html>
    );
}
