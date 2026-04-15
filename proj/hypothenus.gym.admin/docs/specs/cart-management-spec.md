# Cart Management for Membership Plans — Specification & Development Plan

**Date:** 2026-04-11  
**Scope:** Member-facing cart for purchasing membership plans  
**Target area:** `app/[lang]/members/[brandId]/memberships`

---

## 1. Feature Overview

Members browsing the membership plans page can add one or more plans to a cart and proceed to checkout. The cart lives as a client-side Redux slice (persisted to `localStorage`) with optional backend synchronisation. Checkout creates a **Membership** record and optionally triggers a payment intent.

### In-scope (this spec)

| # | Capability |
|---|---|
| C1 | Add a plan to the cart from `ModalBuyMembershipPlan` ("Add to Cart") |
| C2 | "Buy Now" shortcut — add + go straight to checkout |
| C3 | Cart panel (right column of the memberships page) showing items, subtotal, remove action |
| C4 | Cart badge / counter in the header nav |
| C5 | Checkout form — billing details, submit order |
| C6 | Order confirmation page |
| C7 | Cart persistence via `localStorage` (survives page refresh) |
| C8 | i18n for EN + FR |

### Out-of-scope (future)

- Backend cart session API (persist cart server-side)
- Payment gateway integration (Stripe, etc.) — checkout form will submit an **order request** to the backend; actual payment processing is a separate feature
- Guest / unauthenticated cart

---

## 2. Code Standards & Conventions

All code generated for this feature **must conform to the existing application's code style and patterns**. Uniformity across the entire codebase takes priority over personal preferences or alternative approaches.

### 2.1 File & Module Conventions

| Convention | Rule |
|---|---|
| Directive placement | `"use client"` on line 1 for client components, omitted for server components — consistent with `membership-plans-list.tsx`, `membership-plan-card.tsx`, etc. |
| File extension | `.tsx` for all React components and entity definitions, consistent with existing files |
| File naming | kebab-case, e.g. `cart-state-slice.tsx`, `cart-panel.tsx` — consistent with all existing slices and components |
| Export style | Named exports only (no default exports) — consistent with all existing slices, services, and hooks |
| Entity files | Plain TypeScript `interface` / `type` / `const enum` — no logic, no React — consistent with `src/lib/entities/` |

### 2.2 Redux Slice Pattern

Follow the exact structure of existing slices such as `membership-plan-state-slice.tsx` and `member-state-slice.tsx`:
- Use `createSlice` from `@reduxjs/toolkit`
- State interface declared above the slice
- `initialState` constant declared separately
- Actions exported as named exports from `slice.actions`
- Reducer exported as the default export
- Selectors as plain functions accepting `RootState`

### 2.3 Service Pattern

Follow `membership-plans-data-service-client.tsx`:
- `"use client"` directive
- Each function is an `async` named export returning `Promise<Result<T>>`
- Use the existing `axiosInterceptor` (client-side)
- URL path construction matches `/v1/brands/{brandUuid}/...` convention
- Error handling delegated to the `handleResultClient` helper

### 2.4 Hook Pattern

Follow `useCrudActions.tsx` and `useToastResult.tsx`:
- `"use client"` directive
- Hook is a named export
- Uses `useAppDispatch` / `useAppSelector` from `useStore.tsx`
- Uses `useTransition` for async operations where applicable
- Toast feedback via `useToastResult`

### 2.5 Form Pattern

Follow `registration-form.tsx` and existing admin forms:
- `react-hook-form` with `zodResolver`
- Zod schema declared in a separate `*-schema.tsx` file co-located with the form, or in `app/lib/forms/`
- Field error display via the existing `errorsUtils.tsx` helpers
- Submit button disabled while `isSubmitting`

### 2.6 UI / Styling

- **Bootstrap / react-bootstrap** components only — no other CSS frameworks
- **Bootstrap Icons** (`bi-*`) for all icons — consistent with the rest of the UI
- Responsive layout using Bootstrap grid (`Row` / `Col`) — consistent with `memberships/page.tsx`
- No inline `style` props unless absolutely required
- Class names via `className` string — consistent with the rest of the codebase

### 2.7 i18n

