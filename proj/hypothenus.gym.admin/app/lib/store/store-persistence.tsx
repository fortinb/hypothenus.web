import { newCart } from "@/src/lib/entities/cart/cart";
import { BreadcrumbState } from "./slices/breadcrumb-state-slice";
import { CartState } from "./slices/cart-state-slice";

const CART_STORAGE_KEY = "hypothenus.cart";
const BREADCRUMB_STORAGE_KEY = "hypothenus.breadcrumbs";

export function loadCartState(): CartState {
	if (typeof window === "undefined") {
		return { cart: newCart() };
	}
	try {
		const serialized = localStorage.getItem(CART_STORAGE_KEY);
		if (!serialized) return { cart: newCart() };
		return JSON.parse(serialized);
	} catch {
		return { cart: newCart() };
	}
}

export function saveCartState(state: CartState): void {
	if (typeof window === "undefined") {
		return;
	}
	try {
		const serialized = JSON.stringify(state);
		localStorage.setItem(CART_STORAGE_KEY, serialized);
	} catch {
		// ignore write errors
	}
}

export function loadBreadcrumbState(): BreadcrumbState {
	if (typeof window === "undefined") {
		return { breadcrumbs: [] };
	}
	try {
		const serialized = localStorage.getItem(BREADCRUMB_STORAGE_KEY);
		if (!serialized) return { breadcrumbs: [] };
		return JSON.parse(serialized) as BreadcrumbState;
	} catch {
		return { breadcrumbs: [] };
	}
}

export function saveBreadcrumbState(state: BreadcrumbState): void {
	if (typeof window === "undefined") {
		return;
	}
	try {
		const serialized = JSON.stringify(state);
		localStorage.setItem(BREADCRUMB_STORAGE_KEY, serialized);
	} catch {
		// ignore write errors
	}
}
