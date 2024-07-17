import { Gym, newGym } from "@/src/lib/entities/gym";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface GymState {
  gym: Gym;
}

export const gymStateSlice = createSlice({
  name: 'gymState',
  initialState: {
    gym: newGym()
  },
  reducers: {
    updateGymState: (state, action: PayloadAction<Gym>) => {
      return {
        ...state,
        gym: action.payload
      }
    },
    clearGymState: (state) => {
      return {
        ...state,
        gym: newGym()
      }
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateGymState, clearGymState} = gymStateSlice.actions

export default gymStateSlice.reducer