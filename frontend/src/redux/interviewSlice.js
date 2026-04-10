import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { generateQuestions, analyzeAnswer } from "../services/interviewAPI";

//api calls to generate questions based on role
export const fetchQuestions = createAsyncThunk(
  "interview/fetchQuestions",
  async (config, thunkAPI) => {
    const state = thunkAPI.getState();
    const key = JSON.stringify(config);

    // ✅ check cache first
    if (state.interview.cache[key]) {
      return state.interview.cache[key];
    }

    try {
      const response = await generateQuestions(config);
      return { data: response, key };
    } catch (error) {
      const message = error.response?.data?.detail || "Something went wrong";

      return thunkAPI.rejectWithValue(message);
    }
  },
);

// api call to analyze answer and get feedback
// export const analyzeAnswerAPI = createAsyncThunk(
//   "interview/analyzeAnswer",
//   async ({ question, answer }, thunkAPI) => {
//     try {
//       const response = await analyzeAnswer(question, answer);
//       return response;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   },
// );

export const analyzeAnswerAPI = createAsyncThunk(
  "interview/analyzeAnswer",
  async ({ question, answer }, thunkAPI) => {
    let attempts = 0;

    while (attempts < 3) {
      try {
        const response = await analyzeAnswer(question, answer);
        return response;
      } catch (error) {
        attempts++;

        if (attempts === 3) {
          return thunkAPI.rejectWithValue("Failed after 3 retries");
        }
      }
    }
  }
);

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  feedback: [],
  loading: false,
  error: null,

  //   role based questions
  config: {
    role: "",
    experience: "",
    skills: "",
  },

  cache: {}, // store questions by config key
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    setConfig: (state, action) => {
      state.config = action.payload;
    },
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    addAnswer: (state, action) => {
      state.answers.push(action.payload);
    },
    setFeedback: (state, action) => {
      state.feedback.push(action.payload);
    },
    nextQuestion: (state) => {
      state.currentQuestionIndex += 1;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    resetInterview: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;

        // if from cache
        if (Array.isArray(action.payload)) {
          state.questions = action.payload;
        } else {
          state.questions = action.payload.data;

          // ✅ save in cache
          state.cache[action.payload.key] = action.payload.data;
        }
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; //store error message from backend
      })
      .addCase(analyzeAnswerAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(analyzeAnswerAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.feedback.push(action.payload);
      })
      .addCase(analyzeAnswerAPI.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setConfig,
  setQuestions,
  addAnswer,
  setFeedback,
  nextQuestion,
  setLoading,
  resetInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;
