import React, { useEffect ,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setQuestions,
  nextQuestion,
  addAnswer,
  setFeedback,
  setLoading,
  setConfig
} from "../../redux/interviewSlice";
import useTimer from "../../hooks/useTimer";
import { fetchQuestions, analyzeAnswerAPI } from "../../redux/interviewSlice";
import InterviewSetup from "./InterviewSetup";

import Avatar from "./Avatar";
import QuestionCard from "../cards/QuestionCard";
import AnswerInput from "../cards/AnswerInput";
import FeedbackCard from "../cards/FeedbackCard";

const InterviewPage = () => {
  const [started, setStarted] = useState(false);
  const dispatch = useDispatch();
  const { questions, currentQuestionIndex, feedback, loading, config } = useSelector(
    (state) => state.interview
  );

  // always palce hooks at the top level of component
    // use timer
// 8 minutes = 480 seconds
const timeLeft = useTimer(480, () => {
  // When total time ends → show feedback
  alert("Time is up! Interview completed.");
});

const handleAnswerSubmit = async (answer) => {
   if (loading) return; // 🚫 prevent double submit
  const question = questions[currentQuestionIndex];

  // Save answer
  dispatch(addAnswer(answer));

  // Start loading
  dispatch(setLoading(true));

  // Call API
  await dispatch(analyzeAnswerAPI({ question, answer }));

  // Stop loading
  dispatch(setLoading(false));

  // Move to next question ONLY AFTER API completes
  dispatch(nextQuestion());
};

  //if 
if (!started) {
  return (
    <InterviewSetup
      onStart={(formdata) => {
       dispatch(setConfig(formdata)); // Set config in Redux
        dispatch(fetchQuestions(formdata)); // 🔥 API call here
         setStarted(true);
      }}
    />
  );
}

  if (loading) return <p className="text-center mt-10">Loading...</p>;



  return (
    <>
   <div className="p-6 text-white dark:bg-gray-900 min-h-screen">

  {/* Avatar */}
  <Avatar />

  {/* Timer */}
  <div className="text-right mb-4">
    <span className="bg-gray-700 px-3 py-1 rounded">
      Time Left: {timeLeft}s
    </span>
  </div>

  {/* Interview Content */}
  {questions.length > 0 && currentQuestionIndex < questions.length ? (
    <>
      <QuestionCard question={questions[currentQuestionIndex]} />
      <AnswerInput onSubmit={handleAnswerSubmit} loading={loading} />
    </>
  ) : (
    <FeedbackCard feedback={feedback} />
  )}

</div>
    </>
  );
};

export default InterviewPage;