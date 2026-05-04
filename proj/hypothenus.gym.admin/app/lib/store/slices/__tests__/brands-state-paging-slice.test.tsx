import brandsStatePagingReducer, {
    BrandsStatePaging,
    DEFAULT_PAGING_SIZE,
    firstPage,
    includeInactive,
    initialState,
    nextPage,
    previousPage,
    resetSearchCriteria,
    setSearchCriteria,
} from "../brands-state-paging-slice";

describe("brandsStatePagingSlice reducer", () => {
    it("has correct initial state", () => {
        const state = brandsStatePagingReducer(undefined, { type: "@@INIT" });
        expect(state.page).toBe(0);
        expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        expect(state.includeInactive).toBe(false);
        expect(state.searchActive).toBe(false);
        expect(state.searchCriteria).toBe("");
    });

    describe("nextPage", () => {
        it("increments the page by 1", () => {
            const state = brandsStatePagingReducer(initialState, nextPage());
            expect(state.page).toBe(1);
        });

        it("increments further from non-zero page", () => {
            const preState: BrandsStatePaging = { ...initialState, page: 3 };
            const state = brandsStatePagingReducer(preState, nextPage());
            expect(state.page).toBe(4);
        });
    });

    describe("previousPage", () => {
        it("decrements the page by 1", () => {
            const preState: BrandsStatePaging = { ...initialState, page: 2 };
            const state = brandsStatePagingReducer(preState, previousPage());
            expect(state.page).toBe(1);
        });
    });

    describe("firstPage", () => {
        it("resets page to 0 and pageSize to DEFAULT_PAGING_SIZE", () => {
            const preState: BrandsStatePaging = { ...initialState, page: 5, pageSize: 12 };
            const state = brandsStatePagingReducer(preState, firstPage());
            expect(state.page).toBe(0);
            expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        });
    });

    describe("includeInactive", () => {
        it("sets includeInactive to true", () => {
            const state = brandsStatePagingReducer(initialState, includeInactive(true));
            expect(state.includeInactive).toBe(true);
        });

        it("sets includeInactive to false", () => {
            const preState: BrandsStatePaging = { ...initialState, includeInactive: true };
            const state = brandsStatePagingReducer(preState, includeInactive(false));
            expect(state.includeInactive).toBe(false);
        });
    });

    describe("setSearchCriteria", () => {
        it("stores the criteria and resets page to 0 with searchActive true", () => {
            const preState: BrandsStatePaging = { ...initialState, page: 3 };
            const state = brandsStatePagingReducer(preState, setSearchCriteria("test"));
            expect(state.searchCriteria).toBe("test");
            expect(state.searchActive).toBe(true);
            expect(state.page).toBe(0);
            expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        });
    });

    describe("resetSearchCriteria", () => {
        it("clears criteria and resets page with searchActive false", () => {
            const preState: BrandsStatePaging = {
                ...initialState,
                page: 2,
                searchActive: true,
                searchCriteria: "old",
            };
            const state = brandsStatePagingReducer(preState, resetSearchCriteria());
            expect(state.searchCriteria).toBe("");
            expect(state.searchActive).toBe(false);
            expect(state.page).toBe(0);
            expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        });
    });
});
