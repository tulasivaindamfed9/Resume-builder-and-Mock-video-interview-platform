import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "./resumeSlice";
import interviewReducer from "./interviewSlice";

const store = configureStore({
  reducer: {
    resume: resumeReducer,
    interview: interviewReducer,

  },
});

export default store;