import brandStateReducer, {
    BrandState,
    clearBrandState,
    initialState,
    updateBrandState,
} from "../brand-state-slice";
import { Brand, newBrand } from "@/src/lib/entities/brand";

function makeBrand(overrides: Partial<Brand> = {}): Brand {
    return { ...newBrand(), uuid: "brand-1", name: "Test Brand", ...overrides };
}

describe("brandStateSlice reducer", () => {
    it("has correct initial state", () => {
        const state = brandStateReducer(undefined, { type: "@@INIT" });
        expect(state.brand).toBeDefined();
        expect(state.brand.uuid).toBeNull();
    });

    describe("updateBrandState", () => {
        it("replaces the brand with the payload", () => {
            const brand = makeBrand();
            const state = brandStateReducer(initialState, updateBrandState(brand));
            expect(state.brand.uuid).toBe("brand-1");
            expect(state.brand.name).toBe("Test Brand");
        });
    });

    describe("clearBrandState", () => {
        it("resets brand to a new empty brand", () => {
            const preState: BrandState = { brand: makeBrand() };
            const state = brandStateReducer(preState, clearBrandState());
            expect(state.brand.uuid).toBeNull();
        });
    });
});
