/* eslint-disable @typescript-eslint/no-explicit-any */
// import Image from "next/image";
// import styles from "./page.module.css";
"use client";
import { assign, fromPromise, setup } from "xstate";
import "./page.styles.css";
import { useActor } from "@xstate/react";
import fetcher from "./lib/fetcher";
import { useEffect } from "react";
import ProductCard from "./components/product-card/product-card.component";

const productsLogic = setup({
	actors: {
		fetchProducts: fromPromise(
			async () => await fetcher("https://fakestoreapi.com/products")
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
		products: [],
	},
	initial: "idle",
	states: {
		idle: {
			on: {
				INITIALIZE: {
					target: "fetchingProducts",
				},
			},
		},
		fetchingProducts: {
			invoke: {
				src: "fetchProducts",
				onDone: {
					actions: ["setProducts"],
					target: "live",
				},
				onError: {
					actions: ({ event }) => console.log(event.error),
					target: "error",
				},
			},
		},
		live: {},
		error: {},
	},
});

export default function HomePage() {
	const [snapshot, send] = useActor(productsLogic);

	useEffect(() => {
		send({ type: "INITIALIZE" });
	}, [send]);

	if (snapshot.value == "fetchingProducts") {
		return <div>...loading</div>;
	}

	if (snapshot.value == "live") {
		return (
			<div className="HomePage">
				<h3>all products</h3>
				<div className="ProductsContainer">
					{snapshot.context.products.map((item: any) => (
						<ProductCard item={item} key={item.id} />
					))}
				</div>
			</div>
		);
	}
}
