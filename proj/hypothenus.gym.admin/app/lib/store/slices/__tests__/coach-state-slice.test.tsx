import coachStateReducer, {
    CoachState,
    clearCoachState,
    initialState,
    updateCoachPhotoUri,
    updateCoachState,
} from "../coach-state-slice";
import { Coach, newCoach } from "@/src/lib/entities/coach";

function makeCoach(overrides: Partial<Coach> = {}): Coach {
    return { ...newCoach(), uuid: "coach-1", ...overrides };
}

describe("coachStateSlice reducer", () => {
    it("has correct initial state", () => {
        const state = coachStateReducer(undefined, { type: "@@INIT" });
        expect(state.coach).toBeDefined();
        expect(state.coach.uuid).toBeNull();
    });

    describe("updateCoachState", () => {
        it("replaces the coach with the payload", () => {
            const coach = makeCoach();
            const state = coachStateReducer(initialState, updateCoachState(coach));
            expect(state.coach.uuid).toBe("coach-1");
        });
    });

    describe("clearCoachState", () => {
        it("resets coach to a new empty coach", () => {
            const preState: CoachState = { coach: makeCoach() };
            const state = coachStateReducer(preState, clearCoachState());
            expect(state.coach.uuid).toBeNull();
        });
    });

    describe("updateCoachPhotoUri", () => {
        it("updates the photo URI on the nested person", () => {
            const preState: CoachState = { coach: makeCoach() };
            const state = coachStateReducer(preState, updateCoachPhotoUri("http://example.com/photo.jpg"));
            expect(state.coach.person.photoUri).toBe("http://example.com/photo.jpg");
        });

        it("does not mutate other person fields", () => {
            const coach = makeCoach();
            coach.person.email = "original@example.com";
            const preState: CoachState = { coach };
            const state = coachStateReducer(preState, updateCoachPhotoUri("http://new.jpg"));
            expect(state.coach.person.email).toBe("original@example.com");
        });
    });
});
