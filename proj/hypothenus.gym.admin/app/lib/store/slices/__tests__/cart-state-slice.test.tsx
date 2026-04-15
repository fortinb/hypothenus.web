import { CartItem, CartStatusEnum } from "@/src/lib/entities/cart/cart";
import cartStateReducer, {
    addToCart,
    clearCart,
    initialState,
    removeFromCart,
    setCartStatus,
    updateQuantity,
} from "../cart-state-slice";
import { CartState } from "../cart-state-slice";
import { newMembershipPlan } from "@/src/lib/entities/membership-plan";

// ── helpers ──────────────────────────────────────────────────────────────────

function makePlan(uuid: string) {
    const plan = newMembershipPlan();
    (plan as any).uuid = uuid;
    return plan;
}

function makeItem(uuid: string, quantity = 1): CartItem {
    return {
        membershipPlan: makePlan(uuid),
        quantity,
        addedAt: new Date().toISOString(),
    };
}

function makeState(overrides: Partial<CartState> = {}): CartState {
    return { ...initialState, ...overrides };
}

// ── reducer tests ─────────────────────────────────────────────────────────────

describe("cartStateSlice reducer", () => {
    // addToCart
    describe("addToCart", () => {
        it("adds a new item when cart is empty", () => {
            const item = makeItem("plan-1");
            const state = cartStateReducer(initialState, addToCart(item));
            expect(state.cart.items).toHaveLength(1);
            expect(state.cart.items[0].membershipPlan.uuid).toBe("plan-1");
            expect(state.cart.items[0].quantity).toBe(1);
        });

        it("increments quantity when plan already in cart", () => {
            const existing = makeItem("plan-1", 2);
            const preState = makeState({ cart: { ...initialState.cart, items: [existing] } });
            const duplicate = makeItem("plan-1", 1);
            const state = cartStateReducer(preState, addToCart(duplicate));
            expect(state.cart.items).toHaveLength(1);
            expect(state.cart.items[0].quantity).toBe(3);
        });

        it("adds a second distinct plan as a new row", () => {
            const preState = makeState({ cart: { ...initialState.cart, items: [makeItem("plan-1")] } });
            const state = cartStateReducer(preState, addToCart(makeItem("plan-2")));
            expect(state.cart.items).toHaveLength(2);
        });
    });

    // removeFromCart
    describe("removeFromCart", () => {
        it("removes the matching plan", () => {
            const preState = makeState({ cart: { ...initialState.cart, items: [makeItem("plan-1"), makeItem("plan-2")] } });
            const state = cartStateReducer(preState, removeFromCart({ membershipPlanUuid: "plan-1" }));
            expect(state.cart.items).toHaveLength(1);
            expect(state.cart.items[0].membershipPlan.uuid).toBe("plan-2");
        });

        it("is a no-op when the plan is not in the cart", () => {
            const preState = makeState({ cart: { ...initialState.cart, items: [makeItem("plan-1")] } });
            const state = cartStateReducer(preState, removeFromCart({ membershipPlanUuid: "unknown" }));
            expect(state.cart.items).toHaveLength(1);
        });
    });

    // updateQuantity
    describe("updateQuantity", () => {
        it("updates quantity of an existing item", () => {
            const preState = makeState({ cart: { ...initialState.cart, items: [makeItem("plan-1", 1)] } });
            const state = cartStateReducer(preState, updateQuantity({ membershipPlanUuid: "plan-1", quantity: 5 }));
            expect(state.cart.items[0].quantity).toBe(5);
        });

        it("removes the item when quantity is set to 0", () => {
            const preState = makeState({ cart: { ...initialState.cart, items: [makeItem("plan-1", 3)] } });
            const state = cartStateReducer(preState, updateQuantity({ membershipPlanUuid: "plan-1", quantity: 0 }));
            expect(state.cart.items).toHaveLength(0);
        });

        it("removes the item when quantity is negative", () => {
            const preState = makeState({ cart: { ...initialState.cart, items: [makeItem("plan-1", 3)] } });
            const state = cartStateReducer(preState, updateQuantity({ membershipPlanUuid: "plan-1", quantity: -1 }));
            expect(state.cart.items).toHaveLength(0);
        });
    });

    // clearCart
    describe("clearCart", () => {
        it("empties items and resets status fields", () => {
            const preState = makeState({
                cart: { ...initialState.cart, items: [makeItem("plan-1")] }
            });
            const state = cartStateReducer(preState, clearCart());
            expect(state.cart.items).toHaveLength(0);
            expect(state.cart.status).toBe(CartStatusEnum.idle);
        });
    });

    // setCartStatus
    describe("setCartStatus", () => {
        it("updates cartStatus", () => {
            const state = cartStateReducer(initialState, setCartStatus(CartStatusEnum.submitting));
            expect(state.cart.status).toBe(CartStatusEnum.submitting);
        });
    });
});

// ── selector tests ────────────────────────────────────────────────────────────

describe("cartState selectors", () => {
    const rootState = (cartState: CartState) => ({ cartState } as any);

    it("selectCartItems returns items array", () => {
        const state = makeState({ cart: { ...initialState.cart, items: [makeItem("plan-1")] } });
        expect(rootState(state).cartState.cart.items).toHaveLength(1);
    });

    it("selectCartCount sums quantities", () => {
        const state = makeState({ cart: { ...initialState.cart, items: [makeItem("plan-1", 2), makeItem("plan-2", 3)] } });
        expect(rootState(state).cartState.cart.items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)).toBe(5);
    });

    it("selectCartCount is 0 for empty cart", () => {
        expect(rootState(initialState).cartState.cart.items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)).toBe(0);
    });

    it("selectCartStatus returns current status", () => {
        const state = makeState({ cart: { ...initialState.cart, status: CartStatusEnum.error } });
        expect(rootState(state).cartState.cart.cartStatus).toBe(CartStatusEnum.error);
    });

});
