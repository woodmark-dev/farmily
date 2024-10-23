/* eslint-disable @typescript-eslint/no-explicit-any */
// import Image from "next/image";
// import styles from "./page.module.css";
"use client";
import { useSelector } from "@xstate/react";
import "./page.styles.css";
import { productFetcherActor } from "./lib/actors";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
	const productFetcherSnapshot: any = useSelector(
		productFetcherActor,
		(s) => s
	);

	return (
		<div className="HomePage">
			<div className="Categories">
				{productFetcherSnapshot.context.categories.map((item: any) => (
					<Link
						href={`/category/${item.name}`}
						key={item.name}
						className="CategoryContainer"
					>
						<div className="ImageContainer">
							<Image
								width={1000}
								height={1000}
								alt={item.name}
								src={item.imgCover}
							/>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
