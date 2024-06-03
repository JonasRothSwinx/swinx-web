import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConfigureAmplifyClientSide from "./ConfigureAmplifyClientSide";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Swinx Web",
    // description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de">
            <body className={inter.className} style={{ height: "100dvh", width: "100dvw" }}>
                <ConfigureAmplifyClientSide />
                <>{children}</>
            </body>
        </html>
    );
}
