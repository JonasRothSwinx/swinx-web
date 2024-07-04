import { ProjectManager } from "@/app/ServerFunctions/types";
import { Column, Font, Link, Markdown, Row, Section, Text } from "@react-email/components";
import styles from "../styles";

export type TemplateVariables = {
    projectManagerFullName: string;
    projectManagerJobTitle: string;
    projectManagerEmail: string;
    projectManagerPhoneNumber?: string;
};

const defaultParams: TemplateVariables = {
    projectManagerFullName: "John Doe",
    projectManagerJobTitle: "Manager",
    projectManagerEmail: " test@swinx.de",
    projectManagerPhoneNumber: "123456789",
};

const placeholders: { [key in keyof TemplateVariables]: JSX.Element } = {
    projectManagerFullName: <></>,
    projectManagerJobTitle: <></>,
    projectManagerEmail: <></>,
    projectManagerPhoneNumber: <></>,
};

export function Signature() {
    const {
        projectManagerFullName,
        projectManagerJobTitle,
        projectManagerEmail,
        projectManagerPhoneNumber,
    } = defaultParams;
    return (
        <Section style={styles.signatureSection}>
            <Text style={styles.signatureText}>Liebe Grüße,</Text>
            <Text style={styles.signatureText}>
                <strong>{projectManagerFullName}</strong>
                <br />
                {projectManagerJobTitle}
                <br />
            </Text>
            <Text style={{ ...styles.signatureText, color: "rgb(82,105,121)" }}>
                <strong>swinx GmbH</strong>
                <br />
                Kantstr. 62
                <br />
                10627 Berlin
                <br />
                Germany
                <br />
            </Text>
            <Section>
                <Row>
                    <Column style={styles.signatureLetterColumn}>T</Column>
                    <Column style={{ color: "rgb(82,105,121)" }}>
                        {projectManagerPhoneNumber}
                    </Column>
                </Row>
                <Row>
                    <Column style={styles.signatureLetterColumn}>E</Column>
                    <Column>
                        <Link href={projectManagerEmail}>{projectManagerEmail}</Link>
                    </Column>
                </Row>
                <Row>
                    <Column style={styles.signatureLetterColumn}>W</Column>
                    <Column>
                        <Link href="https://www.swinx.de">www.swinx.de</Link>
                    </Column>
                </Row>
            </Section>
        </Section>
    );
}
