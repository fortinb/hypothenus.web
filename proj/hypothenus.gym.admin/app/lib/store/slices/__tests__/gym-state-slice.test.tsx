import gymStateReducer, {
    GymState,
    clearGymState,
    initialState,
    updateGymState,
} from "../gym-state-slice";
import { Gym, newGym } from "@/src/lib/entities/gym";

function makeGym(overrides: Partial<Gym> = {}): Gym {
    return { ...newGym(), uuid: "gym-1", ...overrides };
}

describe("gymStateSlice reducer", () => {
    it("has correct initial state", () => {
        const state = gymStateReducer(undefined, { type: "@@INIT" });
        expect(state.gym).toBeDefined();
        expect(state.gym.uuid).toBeNull();
    });

    describe("updateGymState", () => {
        it("replaces the gym with the payload", () => {
            const gym = makeGym();
            const state = gymStateReducer(initialState, updateGymState(gym));
            expect(state.gym.uuid).toBe("gym-1");
        });
    });

    describe("clearGymState", () => {
        it("resets gym to a new empty gym", () => {
            const preState: GymState = { gym: makeGym() };
            const state = gymStateReducer(preState, clearGymState());
            expect(state.gym.uuid).toBeNull();
        });
    });
});
