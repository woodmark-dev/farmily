/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import fetcher from "@/app/lib/fetcher";
import { useActor } from "@xstate/react";
import { useEffect } from "react";
import { assign, fromPromise, setup } from "xstate";
import "./page.css";
import Image from "next/image";
import Link from "next/link";

const categoryLogic = setup({
	actors: {
		fetchProducts: fromPromise(
			async ({ input }) =>
				await fetcher(`https://fakestoreapi.com/products/category/${input}`)
		),
	},
	actions: {
		setCategoryName: assign({
			categoryName: ({ event }) => event.value,
		}),
		setProducts: assign({
			products: ({ event }) => event.output,
		}),
	},
}).createMachine({
	context: {
		categoryName: "",
		products: [],
	},
	initial: "idle",
	states: {
		idle: {
			on: {
				FETCH_PRODUCTS: {
					target: "fetchingProducts",
					actions: ["setCategoryName"],
				},
			},
		},
		fetchingProducts: {
			invoke: {
				src: "fetchProducts",
				input: ({ context }) => context.categoryName,
				onDone: {
					actions: ["setProducts"],
					target: "idle",
				},
				onError: {
					actions: ({ event }) => console.log(event.error),
					target: "idle",
				},
			},
		},
	},
});

export default function Category({ params }: { params: { name: string } }) {
	const [snapshot, send] = useActor(categoryLogic);

	useEffect(() => {
		send({ type: "FETCH_PRODUCTS", value: `${params.name}` });
	}, [params.name, send]);

	if (snapshot.value == "fetchingProducts") {
		return <div>...Loading</div>;
	}

	return (
		<div className="CategoryPage">
			{snapshot.context.products.map((item: any) => (
				<Link
					href={`/product/${item.id}`}
					key={item.id}
					className="ProductContainer"
				>
					<div className="ImageContainer">
						<Image
							width={1000}
							height={1000}
							alt={item.title}
							src={item.image}
						/>
					</div>
					<div className="Overlay">
						<h5>{item.title}</h5>
						<p>{item.price}</p>
					</div>
				</Link>
			))}
		</div>
	);
}