- All user-visible strings via `useTranslations(namespace)` from `next-intl` — no hardcoded strings
- Namespace matches the message file name (e.g. `useTranslations("cart")` reads `messages/[lang]/cart.json`)
- Translation keys use camelCase at every level — consistent with existing message files

### 2.8 TypeScript

- Strict typing throughout — no `any`, no `as unknown`
- Reuse existing entity types (`MembershipPlan`, `Cost`, `Address`, etc.) rather than redefining them
- New entity types placed under `src/lib/entities/` following the existing folder structure

---

## 3. User Stories

### US-1 — Add to Cart
> As a member, when I click "Add to Cart" on a membership plan, the plan is added to my cart and the cart panel updates to show the new item.

**Acceptance criteria**
- The plan appears in the cart with quantity = 1.
- If the same plan is already in the cart its quantity increments by 1.
- A success toast is shown: *"[Plan name] added to cart"*.
- The cart badge in the header reflects the new total count.

### US-2 — Buy Now
> As a member, when I click "Buy Now", the plan is added to my cart and I am scrolled/directed to the checkout section.

**Acceptance criteria**
- Same behaviour as US-1 plus the cart panel scrolls into view / the checkout section is highlighted.

### US-3 — View Cart
> As a member, I can see all plans in my cart in the right-hand panel of the memberships page: plan name, billing frequency, price per billing cycle, quantity, line total, and a remove button.

**Acceptance criteria**
- Subtotal = sum of all line totals.
- Currency is rendered using the existing `getMembershipPlanPrice` helper.
- Empty cart shows a friendly empty-state message.

### US-4 — Remove Item
> As a member, I can remove a single plan from the cart.

**Acceptance criteria**
- Clicking the remove icon removes the line; count decrements accordingly.
- If the cart becomes empty the empty-state message is shown.

### US-5 — Cart Persistence
> As a member, when I refresh the page or navigate away and come back, my cart is still populated.

**Acceptance criteria**
- Cart state is written to `localStorage` on every change.
- On initial load, the cart state is hydrated from `localStorage`.

### US-6 — Checkout
> As a member, I can click "Proceed to Checkout" to fill in billing details and submit the order.

**Acceptance criteria**
- Form fields: full name (pre-filled from member profile), email (pre-filled), billing address, preferred payment method (select).
- On submit, a POST request is sent to the backend.
- On success, the cart is cleared and an order-confirmation panel is shown.
- On failure, a toast error is shown and the cart is preserved.

### US-7 — Cart Badge
> As a member, the navigation header shows a cart icon with a numeric badge showing the total number of plan-items in the cart.

---

## 4. Data Model

### 3.1 `CartItem`

```ts
// src/lib/entities/cart/cart-item.tsx
interface CartItem {
  membershipPlan: MembershipPlan;
  quantity: number;         // >= 1
  addedAt: string;          // ISO 8601
}
```

### 3.2 `CartState` (Redux slice)

```ts
// app/lib/store/slices/cart-state-slice.tsx
interface CartState {
  items: CartItem[];          // ordered by addedAt
  checkoutStatus: 'idle' | 'submitting' | 'success' | 'error';
  checkoutError: string | null;
}
```

### 3.3 `OrderRequest`

```ts
// src/lib/entities/cart/order-request.tsx
interface OrderRequest {
  brandUuid: string;
  memberUuid: string;
  items: Array<{
    membershipPlanUuid: string;
    quantity: number;
  }>;
  billingDetails: BillingDetails;
}

interface BillingDetails {
  fullName: string;
  email: string;
  address: Address;           // reuse existing Address entity if present
  paymentMethod: PaymentMethodEnum;
}

enum PaymentMethodEnum {
  creditCard = 'creditCard',
  bankTransfer = 'bankTransfer',
}
```

### 3.4 `OrderResponse`

```ts
// src/lib/entities/cart/order-response.tsx
interface OrderResponse {
  orderUuid: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'failed';
  items: Array<{ membershipPlanUuid: string; quantity: number; lineTotal: Cost }>;
  total: Cost;
}
```

---

## 5. Redux State Design

### New slice: `cartState`

File: `app/lib/store/slices/cart-state-slice.tsx`

