import { Coach, newCoach } from "@/src/lib/entities/coach";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface CoachState {
  coach: Coach;
}

export const initialState: CoachState = {
  coach: newCoach()
}

export const coachStateSlice = createSlice({
  name: 'coachState',
  initialState: initialState,
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
    updateCoachPhotoUri: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        coach: {
          ...state.coach,
          person: {
            ...state.coach.person,
            photoUri: action.payload,
          }
        }
      }
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateCoachState, clearCoachState, updateCoachPhotoUri } = coachStateSlice.actions

export default coachStateSlice.reducer