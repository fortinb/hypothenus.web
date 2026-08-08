import { Cart, CartItem, newCart } from "@/src/lib/entities/cart/cart";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { saveCartState } from "../store-persistence";

export interface CartState {
	cart: Cart;
	redirectToCheckout: boolean;
	isCheckingOut: boolean;
	buyNow: boolean;
}

type CartStateSlice = {
	cartState: CartState;
};

export const initialState: CartState = {
	cart: newCart(),
	redirectToCheckout: false,
	isCheckingOut: false,
	buyNow: false
}

export const cartStateSlice = createSlice({
	name: "cartState",
	initialState: initialState,
	reducers: {
		updateCartOrderUuid: (state, action: PayloadAction<string>) => {
			const cart = {
				...state,
				cart: {
					...state.cart,
					orderUuid: action.payload
				}
			};
			saveCartState(cart);
			return cart;
		},
		updateCartBrandOwnership: (state, action: PayloadAction<string>) => {
			const cart = {
				...state,
				cart: {
					...state.cart,
					brandUuid: action.payload
				}
			};
			saveCartState(cart);
			return cart;
		},
		updateCartMemberOwnership: (state, action: PayloadAction<string | null>) => {
			const cart = {
				...state,
				cart: {
					...state.cart,
					memberUuid: action.payload
				}
			};
			saveCartState(cart);
			return cart;
		},		
		setRedirectToCheckout: (state, action: PayloadAction<boolean>) => {
			  const cart = {
				...state,
				redirectToCheckout: action.payload
			  }
			  saveCartState(cart);
			  return cart;
		},	
		setBuyNow: (state, action: PayloadAction<boolean>) => {
			  const cart = {
				...state,
				buyNow: action.payload
			  }
			  saveCartState(cart);
			  return cart;
		},			
		setCartCheckout: (state, action: PayloadAction<boolean>) => {
			  const cart = {
				...state,
				isCheckingOut: action.payload
			  }
			  saveCartState(cart);
			  return cart;
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
			const cart = {
				...state,
				cart: {
					...state.cart,
					items: [...state.cart.items, action.payload],
				},
			};
			saveCartState(cart);
			return cart;
		},
		removeFromCart: (state, action: PayloadAction<{ membershipPlanUuid: string }>) => {
			const cart = {
				...state,
				cart: {
					...state.cart,
					items: state.cart.items.filter(
						(item) => item.membershipPlan.uuid !== action.payload.membershipPlanUuid
					),
				},
			};
			saveCartState(cart);
			return cart;
		},
		updateQuantity: (state, action: PayloadAction<{ membershipPlanUuid: string; quantity: number }>) => {
			if (action.payload.quantity <= 0) {
				const cart = {
					...state,
					cart: {
						...state.cart,
						items: state.cart.items.filter(
							(item) => item.membershipPlan.uuid !== action.payload.membershipPlanUuid
						),
					},
				};
				saveCartState(cart);
				return cart;
			}
			const cart = {
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
			saveCartState(cart);
			return cart;
		},
		clearCart: (state) => {
			const cart = {
				...state,
				redirectToCheckout: false,
				isCheckingOut: false,
				cart: newCart()
			};
			saveCartState(cart);
			return cart;
		},
		resetCart: (state) => {
			const cart = {
				...state,
				redirectToCheckout: false,
				isCheckingOut: false,
				cart: {
					...state.cart,
					orderUuid: null,
					memberUuid: null,
				}
			};
			saveCartState(cart);
			return cart;
		}
	},
});

// Action creators are generated for each case reducer function
export const {
	addToCart,
	removeFromCart,
	updateQuantity,
	clearCart,
	resetCart,
	updateCartBrandOwnership,
	updateCartMemberOwnership,
	setRedirectToCheckout,
	setBuyNow,
	setCartCheckout,
	updateCartOrderUuid
} = cartStateSlice.actions;

export const selectCartCount = (state: CartStateSlice): number =>
	state.cartState.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

export default cartStateSlice.reducer;
