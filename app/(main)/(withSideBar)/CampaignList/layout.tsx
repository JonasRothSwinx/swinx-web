import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kampagnen",
    // description: "Generated by create next app",
};
export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
