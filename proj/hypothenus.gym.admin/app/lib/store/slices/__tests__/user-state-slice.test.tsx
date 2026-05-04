import userStateReducer, {
    UserState,
    clearUserState,
    initialState,
    updateUserState,
} from "../user-state-slice";
import { User, newUser } from "@/src/lib/entities/user";

function makeUser(overrides: Partial<User> = {}): User {
    return { ...newUser(), uuid: "user-1", ...overrides };
}

describe("userStateSlice reducer", () => {
    it("has correct initial state", () => {
        const state = userStateReducer(undefined, { type: "@@INIT" });
        expect(state.user).toBeDefined();
        expect(state.user.uuid).toBeNull();
    });

    describe("updateUserState", () => {
        it("replaces the user with the payload", () => {
            const user = makeUser();
            const state = userStateReducer(initialState, updateUserState(user));
            expect(state.user.uuid).toBe("user-1");
        });
    });

    describe("clearUserState", () => {
        it("resets user to a new empty user", () => {
            const preState: UserState = { user: makeUser() };
            const state = userStateReducer(preState, clearUserState());
            expect(state.user.uuid).toBeNull();
        });
    });
});
