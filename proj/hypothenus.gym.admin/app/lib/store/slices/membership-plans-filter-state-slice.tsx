import { GymSelectedItem } from "@/src/lib/entities/ui/gym-selected-item";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface MembershipPlanFilterState {
  gymSelectedItem?: GymSelectedItem;
}

export const initialState: MembershipPlanFilterState = {
  gymSelectedItem: undefined
}

export const membershipPlanFilterStateSlice = createSlice({
  name: 'membershipPlanFilterState',
  initialState: initialState,
  reducers: {
    updateGymSelectedItem: (state, action: PayloadAction<GymSelectedItem>) => {
      return {
        ...state,
        gymSelectedItem: action.payload
      }
    }
  }
});

export const { updateGymSelectedItem } = membershipPlanFilterStateSlice.actions

export default membershipPlanFilterStateSlice.reducer
