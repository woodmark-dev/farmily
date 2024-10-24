/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import fetcher from "@/app/lib/fetcher";
import { useActor } from "@xstate/react";
import { useEffect } from "react";
import { assign, fromPromise, setup } from "xstate";
import "./page.css";
import ProductCard from "@/app/components/product-card/product-card.component";
import Select from "react-select";
import LoadingSpinner from "@/app/components/loading-spinner/loading-spinner";

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
		sortForLeastPrice: assign({
			products: ({ context }) =>
				context.products.sort((a: any, b: any) => a.price - b.price),
		}),
		sortForMostPriced: assign({
			products: ({ context }) =>
				context.products.sort((a: any, b: any) => b.price - a.price),
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
					target: "error",
				},
			},
		},
		error: {},
		live: {
			on: {
				LEAST_PRICE: {
					actions: ["sortForLeastPrice"],
					target: "leastPriced",
				},
				MOST_PRICED: {
					target: "mostPriced",
					actions: ["sortForMostPriced"],
				},
			},
		},
		leastPriced: {
			on: {
				UNSORTED: {
					target: "fetchingProducts",
				},
				MOST_PRICED: {
					target: "mostPriced",
					actions: ["sortForMostPriced"],
				},
			},
		},
		mostPriced: {
			on: {
				UNSORTED: {
					target: "fetchingProducts",
				},
				LEAST_PRICE: {
					actions: ["sortForLeastPrice"],
					target: "leastPriced",
				},
			},
		},
	},
});

const options = [
	{ value: "UNSORTED", label: "Unsorted" },
	{ value: "LEAST_PRICE", label: "Least Priced" },
	{ value: "MOST_PRICED", label: "Most Priced" },
];

export default function Category({ params }: { params: { name: string } }) {
	const [snapshot, send] = useActor(categoryLogic);

	useEffect(() => {
		send({ type: "FETCH_PRODUCTS", value: `${params.name}` });
	}, [params.name, send]);

	if (snapshot.value == "fetchingProducts") {
		return <LoadingSpinner />;
	}

	if (snapshot.value == "error") {
		return (
			<div>
				<p>Something went wrong. Please refresh page</p>
			</div>
		);
	}

	if (
		snapshot.value == "live" ||
		snapshot.value == "leastPriced" ||
		snapshot.value == "mostPriced"
	) {
		return (
			<div className="CategoryPage">
				<h3>{snapshot.context.products[0].category}</h3>
				<div className="SelectContainer">
					<Select
						options={options}
						defaultValue={options[0]}
						onChange={(e) => send({ type: e?.value || "" })}
					/>
				</div>
				<div className="CategoryContainer">
					{snapshot.context.products.map((item: any) => (
						<ProductCard item={item} key={item.id} />
					))}
				</div>
			</div>
		);
	}
}