| Action | Payload | Effect |
|---|---|---|
| `addToCart` | `CartItem` | Upsert by `membershipPlan.uuid`: increment qty if exists, else push |
| `removeFromCart` | `{ membershipPlanUuid: string }` | Filter out matching item |
| `updateQuantity` | `{ membershipPlanUuid: string; quantity: number }` | Set quantity; remove if quantity ≤ 0 |
| `clearCart` | — | Reset to empty `items: []` |
| `setCheckoutStatus` | `CartState['checkoutStatus']` | Update checkout status |
| `setCheckoutError` | `string \| null` | Update error message |

Selectors:
- `selectCartItems` → `CartItem[]`
- `selectCartCount` → total quantity (sum of all `item.quantity`)
- `selectCartSubtotal(locale)` → formatted string (uses `getMembershipPlanPrice`)
- `selectCheckoutStatus` → `'idle' | 'submitting' | 'success' | 'error'`

### localStorage middleware

Add a Redux middleware (or `store.subscribe` listener) that serialises `cartState` to `localStorage` on every dispatch and rehydrates it as the Redux `preloadedState` on startup.

File: `app/lib/store/cart-persistence.tsx`

```ts
const CART_STORAGE_KEY = 'hypothenus.cart';
export function loadCartState(): Partial<CartState> { ... }
export function saveCartState(state: CartState): void { ... }
```

---

## 6. UI Components

### 5.1 Component tree

```
memberships/page.tsx  (Server Component)
├── MembershipMenu            (existing — gym filter)
├── MembershipPlansList       (existing — left column)
│   └── MembershipPlansListDetails
│       └── MembershipPlanCard  → opens ModalBuyMembershipPlan
│           └── ModalBuyMembershipPlan  (existing — wire up addToCart / buyNow)
└── CartPanel                (NEW — right column)
    ├── CartItemRow           (NEW — one per CartItem)
    └── CartCheckoutForm      (NEW — shown when clicking "Proceed to Checkout")
        └── CartOrderConfirmation (NEW — shown on success)
```

Header (existing layout):
```
Header
└── CartBadge               (NEW — icon + count)
```

### 5.2 `CartPanel`

File: `app/[lang]/members/[brandId]/memberships/cart-panel.tsx`  
Type: `"use client"`

Props: `{ brandId: string; locale: string }`

Renders:
- Heading: *"Your Cart"* (i18n: `cart.panel.title`)
- If `items.length === 0` → `<CartEmptyState>`
- Else → list of `<CartItemRow>` + subtotal + `<CartCheckoutForm>` button

### 5.3 `CartItemRow`

File: `app/[lang]/members/[brandId]/memberships/cart-item-row.tsx`  
Type: `"use client"`

Props: `{ item: CartItem; locale: string }`

Displays: plan name · billing label · price · quantity stepper · line total · remove button (bi-trash icon)

### 5.4 `CartCheckoutForm`

File: `app/[lang]/members/[brandId]/memberships/cart-checkout-form.tsx`  
Type: `"use client"`

Uses `react-hook-form` + Zod schema `CartCheckoutSchema`.

Fields:
| Field | Type | Validation |
|---|---|---|
| `fullName` | text | required, min 2 |
| `email` | email | required, valid email |
| `addressLine1` | text | required |
| `addressLine2` | text | optional |
| `city` | text | required |
| `postalCode` | text | required |
| `paymentMethod` | select | required, one of `PaymentMethodEnum` |

On submit → dispatches `setCheckoutStatus('submitting')` → calls `postOrder()` service → on success dispatches `clearCart()` + `setCheckoutStatus('success')`.

### 5.5 `CartOrderConfirmation`

File: `app/[lang]/members/[brandId]/memberships/cart-order-confirmation.tsx`  
Type: `"use client"`

Shows order UUID, date, items, total. Button: *"View My Memberships"* → navigate to payments page.

### 5.6 `CartBadge`

File: `app/ui/components/cart/cart-badge.tsx`  
Type: `"use client"`

Uses `useAppSelector(selectCartCount)`. Renders bootstrap icon `bi-cart3` + `<Badge>` when count > 0.  
Mount in the existing Header component.

---

## 7. Service Layer

### 6.1 `cart-data-service-client.tsx`

File: `app/lib/services/cart-data-service-client.tsx`  
Type: `"use client"` (axios)

