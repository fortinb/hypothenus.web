import { MembershipPlan, newMembershipPlan } from "@/src/lib/entities/membership-plan";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface MembershipPlanState {
  membershipPlan: MembershipPlan;
}

export const initialState: MembershipPlanState = {
  membershipPlan: newMembershipPlan()
}

export const membershipPlanStateSlice = createSlice({
  name: 'membershipPlanState',
  initialState: initialState,
  reducers: {
    updateMembershipPlanState: (state, action: PayloadAction<MembershipPlan>) => {
      return {
        ...state,
        membershipPlan: action.payload
      }
    },
    clearMembershipPlanState: (state) => {
      return {
        ...state,
        membershipPlan: newMembershipPlan()
      }
    },
  }
});

// Action creators are generated for each case reducer function
export const { updateMembershipPlanState, clearMembershipPlanState } = membershipPlanStateSlice.actions

export default membershipPlanStateSlice.reducer
