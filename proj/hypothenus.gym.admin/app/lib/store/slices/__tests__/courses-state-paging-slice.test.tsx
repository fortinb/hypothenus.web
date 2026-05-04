import coursesStatePagingReducer, {
    CoursesStatePaging,
    DEFAULT_PAGING_SIZE,
    firstPage,
    includeInactive,
    initialState,
    nextPage,
    previousPage,
    resetSearchCriteria,
    setSearchCriteria,
} from "../courses-state-paging-slice";

describe("coursesStatePagingSlice reducer", () => {
    it("has correct initial state", () => {
        const state = coursesStatePagingReducer(undefined, { type: "@@INIT" });
        expect(state.page).toBe(0);
        expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        expect(state.includeInactive).toBe(false);
        expect(state.searchActive).toBe(false);
        expect(state.searchCriteria).toBe("");
    });

    describe("nextPage", () => {
        it("increments the page by 1", () => {
            const state = coursesStatePagingReducer(initialState, nextPage());
            expect(state.page).toBe(1);
        });

        it("increments further from non-zero page", () => {
            const preState: CoursesStatePaging = { ...initialState, page: 3 };
            const state = coursesStatePagingReducer(preState, nextPage());
            expect(state.page).toBe(4);
        });
    });

    describe("previousPage", () => {
        it("decrements the page by 1", () => {
            const preState: CoursesStatePaging = { ...initialState, page: 2 };
            const state = coursesStatePagingReducer(preState, previousPage());
            expect(state.page).toBe(1);
        });
    });

    describe("firstPage", () => {
        it("resets page to 0 and pageSize to DEFAULT_PAGING_SIZE", () => {
            const preState: CoursesStatePaging = { ...initialState, page: 5, pageSize: 12 };
            const state = coursesStatePagingReducer(preState, firstPage());
            expect(state.page).toBe(0);
            expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        });
    });

    describe("includeInactive", () => {
        it("sets includeInactive to true", () => {
            const state = coursesStatePagingReducer(initialState, includeInactive(true));
            expect(state.includeInactive).toBe(true);
        });

        it("sets includeInactive to false", () => {
            const preState: CoursesStatePaging = { ...initialState, includeInactive: true };
            const state = coursesStatePagingReducer(preState, includeInactive(false));
            expect(state.includeInactive).toBe(false);
        });
    });

    describe("setSearchCriteria", () => {
        it("stores the criteria and resets page to 0 with searchActive true", () => {
            const preState: CoursesStatePaging = { ...initialState, page: 3 };
            const state = coursesStatePagingReducer(preState, setSearchCriteria("test"));
            expect(state.searchCriteria).toBe("test");
            expect(state.searchActive).toBe(true);
            expect(state.page).toBe(0);
            expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        });
    });

    describe("resetSearchCriteria", () => {
        it("clears criteria and resets page with searchActive false", () => {
            const preState: CoursesStatePaging = {
                ...initialState,
                page: 2,
                searchActive: true,
                searchCriteria: "old",
            };
            const state = coursesStatePagingReducer(preState, resetSearchCriteria());
            expect(state.searchCriteria).toBe("");
            expect(state.searchActive).toBe(false);
            expect(state.page).toBe(0);
            expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        });
    });
});
