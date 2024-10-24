/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import "./header.styles.css";
import CartIcon from "../cart-icon/cart-icon";
import { useSelector } from "@xstate/react";
import { cartActor } from "@/app/lib/actors";
export default function Header() {
	const cartSelector: any = useSelector(cartActor, (s) => s);
	return (
		<div className="Header">
			<div className="Logo">Logo</div>
			<nav className="NavLinks">
				<ul>
					<li>
						<Link href="/categories">categories</Link>
					</li>
					<li>
						<Link href="/">products</Link>
					</li>
				</ul>
			</nav>
			<div className="Icons">
				<div className="Cart">
					<div className="Number">
						{cartSelector.context.cart.reduce(
							(a: any, c: any) => a + c.count,
							0
						)}
					</div>
					<Link href="/cart">
						<CartIcon />
					</Link>
				</div>
			</div>
		</div>
	);
}