```ts
postOrder(brandUuid: string, orderRequest: OrderRequest): Promise<Result<OrderResponse>>
```

Endpoint: `POST /v1/brands/{brandUuid}/orders`

### 6.2 Hook: `useCartActions`

File: `app/lib/hooks/useCartActions.tsx`  
Type: `"use client"`

```ts
const { addToCart, removeFromCart, updateQuantity, submitOrder } = useCartActions();
```

- `addToCart(plan: MembershipPlan)` → dispatches `addToCart` action + shows success toast
- `removeFromCart(planUuid: string)` → dispatches `removeFromCart`
- `updateQuantity(planUuid: string, qty: number)` → dispatches `updateQuantity`
- `submitOrder(billingDetails: BillingDetails, brandUuid, memberUuid)` → calls service, dispatches status actions, shows error toast on failure

---

## 8. Wiring Existing Components

### 7.1 `membership-plan-card.tsx`

Replace the no-op `handleResult`:

```ts
// BEFORE
const handleResult = (addToCart: boolean, buyNow: boolean, membershipPlan?: MembershipPlan) => {
  setShowBuyModal(false);
};

// AFTER
const { addToCart: addToCartAction } = useCartActions();
const handleResult = (addToCart: boolean, buyNow: boolean, membershipPlan?: MembershipPlan) => {
  setShowBuyModal(false);
  if ((addToCart || buyNow) && membershipPlan) {
    addToCartAction(membershipPlan);
    if (buyNow) {
      // scroll / focus cart panel
      document.getElementById('cart-panel')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
};
```

### 7.2 `memberships/page.tsx`

Replace empty right-column `<div>` with `<CartPanel brandId={brandId} locale={locale} />`.

### 7.3 `store.tsx`

Add `cartState: cartReducer` to the Redux `configureStore` call.

### 7.4 `store-provider.tsx`

Hydrate `preloadedState` from `loadCartState()` on mount.

### 7.5 Header component

Mount `<CartBadge />` next to existing nav items.

---

## 9. i18n

### `messages/en/entity.json` — existing `cart` node (unchanged)

The `cart` node already present in `entity.json` is **kept as-is**. It is used by `modal-buy-membership-plan.tsx` via `useTranslations("entity")` and must not be moved or removed.

```json
"cart": {
  "buttons": {
    "buyNow": "Buy now",
    "addToCart": "Add to cart"
  },
  "actions": {
    "buyingNow": "Thank you for your purchase !",
    "addingToCart": "Adding to cart..."
  }
}
```

---

### `messages/en/cart.json` — new cart-panel keys

This file contains only the keys required for the new cart panel UI. It does **not** duplicate the `buttons` or `actions` keys already in `entity.json`.

```json
{
  "panel": {
    "title": "Your Cart",
    "empty": "Your cart is empty.",
    "emptySubtitle": "Browse membership plans and add one to get started.",
    "subtotal": "Subtotal",
    "itemCount": "{count, plural, =0 {no items} one {# item} other {# items}}",
    "proceedToCheckout": "Proceed to Checkout"
  },
  "item": {
    "remove": "Remove",
    "quantity": "Qty",
    "lineTotal": "Total"
  },
  "checkout": {
    "title": "Checkout",
    "fields": {
      "fullName": "Full Name",
      "email": "Email",
      "addressLine1": "Address Line 1",
      "addressLine2": "Address Line 2 (optional)",
      "city": "City",
      "postalCode": "Postal Code",
      "paymentMethod": "Payment Method"
    },
    "paymentMethods": {
      "cash": "Cash",
      "credit_card": "Credit Card",
      "debit_card": "Debit Card",
      "bank_transfer": "Bank Transfer"
    },
    "buttons": {
      "submit": "Place Order",
      "submitting": "Placing order..."
    },
    "validation": {
      "fullNameRequired": "Full name is required.",
      "emailRequired": "Email is required.",
      "emailInvalid": "Please enter a valid email address.",
      "addressLine1Required": "Address is required.",
      "cityRequired": "City is required.",
      "postalCodeRequired": "Postal code is required.",
      "paymentMethodRequired": "Please select a payment method."
    }
  },
  "confirmation": {
    "title": "Order Confirmed!",
    "subtitle": "Thank you for your order.",
    "orderNumber": "Order #{orderUuid}",
    "placedOn": "Placed on {date}",
    "total": "Order Total",
    "viewMemberships": "View My Memberships"
  },
  "toast": {
    "addedToCart": "{planName} added to cart.",
    "removedFromCart": "Item removed from cart.",
    "orderSuccess": "Your order has been placed successfully!",
    "orderError": "Something went wrong placing your order. Please try again."
  },
  "badge": {
    "ariaLabel": "{count, plural, =0 {cart is empty} one {# item in cart} other {# items in cart}}"
  }
}
```

