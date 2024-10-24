import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";
import Header from "./components/header/header.component";

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
			<body>
				<div className="MainHeader">
					<Header />
				</div>
				<div className="Body">{children}</div>
			</body>
		</html>
	);
}
