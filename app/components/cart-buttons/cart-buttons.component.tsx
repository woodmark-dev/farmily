/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import "./cart-button.styles.css";
import { assign, not, setup } from "xstate";
import { useActor, useSelector } from "@xstate/react";
import { cartActor } from "@/app/lib/actors";
import Button from "../button/button.component";

const cartButtonsLogic = setup({
	actions: {
		setProduct: assign({
			product: ({ event }) =>
				event.value.allProducts.find(
					(item: any) => item.id == event.value.productId
				),
		}),
	},
	guards: {
		isProductInCart: ({ event }) =>
			event.value.allProducts.find(
				(item: any) => item.id == event.value.productId
			),
	},
}).createMachine({
	initial: "idle",
	context: {
		product: null,
	},
	states: {
		idle: {
			on: {
				INITIALIZE: {
					guard: "isProductInCart",
					target: "active",
					actions: ["setProduct"],
				},
			},
		},
		active: {
			on: {
				INITIALIZE: [
					{
						guard: not("isProductInCart"),
						target: "idle",
					},
					{
						actions: ["setProduct"],
					},
				],
			},
		},
	},
});

export default function CartButtons({ product }: { product: any }) {
	const [snapshot, send] = useActor(cartButtonsLogic);
	const cartSnapshot: any = useSelector(cartActor, (s) => s);

	useEffect(() => {
		send({
			type: "INITIALIZE",
			value: { productId: product.id, allProducts: cartSnapshot.context.cart },
		});
	}, [cartSnapshot.context.cart, product.id, send]);

	if (snapshot.value == "idle") {
		return (
			<Button
				type="primary"
				handleClick={(e: any) => {
					e.stopPropagation();
					cartActor.send({ type: "ADD_TO_CART", value: product });
				}}
				title="add to cart"
			/>
		);
	}

	return (
		<div className="CartButtons">
			<Button
				type="cart"
				handleClick={(e: any) => {
					e.stopPropagation();
					cartActor.send({ type: "ADD_TO_CART", value: product });
				}}
				title="+"
			/>

			<p className="Count">{snapshot.context.product.count}</p>

			<Button
				type="cart"
				handleClick={(e: any) => {
					e.stopPropagation();
					cartActor.send({ type: "REDUCE_FROM_CART", value: product });
				}}
				title="-"
			/>
		</div>
	);

	// <div className="CartButtons">

	// </div>
}
