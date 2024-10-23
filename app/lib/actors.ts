import { createActor, setup } from "xstate";

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

export const productFetcherActor = createActor(productFetcher).start();
