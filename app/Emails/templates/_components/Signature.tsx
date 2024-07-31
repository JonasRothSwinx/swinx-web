import { ProjectManager } from "@/app/ServerFunctions/types";
import { Column, Font, Link, Markdown, Row, Section, Text } from "@react-email/components";
import styles from "../styles";
import { SignatureTemplateVariables } from "./SignatureTemplateVariables";
import { Place } from "@mui/icons-material";
import Placeholder from "./placeholder";

const defaultParams: SignatureTemplateVariables = {
    projectManagerFullName: "John Doe",
    projectManagerJobTitle: "Manager",
    projectManagerEmail: "Test <test@swinx.de>",
    projectManagerPhoneNumber: "123456789",
};

const placeholders: { [key in keyof SignatureTemplateVariables]: string } = {
    projectManagerFullName: Placeholder({ name: "projectManagerFullName" }),
    projectManagerJobTitle: Placeholder({ name: "projectManagerJobTitle" }),
    projectManagerEmail: Placeholder({ name: "projectManagerEmail" }),
    projectManagerPhoneNumber: Placeholder({ name: "projectManagerPhoneNumber", isOptional: true }),
};

export function Signature() {
    const {
        projectManagerFullName,
        projectManagerJobTitle,
        projectManagerEmail,
        projectManagerPhoneNumber,
    } = placeholders;
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
                        <Link href={`mailto:${projectManagerEmail}`}>{projectManagerEmail}</Link>
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
