import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

// ACTION
export const getData = createAsyncThunk(
  "posts/getPosts",
  async (data: any, thunkApi: any) => {
    try {
      const response = "hihi helloooooo";
      return response;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// Define a type for the slice state
export interface CounterState {
  title: string;
  description: string;
  link: string;
  key: string;
  startDate: number;
  endDate: number;
  isActive: boolean;
  value: number;
  loading: boolean;
  error: any;
}

// Define the initial state using that type
const initialState: CounterState = {
  title: "here is a title",
  description: "here is a descriptionssss",
  link: "www.coforma.io",
  key: "1234",
  startDate: 12122023,
  endDate: 12132023,
  isActive: true,
  value: 0,
  loading: false,
  error: null,
};

export const bannerDataSlice = createSlice({
  name: "bannerData",
  initialState,
  reducers: {
    newDescription: (state: any) => {
      // console.log("increment", state);

      /*
       * Redux Toolkit allows us to write "mutating" logic in reducers. It
       * doesn't actually mutate the state because it uses the Immer library,
       * which detects changes to a "draft state" and produces a brand new
       * immutable state based off those changes
       */

      state.description = "this is a new description";
    },
    decrement: (state: any) => {
      state.value -= 1;
    },
    incrementByAmount: (state: any, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers(builder: any) {
    // builder.addCase(getData.pending, (state: any, action: object) => {
    builder.addCase(getData.pending, (state: any) => {
      state.loading = true;
    });
  },
});

// Action creators are generated for each case reducer function
export const { newDescription, decrement, incrementByAmount } =
  bannerDataSlice.actions;

export default bannerDataSlice.reducer;
