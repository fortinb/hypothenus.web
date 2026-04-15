import { Cart, CartItem, newCart } from "@/src/lib/entities/cart/cart";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface CartState {
	cart: Cart;
}

export const initialState: CartState = {
	cart: newCart()
}

export const cartStateSlice = createSlice({
	name: "cartState",
	initialState: initialState,
	reducers: {
		updateCartOwnership: (state, action: PayloadAction<Partial<Cart>>) => {
			  return {
				...state,
				cart: { ...state.cart, ...action.payload }
			  }
		},
		addToCart: (state, action: PayloadAction<CartItem>) => {
			const existingIndex = state.cart.items.findIndex(
				(item) => item.membershipPlan.uuid === action.payload.membershipPlan.uuid
			);
			if (existingIndex >= 0) {
				return {
					...state,
					cart: {
						...state.cart,
						items: state.cart.items.map((item, idx) =>
							idx === existingIndex
								? { ...item, quantity: item.quantity + action.payload.quantity }
								: item
						),
					},
				};
			}
			return {
				...state,
				cart: {
					...state.cart,
					items: [...state.cart.items, action.payload],
				},
			};
		},
		removeFromCart: (state, action: PayloadAction<{ membershipPlanUuid: string }>) => {
			return {
				...state,
				cart: {
					...state.cart,
					items: state.cart.items.filter(
						(item) => item.membershipPlan.uuid !== action.payload.membershipPlanUuid
					),
				},
			};
		},
		updateQuantity: (state, action: PayloadAction<{ membershipPlanUuid: string; quantity: number }>) => {
			if (action.payload.quantity <= 0) {
				return {
					...state,
					cart: {
						...state.cart,
						items: state.cart.items.filter(
							(item) => item.membershipPlan.uuid !== action.payload.membershipPlanUuid
						),
					},
				}
			}
			return {
				...state,
				cart: {
					...state.cart,
					items: state.cart.items.map((item) =>
						item.membershipPlan.uuid === action.payload.membershipPlanUuid
							? { ...item, quantity: action.payload.quantity }
							: item
					),
				},
			};
		},
		clearCart: (state) => {
			return {
				...state,
				cart: newCart()
			};
		}
	},
});

// Action creators are generated for each case reducer function
export const {
	addToCart,
	removeFromCart,
	updateQuantity,
	clearCart,
	updateCartOwnership
} = cartStateSlice.actions;

export default cartStateSlice.reducer;
