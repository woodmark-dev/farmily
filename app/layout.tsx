import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
	variable: "--primary-font",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "farmily",
	description: "shop for groceries",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${oswald.variable}`}>
			<body>{children}</body>
		</html>
	);
}
