/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import fetcher from "@/app/lib/fetcher";
import { useActor } from "@xstate/react";
import { useEffect } from "react";
import { assign, fromPromise, setup } from "xstate";
import "./page.css";
import ProductCard from "@/app/components/product-card/product-card.component";

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
					target: "live",
				},
				onError: {
					actions: ({ event }) => console.log(event.error),
					target: "idle",
				},
			},
		},
		live: {},
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

	if (snapshot.value == "live") {
		return (
			<div className="CategoryPage">
				<h3>{snapshot.context.products[0].category}</h3>
				<div className="CategoryContainer">
					{snapshot.context.products.map((item: any) => (
						<ProductCard item={item} key={item.id} />
					))}
				</div>
			</div>
		);
	}
}
