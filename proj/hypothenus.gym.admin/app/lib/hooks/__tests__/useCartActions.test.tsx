import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartStateReducer, {
    selectCartCount,
    selectCartItems,
    selectCheckoutStatus,
} from "@/app/lib/store/slices/cart-state-slice";
import { useOrderActions } from "../useOrderActions";
import { newMembershipPlan } from "@/src/lib/entities/membership-plan";
import { FinancialInstrumentTypeEnum } from "@/src/lib/entities/enum/financial-instrument-type-enum";
import { newAddress } from "@/src/lib/entities/contact/address";

// ── mocks ────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
    useTranslations: () => (key: string, params?: any) => key,
    useLocale: () => "en",
}));

jest.mock("@/app/lib/services/cart-data-service-client", () => ({
    postOrder: jest.fn(),
}));

const mockPostOrder = jest.requireMock("@/app/lib/services/cart-data-service-client")
    .postOrder as jest.MockedFunction<typeof cartService.postOrder>;

// ── test store factory ────────────────────────────────────────────────────────

function makeStore() {
    return configureStore({ reducer: { cartState: cartStateReducer } });
}

// ── helper component ──────────────────────────────────────────────────────────

function HookTester() {
    const {
        addToCart,
        removeFromCart,
        updateQuantity,
        submitOrder,
        isPending,
        showResult,
        resultStatus,
    } = useOrderActions();

    const plan = newMembershipPlan();
    (plan as any).uuid = "plan-test-1";

    const billingDetails = {
        fullName: "Alice",
        email: "alice@example.com",
        address: newAddress(),
        paymentMethod: FinancialInstrumentTypeEnum.creditCard,
    };

    return (
        <div>
            <button onClick={() => addToCart(plan)}>add</button>
            <button onClick={() => removeFromCart("plan-test-1")}>remove</button>
            <button onClick={() => updateQuantity("plan-test-1", 3)}>setQty3</button>
            <button onClick={() => updateQuantity("plan-test-1", 0)}>setQty0</button>
            <button
                onClick={() =>
                    submitOrder(billingDetails, "brand-1", "member-1", [
                        { membershipPlanUuid: "plan-test-1", quantity: 1 },
                    ])
                }
            >
                submit
            </button>
            <div data-testid="pending">{String(isPending)}</div>
            <div data-testid="showResult">{String(showResult)}</div>
            <div data-testid="resultStatus">{String(resultStatus)}</div>
        </div>
    );
}

function renderWithStore(store = makeStore()) {
    render(
        <Provider store={store}>
            <HookTester />
        </Provider>
    );
    return store;
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe("useCartActions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("addToCart", () => {
        it("dispatches addToCart and increments cart count", () => {
            const store = renderWithStore();
            fireEvent.click(screen.getByText("add"));
            expect(selectCartCount(store.getState() as any)).toBe(1);
        });

        it("shows a success toast after adding", () => {
            renderWithStore();
            fireEvent.click(screen.getByText("add"));
            expect(screen.getByTestId("showResult").textContent).toBe("true");
            expect(screen.getByTestId("resultStatus").textContent).toBe("true");
        });

        it("increments quantity when same plan added twice", () => {
            const store = renderWithStore();
            fireEvent.click(screen.getByText("add"));
            fireEvent.click(screen.getByText("add"));
            expect(selectCartCount(store.getState() as any)).toBe(2);
        });
    });

    describe("removeFromCart", () => {
        it("removes the item from the cart", () => {
            const store = renderWithStore();
            fireEvent.click(screen.getByText("add"));
            fireEvent.click(screen.getByText("remove"));
            expect(selectCartItems(store.getState() as any)).toHaveLength(0);
        });
    });

    describe("updateQuantity", () => {
        it("sets quantity to 3", () => {
            const store = renderWithStore();
            fireEvent.click(screen.getByText("add"));
            fireEvent.click(screen.getByText("setQty3"));
            expect(selectCartItems(store.getState() as any)[0].quantity).toBe(3);
        });

        it("removes the item when quantity set to 0", () => {
            const store = renderWithStore();
            fireEvent.click(screen.getByText("add"));
            fireEvent.click(screen.getByText("setQty0"));
            expect(selectCartItems(store.getState() as any)).toHaveLength(0);
        });
    });

    describe("submitOrder — success", () => {
        it("clears cart and sets status to success on ok response", async () => {
            mockPostOrder.mockResolvedValue({
                ok: true,
                data: {
                    orderUuid: "ord-1",
                    createdAt: new Date().toISOString(),
                    status: "confirmed",
                    items: [],
                    total: { amount: 0, currency: { code: "CAD", symbol: "$", name: "Canadian Dollar" } },
                },
            } as any);

            const store = renderWithStore();
            fireEvent.click(screen.getByText("add"));
            fireEvent.click(screen.getByText("submit"));

            await waitFor(() => {
                expect(selectCheckoutStatus(store.getState() as any)).toBe("success");
            });

            expect(selectCartItems(store.getState() as any)).toHaveLength(0);
            expect(screen.getByTestId("resultStatus").textContent).toBe("true");
        });
    });

    describe("submitOrder — error", () => {
        it("sets status to error and keeps cart on failure", async () => {
            mockPostOrder.mockResolvedValue({
                ok: false,
                error: { message: "Server error" },
            } as any);

            const store = renderWithStore();
            fireEvent.click(screen.getByText("add"));
            fireEvent.click(screen.getByText("submit"));

            await waitFor(() => {
                expect(selectCheckoutStatus(store.getState() as any)).toBe("error");
            });

            expect(selectCartItems(store.getState() as any)).toHaveLength(1);
            expect(screen.getByTestId("resultStatus").textContent).toBe("false");
        });
    });
});
