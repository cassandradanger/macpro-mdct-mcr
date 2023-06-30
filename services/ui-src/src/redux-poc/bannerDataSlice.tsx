import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";

// Define a type for the slice state
interface BannerDataState {
  title: string;
  description: string;
  link: string;
  key: string;
  startDate: number;
  endDate: number;
  isActive: boolean;
}

// Define the initial state using that type
const initialState: BannerDataState = {
  title: "here is a title",
  description: "here is a descriptionssss",
  link: "www.coforma.io",
  key: "1234",
  startDate: 12122023,
  endDate: 12132023,
  isActive: true,
};

export const bannerDataSlice = createSlice({
  name: "bannerData",
  initialState: initialState,
  reducers: {
    // addBannerData: (state, action) => {},
  },
});

// this is for dispatch

// export const { addBannerData } = bannerDataSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const bannerDataExport = (state: RootState) => state;

// this is for configureStore
export default bannerDataSlice.reducer;
