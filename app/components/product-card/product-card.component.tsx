/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import "./product-card.styles.css";
import { useRouter } from "next/navigation";
import CartButtons from "../cart-buttons/cart-buttons.component";

export default function ProductCard({ item }: { item: any }) {
	const router = useRouter();

	return (
		<div
			onClick={() => router.push(`/product/${item.id}`)}
			key={item.id}
			className="ProductContainer"
			role="Link"
		>
			<div className="ImageContainer">
				<Image width={1000} height={1000} alt={item.title} src={item.image} />
			</div>
			<div className="Overlay">
				<div className="DetailContainer">
					<h6 className="Title">{item.title}</h6>
					<p className="Description">₦{item.price}</p>
					<CartButtons product={item} />
				</div>
			</div>
		</div>
	);
}
