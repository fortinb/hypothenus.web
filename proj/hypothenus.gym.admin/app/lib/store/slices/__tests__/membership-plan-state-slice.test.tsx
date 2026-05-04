import membershipPlanStateReducer, {
    MembershipPlanState,
    clearMembershipPlanState,
    initialState,
    updateMembershipPlanState,
} from "../membership-plan-state-slice";
import { MembershipPlan, newMembershipPlan } from "@/src/lib/entities/membership-plan";

function makeMembershipPlan(overrides: Partial<MembershipPlan> = {}): MembershipPlan {
    return { ...newMembershipPlan(), uuid: "plan-1", ...overrides };
}

describe("membershipPlanStateSlice reducer", () => {
    it("has correct initial state", () => {
        const state = membershipPlanStateReducer(undefined, { type: "@@INIT" });
        expect(state.membershipPlan).toBeDefined();
        expect(state.membershipPlan.uuid).toBeNull();
    });

    describe("updateMembershipPlanState", () => {
        it("replaces the membership plan with the payload", () => {
            const plan = makeMembershipPlan();
            const state = membershipPlanStateReducer(initialState, updateMembershipPlanState(plan));
            expect(state.membershipPlan.uuid).toBe("plan-1");
        });
    });

    describe("clearMembershipPlanState", () => {
        it("resets membership plan to a new empty plan", () => {
            const preState: MembershipPlanState = { membershipPlan: makeMembershipPlan() };
            const state = membershipPlanStateReducer(preState, clearMembershipPlanState());
            expect(state.membershipPlan.uuid).toBeNull();
        });
    });
});
