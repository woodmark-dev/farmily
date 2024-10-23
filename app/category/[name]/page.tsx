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
			{snapshot.context.products.map((item) => (
				<div key={item.id} className="ProductContainer">
					<Link href={`/product/${item.id}`} className="ImageContainer">
						<Image
							width={1000}
							height={1000}
							alt={item.title}
							src={item.image}
						/>
					</Link>
				</div>
			))}
		</div>
	);
}
