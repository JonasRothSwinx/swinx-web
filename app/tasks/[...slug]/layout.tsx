import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Swinx Kampagneneinladung",
    description: "Swinx hat sie eingeladen, an einer Kampagne teilzunehmen",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
