import usersStatePagingReducer, {
    UsersStatePaging,
    DEFAULT_PAGING_SIZE,
    firstPage,
    includeInactive,
    initialState,
    nextPage,
    previousPage,
    resetSearchCriteria,
    setSearchCriteria,
} from "../users-state-paging-slice";

describe("usersStatePagingSlice reducer", () => {
    it("has correct initial state", () => {
        const state = usersStatePagingReducer(undefined, { type: "@@INIT" });
        expect(state.page).toBe(0);
        expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        expect(state.includeInactive).toBe(false);
        expect(state.searchActive).toBe(false);
        expect(state.searchCriteria).toBe("");
    });

    describe("nextPage", () => {
        it("increments the page by 1", () => {
            const state = usersStatePagingReducer(initialState, nextPage());
            expect(state.page).toBe(1);
        });

        it("increments further from non-zero page", () => {
            const preState: UsersStatePaging = { ...initialState, page: 3 };
            const state = usersStatePagingReducer(preState, nextPage());
            expect(state.page).toBe(4);
        });
    });

    describe("previousPage", () => {
        it("decrements the page by 1", () => {
            const preState: UsersStatePaging = { ...initialState, page: 2 };
            const state = usersStatePagingReducer(preState, previousPage());
            expect(state.page).toBe(1);
        });
    });

    describe("firstPage", () => {
        it("resets page to 0 and pageSize to DEFAULT_PAGING_SIZE", () => {
            const preState: UsersStatePaging = { ...initialState, page: 5, pageSize: 12 };
            const state = usersStatePagingReducer(preState, firstPage());
            expect(state.page).toBe(0);
            expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        });
    });

    describe("includeInactive", () => {
        it("sets includeInactive to true", () => {
            const state = usersStatePagingReducer(initialState, includeInactive(true));
            expect(state.includeInactive).toBe(true);
        });

        it("sets includeInactive to false", () => {
            const preState: UsersStatePaging = { ...initialState, includeInactive: true };
            const state = usersStatePagingReducer(preState, includeInactive(false));
            expect(state.includeInactive).toBe(false);
        });
    });

    describe("setSearchCriteria", () => {
        it("stores the criteria and resets page to 0 with searchActive true", () => {
            const preState: UsersStatePaging = { ...initialState, page: 3 };
            const state = usersStatePagingReducer(preState, setSearchCriteria("test"));
            expect(state.searchCriteria).toBe("test");
            expect(state.searchActive).toBe(true);
            expect(state.page).toBe(0);
            expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        });
    });

    describe("resetSearchCriteria", () => {
        it("clears criteria and resets page with searchActive false", () => {
            const preState: UsersStatePaging = {
                ...initialState,
                page: 2,
                searchActive: true,
                searchCriteria: "old",
            };
            const state = usersStatePagingReducer(preState, resetSearchCriteria());
            expect(state.searchCriteria).toBe("");
            expect(state.searchActive).toBe(false);
            expect(state.page).toBe(0);
            expect(state.pageSize).toBe(DEFAULT_PAGING_SIZE);
        });
    });
});
