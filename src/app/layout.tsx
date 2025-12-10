import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Sisterhood of the Rising Phoenix",
    description: "A community for healing and growth.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <html lang="en">
                <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
            </html>
        </ClerkProvider>
    );
}
