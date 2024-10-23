"use client";

export default function Category({ params }: { params: { name: string } }) {
	return (
		<div>
			<p>{params.name}</p>
		</div>
	);
}
