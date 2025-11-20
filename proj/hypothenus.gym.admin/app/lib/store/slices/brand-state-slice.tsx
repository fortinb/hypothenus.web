import { Brand, newBrand } from "@/src/lib/entities/brand";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface BrandState {
  brand: Brand;
}

export const initialState: BrandState = {
  brand: newBrand()
}

export const brandStateSlice = createSlice({
  name: 'brandState',
  initialState: initialState,
  reducers: {
    updateBrandState: (state, action: PayloadAction<Brand>) => {
      return {
        ...state,
        brand: action.payload
      }
    },
    clearBrandState: (state) => {
      return {
        ...state,
        brand: newBrand()
      }
    }
  }
});

export const { updateBrandState, clearBrandState } = brandStateSlice.actions

export default brandStateSlice.reducer
