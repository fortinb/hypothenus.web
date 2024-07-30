import { Coach, newCoach } from "@/src/lib/entities/coach";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface CoachState {
  coach: Coach;
}

export const coachStateSlice = createSlice({
  name: 'coachState',
  initialState: {
    coach: newCoach()
  },
  reducers: {
    updateCoachState: (state, action: PayloadAction<Coach>) => {
      return {
        ...state,
        coach: action.payload
      }
    },
    clearCoachState: (state) => {
      return {
        ...state,
        coach: newCoach()
      }
    },
  }
});

// Action creators are generated for each case reducer function
export const { updateCoachState, clearCoachState } = coachStateSlice.actions

export default coachStateSlice.reducer