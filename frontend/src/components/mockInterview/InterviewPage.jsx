import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nextQuestion, addAnswer } from "../../redux/interviewSlice";
import useTimer from "../../hooks/useTimer";
import { analyzeAnswerAPI } from "../../redux/interviewSlice";
import InterviewSetup from "./InterviewSetup";

import Avatar from "./Avatar";
import QuestionCard from "../cards/QuestionCard";
import AnswerInput from "../cards/AnswerInput";
import FeedbackCard from "../cards/FeedbackCard";

const InterviewPage = () => {
  const [started, setStarted] = useState(false);
  const dispatch = useDispatch();
  const { questions, currentQuestionIndex, feedback, loading, config } =
    useSelector((state) => state.interview);

  // always palce hooks at the top level of component
  // use timer
  // 1 minute = 60 seconds
  const timeLeft = useTimer(
    480,
    () => {
      // When total time ends → show feedback
      alert("Time is up! Interview completed.");
    },
    currentQuestionIndex, // ✅ reset on new question
  );

  const handleAnswerSubmit = async (answer) => {
    if (loading) return;

    const question = questions[currentQuestionIndex];

    dispatch(addAnswer(answer));

    const result = await dispatch(analyzeAnswerAPI({ question, answer }));

    if (analyzeAnswerAPI.fulfilled.match(result)) {
      dispatch(nextQuestion());
    }
  };

  //if
  if (!started) {
    return (
      <InterviewSetup
        onStart={() => {
          setStarted(true);
        }}
      />
    );
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // save interview data to local storage 
  const saveInterview = (state) => {
  const history = JSON.parse(localStorage.getItem("interviews")) || [];

  const newEntry = {
    date: new Date().toISOString(),
    config: state.config,
    questions: state.questions,
    answers: state.answers,
    feedback: state.feedback,
  };

  history.push(newEntry);

  localStorage.setItem("interviews", JSON.stringify(history));
};

// useeffect to show feedback when interview ends and save data to local storage
useEffect(() => {
  if (
    questions.length > 0 &&
    currentQuestionIndex >= questions.length
  ) {
    saveInterview({ questions, answers, feedback, config });
  }
}, [currentQuestionIndex]);

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
            {/* Progress Bar */}
            <div className="mb-4">
              <p>
                Question {currentQuestionIndex + 1} / {questions.length}
              </p>

              <div className="w-full bg-gray-700 h-2 rounded">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <AnswerInput onSubmit={handleAnswerSubmit} loading={loading} />
            {/* button to skip question */}
            <button
              onClick={() => {
                dispatch(nextQuestion());
                dispatch(addAnswer("Skipped"));
              }}
              className="bg-yellow-500 px-4 py-2 rounded mt-3"
            >
              Skip Question
            </button>
          </>
        ) : (
          <FeedbackCard feedback={feedback} />
        )}
      </div>
    </>
  );
};

export default InterviewPage;
