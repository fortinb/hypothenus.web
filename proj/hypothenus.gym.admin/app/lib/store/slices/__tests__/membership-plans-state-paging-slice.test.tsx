import membershipPlansStatePagingReducer, {
    MembershipPlansStatePaging,
    DEFAULT_PAGING_SIZE,
    firstPage,
    includeInactive,
    initialState,
    nextPage,
    previousPage,
    resetSearchCriteria,
    setSearchCriteria,
} from "../membership-plans-state-paging-slice";

describe("membershipPlansStatePagingSlice reducer", () => {
    it("has correct initial state", () => {
        const state = membershipPlansStatePagingReducer(undefined, { type: "@@INIT" });
        expect(state.page).toBe(0);
        expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        expect(state.includeInactive).toBe(false);
        expect(state.searchActive).toBe(false);
        expect(state.searchCriteria).toBe("");
    });

    describe("nextPage", () => {
        it("increments the page by 1", () => {
            const state = membershipPlansStatePagingReducer(initialState, nextPage());
            expect(state.page).toBe(1);
        });

        it("increments further from non-zero page", () => {
            const preState: MembershipPlansStatePaging = { ...initialState, page: 3 };
            const state = membershipPlansStatePagingReducer(preState, nextPage());
            expect(state.page).toBe(4);
        });
    });

    describe("previousPage", () => {
        it("decrements the page by 1", () => {
            const preState: MembershipPlansStatePaging = { ...initialState, page: 2 };
            const state = membershipPlansStatePagingReducer(preState, previousPage());
            expect(state.page).toBe(1);
        });
    });

    describe("firstPage", () => {
        it("resets page to 0 and pageSize to DEFAULT_PAGING_SIZE", () => {
            const preState: MembershipPlansStatePaging = { ...initialState, page: 5, pageSize: 12 };
            const state = membershipPlansStatePagingReducer(preState, firstPage());
            expect(state.page).toBe(0);
            expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        });
    });

    describe("includeInactive", () => {
        it("sets includeInactive to true", () => {
            const state = membershipPlansStatePagingReducer(initialState, includeInactive(true));
            expect(state.includeInactive).toBe(true);
        });

        it("sets includeInactive to false", () => {
            const preState: MembershipPlansStatePaging = { ...initialState, includeInactive: true };
            const state = membershipPlansStatePagingReducer(preState, includeInactive(false));
            expect(state.includeInactive).toBe(false);
        });
    });

    describe("setSearchCriteria", () => {
        it("stores the criteria and resets page to 0 with searchActive true", () => {
            const preState: MembershipPlansStatePaging = { ...initialState, page: 3 };
            const state = membershipPlansStatePagingReducer(preState, setSearchCriteria("test"));
            expect(state.searchCriteria).toBe("test");
            expect(state.searchActive).toBe(true);
            expect(state.page).toBe(0);
            expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        });
    });

    describe("resetSearchCriteria", () => {
        it("clears criteria and resets page with searchActive false", () => {
            const preState: MembershipPlansStatePaging = {
                ...initialState,
                page: 2,
                searchActive: true,
                searchCriteria: "old",
            };
            const state = membershipPlansStatePagingReducer(preState, resetSearchCriteria());
            expect(state.searchCriteria).toBe("");
            expect(state.searchActive).toBe(false);
            expect(state.page).toBe(0);
            expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        });
    });
});
