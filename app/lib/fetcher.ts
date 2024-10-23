"use client";

export default async function fetcher(url: string) {
	const res = await fetch(url);
	const data = await res.json();

	if (!res.ok) {
		Promise.reject(data);
		return data;
	}

	return data;
}
