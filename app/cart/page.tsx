/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSelector } from "@xstate/react";
import "./page.css";
import { cartActor } from "../lib/actors";
import Image from "next/image";
import CartButtons from "../components/cart-buttons/cart-buttons.component";
import TrashIcon from "../components/trash/trash";

export default function CartPage() {
	const cartSnapshot: any = useSelector(cartActor, (s) => s);

	if (cartSnapshot.context.cart.length == 0) {
		return (
			<div>
				<p>Your cart is empty</p>
			</div>
		);
	}

	return (
		<div className="CartPage">
			<h3>Cart</h3>
			<div className="CartProductsContainer">
				{cartSnapshot.context.cart.map((item: any) => (
					<div className="CartProductContainer" key={item.id}>
						<div className="ImageContainer">
							<Image
								width={1000}
								height={1000}
								alt={item.title}
								src={item.image}
							/>
						</div>
						<div className="otherDetails">
							<p>{item.title}</p>
							<p>₦{item.price}</p>
							<CartButtons product={item} />
						</div>
						<div
							className="DeleteButton"
							onClick={() =>
								cartActor.send({ type: "REMOVE_FROM_CART", value: item })
							}
						>
							<TrashIcon />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
