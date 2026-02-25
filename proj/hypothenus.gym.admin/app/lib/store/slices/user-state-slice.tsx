import { User, newUser } from "@/src/lib/entities/user";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface UserState {
  user: User;
}

export const initialState: UserState = {
  user: newUser()
}

export const userStateSlice = createSlice({
  name: 'userState',
  initialState: initialState,
  reducers: {
    updateUserState: (state, action: PayloadAction<User>) => {
      return {
        ...state,
        user: action.payload
      }
    },
    clearUserState: (state) => {
      return {
        ...state,
        user: newUser()
      }
    }
  }
});

export const { updateUserState, clearUserState } = userStateSlice.actions

export default userStateSlice.reducer
