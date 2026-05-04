import membershipPlanFilterStateReducer, {
    MembershipPlanFilterState,
    initialState,
    updateGymSelectedItem,
} from "../membership-plans-filter-state-slice";
import { GymSelectedItem } from "@/src/lib/entities/ui/gym-selected-item";
import { newGym } from "@/src/lib/entities/gym";

function makeGymSelectedItem(overrides: Partial<GymSelectedItem> = {}): GymSelectedItem {
    return {
        gym: { ...newGym(), uuid: "gym-1" },
        label: "Test Gym",
        value: "gym-1",
        ...overrides,
    };
}

describe("membershipPlanFilterStateSlice reducer", () => {
    it("has correct initial state", () => {
        const state = membershipPlanFilterStateReducer(undefined, { type: "@@INIT" });
        expect(state.gymSelectedItem).toBeUndefined();
    });

    describe("updateGymSelectedItem", () => {
        it("sets the gymSelectedItem from undefined", () => {
            const item = makeGymSelectedItem();
            const state = membershipPlanFilterStateReducer(initialState, updateGymSelectedItem(item));
            expect(state.gymSelectedItem).toBeDefined();
            expect(state.gymSelectedItem?.value).toBe("gym-1");
            expect(state.gymSelectedItem?.label).toBe("Test Gym");
        });

        it("replaces an existing gymSelectedItem", () => {
            const preState: MembershipPlanFilterState = {
                gymSelectedItem: makeGymSelectedItem({ value: "gym-old" }),
            };
            const newItem = makeGymSelectedItem({ value: "gym-new", label: "New Gym" });
            const state = membershipPlanFilterStateReducer(preState, updateGymSelectedItem(newItem));
            expect(state.gymSelectedItem?.value).toBe("gym-new");
            expect(state.gymSelectedItem?.label).toBe("New Gym");
        });

        it("stores the full gym object", () => {
            const item = makeGymSelectedItem();
            const state = membershipPlanFilterStateReducer(initialState, updateGymSelectedItem(item));
            expect(state.gymSelectedItem?.gym.uuid).toBe("gym-1");
        });
    });
});
