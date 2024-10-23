/* eslint-disable @typescript-eslint/no-explicit-any */

import "./button.styles.css";

export default function Button({
	handleClick,
	type,
	title,
}: {
	handleClick: any;
	type: "primary" | "secondary" | "nuetral" | "cart";
	title: string;
}) {
	return (
		<button onClick={handleClick} data-type={type} className="ButtonComponent">
			{title}
		</button>
	);
}
