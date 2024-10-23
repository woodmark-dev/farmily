/* eslint-disable @typescript-eslint/no-explicit-any */
import { assign, createActor, setup } from "xstate";

const productFetcher = setup({}).createMachine({
	context: {
		categories: [
			{
				name: "men's clothing",
				imgCover: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
			},
			{
				name: "electronics",
				imgCover: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
			},
			{
				name: "jewelery",
				imgCover:
					"https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
			},
			{
				name: "women's clothing",
				imgCover: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
			},
		],
	},
	initial: "live",
	states: {
		live: {},
	},
});

const cartLogic = setup({
	actions: {
		addToCart: assign({
			cart: ({ event, context }) => {
				const product = event.value;
				const itemInCart = context.cart.find(
					(item: any) => item.id == product.id
				);
				if (itemInCart) {
					const cartWithoutProduct = context.cart.filter(
						(item: any) => item.id != itemInCart.id
					);
					const productWithCountIncrease = {
						...itemInCart,
						count: itemInCart.count + 1,
					};
					return cartWithoutProduct.concat(productWithCountIncrease);
				}
				const productWithCount = { ...product, count: 1 };
				return context.cart.concat(productWithCount);
			},
		}),
		reduceFromCart: assign({
			cart: ({ event, context }) => {
				const product = event.value;
				const itemInCart = context.cart.find(
					(item: any) => item.id == product.id
				);
				if (!itemInCart) {
					return context.cart;
				}
				if (itemInCart.count == 1) {
					const cartWithoutProduct = context.cart.filter(
						(item: any) => item.id != itemInCart.id
					);
					return cartWithoutProduct;
				}
				const cartWithoutProduct = context.cart.filter(
					(item: any) => item.id != itemInCart.id
				);
				const productWithCountDecrease = {
					...itemInCart,
					count: itemInCart.count - 1,
				};
				return cartWithoutProduct.concat(productWithCountDecrease);
			},
		}),
	},
}).createMachine({
	context: {
		cart: [],
	},
	on: {
		ADD_TO_CART: {
			actions: ["addToCart"],
		},
		REDUCE_FROM_CART: {
			actions: ["reduceFromCart"],
		},
	},
});

export const productFetcherActor = createActor(productFetcher).start();
export const cartActor = createActor(cartLogic).start();
