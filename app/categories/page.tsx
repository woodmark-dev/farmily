/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import "./page.css";
import Link from "next/link";
import { productFetcherActor } from "../lib/actors";
import { useSelector } from "@xstate/react";

export default function Categories() {
	const productFetcherSnapshot: any = useSelector(
		productFetcherActor,
		(s) => s
	);
	return (
		<div className="CategoriesPage">
			<h3>categories</h3>
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
						<p className="Name">{item.name}</p>
						<p className="Tag">check out</p>
					</Link>
				))}
			</div>
		</div>
	);
}
