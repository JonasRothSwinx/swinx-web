import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { Html, Button, Text, Head, Preview, Container, Hr } from "@react-email/components";
import { Placeholder } from "../_components";
import styles from "../styles";
import PlaceholderList from "../_components/placeholderList";
import { EmailProps } from "../types";
import React from "react";

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
const EmailTemplates: { [key in Exclude<EmailTriggers.emailLevel, "none">]: JSX.Element } = {
    new: <NewCampaignInvite />,
    reduced: <ReducedCampaignInvite />,
};

export default function CampaignInviteEmail(props: EmailProps) {
    if (props.debug)
        return (
            <Html dir="ltr" lang="de">
                {Object.values(EmailTemplates).map((template, index) => (
                    <React.Fragment key={index}>
                        {template}
                        <Hr style={styles.largeDivider} />
                    </React.Fragment>
                ))}
            </Html>
        );
    return EmailTemplates[props.emailLevel];
}
CampaignInviteEmail.PreviewProps = {
    emailLevel: "new",
    debug: true,
} satisfies EmailProps;

function NewCampaignInvite() {
    const { name, assignments, honorar, linkBase, linkData, customerCompany: customerName } = placeholders;
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
                <Button style={styles.responseButton} href={`${linkBase}?q=${linkData}`}>
                    Zur Kampagne
                </Button>
            </Container>
        </Html>
    );
}

function ReducedCampaignInvite() {
    const { name, assignments, honorar, linkBase, linkData, customerCompany: customerName } = placeholders;
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
                <Button style={styles.responseButton} href={`${linkBase}?q=${linkData}`}>
                    Zur Kampagne
                </Button>
            </Container>
        </Html>
    );
}
