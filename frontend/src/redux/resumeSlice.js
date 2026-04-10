import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { generateSummaryAPI } from "../services/api";
import toast from "react-hot-toast";

// async thunk (API call)
export const generateSummary = createAsyncThunk(
  "resume/generateSummary",
  async (data, thunkAPI) => {
    try {
      const response = await generateSummaryAPI(data);
      return response.data.summary;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// slice
const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    loading: false,
    summary: "",
    error: null,
  },
  reducers: {
     clearResume: (state) => {
      state.summary = null;
    }
  },

  // handle async states
  extraReducers: (builder) => {
    builder
      .addCase(generateSummary.pending, (state) => {
        state.loading = true;
        toast.loading("Generating your resume...");
        state.error = null;
      })
      .addCase(generateSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
          toast.dismiss();
        toast.success("Resume generated successfully!");
      })
      .addCase(generateSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.dismiss();
        toast.error("Failed to generate resume. Please try again.");
      });
  },
});

export const { clearResume } = resumeSlice.actions;

export default resumeSlice.reducer;