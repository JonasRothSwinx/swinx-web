import { Body, Head, Heading, Html, Section } from "@react-email/components";
import { Task } from "../types";
import Link from "next/link";

interface SubmitLinkEmailProps {
    campaignId: string;
    eventId: string;
    // task: Task;
    event: Task["events"][number];
    customerName: string;
    influencerName: string;
    postLink: string;
}
export function SubmitLinkEmail({
    campaignId,
    eventId,
    // task,
    event,
    customerName,
    influencerName,
    postLink,
}: SubmitLinkEmailProps) {
    return (
        <Html>
            <Head>
                <title>{influencerName} hat einen Beitrag veröffentlicht</title>
            </Head>
            <Body>
                <Heading as="h1">
                    {influencerName} hat einen Beitragslink für {customerName} eingereicht
                </Heading>
                <Section>
                    {influencerName} hat einen Beitrags zum Thema {event.eventTitle} veröffentlicht!.
                </Section>
                <Section>
                    <Link href={postLink ?? "<Link fehlt>"}>Beitragslink</Link>
                </Section>
            </Body>
        </Html>
    );
}