Create a matching `messages/fr/cart.json` with French translations.

> **Translation ownership summary:**
> - `ModalBuyMembershipPlan` → continues using `useTranslations("entity")` for `cart.buttons` and `cart.actions`.
> - All new cart-panel components (`CartPanel`, `CartItemRow`, `CartCheckoutForm`, `CartOrderConfirmation`, `CartBadge`) → use `useTranslations("cart")`.

---

## 10. Development Plan

Tasks are listed in dependency order. Each task is self-contained and testable.

---

### Phase 1 — Foundation

#### Task 1.1 — Entities
**Files to create:**
- `src/lib/entities/cart/cart-item.tsx`
- `src/lib/entities/cart/order-request.tsx`
- `src/lib/entities/cart/order-response.tsx`
- `src/lib/entities/enum/payment-method-enum.tsx`

No logic, just TypeScript interfaces and enums.

---

#### Task 1.2 — Cart Redux Slice
**File to create:** `app/lib/store/slices/cart-state-slice.tsx`

Implement actions: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `setCheckoutStatus`, `setCheckoutError`.  
Implement selectors: `selectCartItems`, `selectCartCount`, `selectCartSubtotal`, `selectCheckoutStatus`.

**Unit test:** `app/lib/store/slices/__tests__/cart-state-slice.test.tsx`

---

#### Task 1.3 — localStorage Persistence
**File to create:** `app/lib/store/cart-persistence.tsx`

Implement `loadCartState()` and `saveCartState()`.  
Add `store.subscribe(() => saveCartState(store.getState().cartState))` in `store.tsx`.  
Pass `preloadedState: { cartState: loadCartState() }` to `configureStore`.

> Guard `typeof window !== 'undefined'` for SSR safety.

**Unit test:** `app/lib/store/__tests__/cart-persistence.test.tsx`

---

#### Task 1.4 — Register Reducer in Store
**File to modify:** `app/lib/store/store.tsx`

Add `cartState: cartReducer` to `combineReducers` / `configureStore`.

---

#### Task 1.5 — i18n Messages
**Files to modify:**
- `messages/en/cart.json` — fill with full content from §9
- `messages/fr/cart.json` — fill with French translations

No code changes; validates that missing translation keys crash is caught at build time.

---

### Phase 2 — Service & Hook

#### Task 2.1 — Cart Data Service
**File to create:** `app/lib/services/cart-data-service-client.tsx`

Implement `postOrder(brandUuid, orderRequest)` using existing axios interceptor pattern (see `membership-plans-data-service-client.tsx` for reference).

---

#### Task 2.2 — `useCartActions` Hook
**File to create:** `app/lib/hooks/useCartActions.tsx`

Implement `addToCart`, `removeFromCart`, `updateQuantity`, `submitOrder`.  
Use `useAppDispatch`, `useToastResult` (existing), `useTranslations("cart")`.

**Unit test:** `app/lib/hooks/__tests__/useCartActions.test.tsx`

---

### Phase 3 — UI Components

#### Task 3.1 — `CartBadge`
**File to create:** `app/ui/components/cart/cart-badge.tsx`

Simple: `bi-cart3` icon + Bootstrap `Badge` using `selectCartCount`.

---

#### Task 3.2 — `CartItemRow`
**File to create:** `app/[lang]/members/[brandId]/memberships/cart-item-row.tsx`

Renders one cart item. Calls `removeFromCart` and `updateQuantity` from `useCartActions`.

---

#### Task 3.3 — `CartCheckoutForm`
**File to create:** `app/[lang]/members/[brandId]/memberships/cart-checkout-form.tsx`

