"use client";
import "./layout.css";

export default function CategoryPageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="CategoryLayout">
			<div className="SideMenu"></div>
			<div className="Products">
				<div>{children}</div>
			</div>
		</div>
	);
}
