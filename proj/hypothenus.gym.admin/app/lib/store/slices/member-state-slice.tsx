import { Member, newMember } from "@/src/lib/entities/member";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface MemberState {
  member: Member;
}

export const initialState: MemberState = {
  member: newMember()
}

export const memberStateSlice = createSlice({
  name: 'memberState',
  initialState: initialState,
  reducers: {
    updateMemberState: (state, action: PayloadAction<Member>) => {
      return {
        ...state,
        member: action.payload
      }
    },
    clearMemberState: (state) => {
      return {
        ...state,
        member: newMember()
      }
    },
    updateMemberPhotoUri: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        member: {
          ...state.member,
          person: {
            ...state.member.person,
            photoUri: action.payload,
          }
        }
      }
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateMemberState, clearMemberState, updateMemberPhotoUri } = memberStateSlice.actions

export default memberStateSlice.reducer