`react-hook-form` + `CartCheckoutSchema` (Zod). Calls `submitOrder` from `useCartActions`.

---

#### Task 3.4 — `CartOrderConfirmation`
**File to create:** `app/[lang]/members/[brandId]/memberships/cart-order-confirmation.tsx`

Shown when `checkoutStatus === 'success'`. Displays order summary, "View My Memberships" link.

---

#### Task 3.5 — `CartPanel`
**File to create:** `app/[lang]/members/[brandId]/memberships/cart-panel.tsx`

Composes `CartItemRow`, subtotal, `CartCheckoutForm`, `CartOrderConfirmation`.  
Switches between empty-state, item list, and order confirmation based on Redux state.

---

### Phase 4 — Wiring

#### Task 4.1 — Wire `membership-plan-card.tsx`
**File to modify:** `app/ui/components/membership-plan/membership-plan-card.tsx`

Replace no-op `handleResult` with `useCartActions().addToCart` + scroll-to-cart logic.

---

#### Task 4.2 — Wire `memberships/page.tsx`
**File to modify:** `app/[lang]/members/[brandId]/memberships/page.tsx`

Replace empty right-column `<div>` with `<CartPanel brandId={params.brandId} />`.

---

#### Task 4.3 — Wire `modal-buy-membership-plan.tsx`
**File to modify:** `app/ui/components/membership/modal-buy-membership-plan.tsx`

No translation changes required. The modal continues using `useTranslations("entity")` for `cart.buttons` and `cart.actions` which remain in `entity.json`.  
Only ensure that `handleResult` properly propagates the `addToCart` / `buyNow` flags up to `MembershipPlanCard` (already the case).

---

#### Task 4.4 — Mount `CartBadge` in Header
**File to modify:** Identify the header component under `app/ui/components/` and insert `<CartBadge />`.

---

### Phase 5 — Testing & Cleanup

#### Task 5.1 — Integration test: add-to-cart flow
Test that clicking "Add to Cart" in `ModalBuyMembershipPlan` → Redux state updated → `CartPanel` renders the item.

#### Task 5.2 — Integration test: checkout flow
Test that submitting `CartCheckoutForm` calls the service, clears the cart, shows confirmation.

#### Task 5.3 — Verify translation key ownership
Confirm that `modal-buy-membership-plan.tsx` reads from `useTranslations("entity")` (for `cart.buttons` / `cart.actions`) and that all new cart-panel components read from `useTranslations("cart")`. No keys are to be moved or deleted from `entity.json`.

---

## 11. Task Summary Table

| # | Task | Phase | Files | Depends on |
|---|---|---|---|---|
| 1.1 | Entities | Foundation | 4 new | — |
| 1.2 | Cart Redux slice | Foundation | 1 new + tests | 1.1 |
| 1.3 | localStorage persistence | Foundation | 1 new | 1.2 |
| 1.4 | Register reducer | Foundation | store.tsx edit | 1.2, 1.3 |
| 1.5 | i18n messages | Foundation | 2 edits | — |
| 2.1 | Cart service | Service | 1 new | 1.1 |
| 2.2 | `useCartActions` hook | Service | 1 new + tests | 1.2, 2.1 |
| 3.1 | `CartBadge` | UI | 1 new | 1.2 |
| 3.2 | `CartItemRow` | UI | 1 new | 2.2 |
| 3.3 | `CartCheckoutForm` | UI | 1 new | 2.2 |
| 3.4 | `CartOrderConfirmation` | UI | 1 new | 1.1 |
| 3.5 | `CartPanel` | UI | 1 new | 3.2, 3.3, 3.4 |
| 4.1 | Wire card | Wiring | edit | 2.2 |
| 4.2 | Wire page | Wiring | edit | 3.5 |
| 4.3 | Wire modal | Wiring | edit | 1.5 |
| 4.4 | Wire badge | Wiring | edit | 3.1 |
| 5.1 | Integration test: add | Testing | new | 4.1, 4.2 |
| 5.2 | Integration test: checkout | Testing | new | 4.2, 4.3 |
| 5.3 | Verify translation key ownership | Cleanup | — | 4.3 |

**Total new files:** ~15  
**Total edited files:** ~7
