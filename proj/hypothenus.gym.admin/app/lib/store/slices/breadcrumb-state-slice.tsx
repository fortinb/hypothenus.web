import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Crumb {
  href: string,
  id: string,
  crumb: string,
}

export interface BreadcrumbState {
  breadcrumbs: Crumb[]
}

export const initialState: BreadcrumbState = {
  breadcrumbs: []
}

export const breadcrumbStateSlice = createSlice({
  name: 'breadcrumbState',
  initialState: initialState,
  reducers: {
    pushBreadcrumb: (state, action: PayloadAction<Crumb>) => {

      const crumbIndex = state.breadcrumbs.findIndex(c => c.id == action.payload.id);
      if (crumbIndex == -1) {
        state.breadcrumbs.push(action.payload);
        return;
      }

      if (crumbIndex == state.breadcrumbs.length) {
        return {
          ...state,
        }
      }
      state.breadcrumbs.splice(crumbIndex+1);
      
    }
  }
});

// Action creators are generated for each case reducer function
export const { pushBreadcrumb } = breadcrumbStateSlice.actions

export default breadcrumbStateSlice.reducer