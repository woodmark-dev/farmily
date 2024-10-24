/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import "./page.css";
import { assign, fromPromise, setup } from "xstate";
import { useActor } from "@xstate/react";
import fetcher from "@/app/lib/fetcher";
import Image from "next/image";
import CartButtons from "@/app/components/cart-buttons/cart-buttons.component";
import LoadingSpinner from "@/app/components/loading-spinner/loading-spinner";

const productLogic = setup({
	actors: {
		fetchProduct: fromPromise(
			async ({ input }) =>
				await fetcher(`https://fakestoreapi.com/products/${input}`)
		),
	},
	actions: {
		setProductId: assign({
			productId: ({ event }) => event.value,
		}),
		setProductDetails: assign({
			productDetail: ({ event }) => event.output,
		}),
	},
}).createMachine({
	context: {
		productId: null,
		productDetail: null,
	},
	initial: "idle",
	states: {
		idle: {
			on: {
				FETCH_PRODUCT: {
					target: "fetchingProduct",
					actions: ["setProductId"],
				},
			},
		},
		fetchingProduct: {
			invoke: {
				src: "fetchProduct",
				input: ({ context }) => context.productId,
				onDone: {
					actions: ["setProductDetails"],
					target: "live",
				},
				onError: {
					target: "error",
				},
			},
		},
		live: {},
		error: {},
	},
});

export default function Product({ params }: { params: { id: number } }) {
	const [snapshot, send] = useActor(productLogic);

	useEffect(() => {
		send({ type: "FETCH_PRODUCT", value: params.id });
	}, [params.id, send]);

	if (snapshot.value == "fetchingProduct") {
		return <LoadingSpinner />;
	}

	if (snapshot.value == "error") {
		return (
			<div>
				<p>Something went wrong. Please refresh page</p>
			</div>
		);
	}

	if (snapshot.value == "live") {
		return (
			<div className="ProductPage">
				<div className="ImageContainer">
					<Image
						width={1000}
						height={1000}
						alt={snapshot.context.productDetail.title}
						src={snapshot.context.productDetail.image}
					/>
				</div>
				<div className="DetailsContainer">
					<div className="Details">
						<h5>{snapshot.context.productDetail.title}</h5>
						<p className="Description">
							{snapshot.context.productDetail.description}
						</p>
						<p className="Price">₦{snapshot.context.productDetail.price}</p>
					</div>
					<CartButtons product={snapshot.context.productDetail} />
				</div>
			</div>
		);
	}
}
