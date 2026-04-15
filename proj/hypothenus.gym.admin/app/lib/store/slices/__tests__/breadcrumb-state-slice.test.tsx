import breadcrumbStateReducer, {
    BreadcrumbState,
    Crumb,
    initBreadcrumbs,
    initialState,
    pushBreadcrumb,
    resetBreadcrumbs,
    updateBreadcrumbsLocale,
} from "../breadcrumb-state-slice";

function makeCrumb(overrides: Partial<Crumb> = {}): Crumb {
    return {
        reset: false,
        locale: "en",
        href: "/home",
        id: "home",
        key: "home.title",
        namespace: "home",
        ...overrides,
    };
}

describe("breadcrumbStateSlice reducer", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    it("has correct initial state", () => {
        const state = breadcrumbStateReducer(undefined, { type: "@@INIT" });
        expect(state.breadcrumbs).toEqual([]);
    });

    describe("pushBreadcrumb", () => {
        it("appends a new crumb when id is not found", () => {
            const crumb = makeCrumb({ id: "brands", href: "/brands", key: "brands.title" });
            const state = breadcrumbStateReducer(initialState, pushBreadcrumb(crumb));
            expect(state.breadcrumbs).toHaveLength(1);
            expect(state.breadcrumbs[0].id).toBe("brands");
        });

        it("appends multiple crumbs with distinct ids", () => {
            let state = breadcrumbStateReducer(initialState, pushBreadcrumb(makeCrumb({ id: "home" })));
            state = breadcrumbStateReducer(state, pushBreadcrumb(makeCrumb({ id: "brands", href: "/brands" })));
            expect(state.breadcrumbs).toHaveLength(2);
        });

        it("updates key and removes tail when id already exists", () => {
            let state = breadcrumbStateReducer(initialState, pushBreadcrumb(makeCrumb({ id: "home" })));
            state = breadcrumbStateReducer(state, pushBreadcrumb(makeCrumb({ id: "brands", href: "/brands" })));
            state = breadcrumbStateReducer(state, pushBreadcrumb(makeCrumb({ id: "brand-detail", href: "/brands/1" })));
            // Push home again — should update key and remove tail (brands, brand-detail)
            state = breadcrumbStateReducer(state, pushBreadcrumb(makeCrumb({ id: "home", key: "home.updated" })));
            expect(state.breadcrumbs).toHaveLength(1);
            expect(state.breadcrumbs[0].key).toBe("home.updated");
        });

        it("persists breadcrumbs to sessionStorage", () => {
            const crumb = makeCrumb({ id: "home" });
            breadcrumbStateReducer(initialState, pushBreadcrumb(crumb));
            const stored = JSON.parse(sessionStorage.getItem("breadcrumbs") ?? "[]");
            expect(stored).toHaveLength(1);
            expect(stored[0].id).toBe("home");
        });
    });

    describe("initBreadcrumbs", () => {
        it("loads breadcrumbs from sessionStorage", () => {
            const crumbs = [makeCrumb({ id: "home" })];
            sessionStorage.setItem("breadcrumbs", JSON.stringify(crumbs));
            const state = breadcrumbStateReducer(initialState, initBreadcrumbs());
            expect(state.breadcrumbs).toHaveLength(1);
            expect(state.breadcrumbs[0].id).toBe("home");
        });

        it("returns empty array when sessionStorage is empty", () => {
            const state = breadcrumbStateReducer(initialState, initBreadcrumbs());
            expect(state.breadcrumbs).toEqual([]);
        });

        it("returns empty array when sessionStorage contains invalid JSON", () => {
            sessionStorage.setItem("breadcrumbs", "not-valid-json");
            const state = breadcrumbStateReducer(initialState, initBreadcrumbs());
            expect(state.breadcrumbs).toEqual([]);
        });
    });

    describe("updateBreadcrumbsLocale", () => {
        it("updates locale on all breadcrumbs", () => {
            const preState: BreadcrumbState = {
                breadcrumbs: [
                    makeCrumb({ id: "home", locale: "en" }),
                    makeCrumb({ id: "brands", locale: "en" }),
                ],
            };
            const state = breadcrumbStateReducer(preState, updateBreadcrumbsLocale("fr"));
            expect(state.breadcrumbs[0].locale).toBe("fr");
            expect(state.breadcrumbs[1].locale).toBe("fr");
        });

        it("persists updated breadcrumbs to sessionStorage", () => {
            const preState: BreadcrumbState = {
                breadcrumbs: [makeCrumb({ id: "home", locale: "en" })],
            };
            breadcrumbStateReducer(preState, updateBreadcrumbsLocale("fr"));
            const stored = JSON.parse(sessionStorage.getItem("breadcrumbs") ?? "[]");
            expect(stored[0].locale).toBe("fr");
        });
    });

    describe("resetBreadcrumbs", () => {
        it("clears existing breadcrumbs and starts with the given crumb", () => {
            const preState: BreadcrumbState = {
                breadcrumbs: [
                    makeCrumb({ id: "home" }),
                    makeCrumb({ id: "brands" }),
                ],
            };
            const root = makeCrumb({ id: "root", href: "/", key: "root.title" });
            const state = breadcrumbStateReducer(preState, resetBreadcrumbs(root));
            expect(state.breadcrumbs).toHaveLength(1);
            expect(state.breadcrumbs[0].id).toBe("root");
        });

        it("persists the reset state to sessionStorage", () => {
            const root = makeCrumb({ id: "root" });
            breadcrumbStateReducer(initialState, resetBreadcrumbs(root));
            const stored = JSON.parse(sessionStorage.getItem("breadcrumbs") ?? "[]");
            expect(stored).toHaveLength(1);
            expect(stored[0].id).toBe("root");
        });
    });
});
