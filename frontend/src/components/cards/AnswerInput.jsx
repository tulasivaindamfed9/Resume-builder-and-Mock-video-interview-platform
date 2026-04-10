import React from "react";
import convertSpeechToText from "../../hooks/convertSpeechToText";

/*
  Component: AnswerInput

  Props:
  - onSubmit: function to send answer to backend
*/
const AnswerInput = ({ onSubmit, loading }) => {
  const { text, listening, startListening, stopListening, setText } =
    convertSpeechToText();

  return (
    <div>
      {/* Textarea for typing or voice text */}
      <textarea
        className="w-full p-3 rounded-lg bg-gray-700 text-white"
        rows="4"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Speak or type your answer..."
      />

      {/* Buttons */}
      <div className="flex gap-3 mt-3">
        {/* Start voice */}
        <button
          onClick={startListening}
          className="bg-green-500 px-3 py-2 rounded"
        >
          🎤 Start
        </button>

        {/* Stop voice */}
        <button
          onClick={stopListening}
          className="bg-red-500 px-3 py-2 rounded"
        >
          ⏹ Stop
        </button>

        {/* Submit answer */}
        <button
          onClick={() => {
            if (!text.trim()) return; // ✅ prevent empty answer

            stopListening();
            onSubmit(text);
            setText("");
          }}
          disabled={loading}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>

      {/* Show listening status */}
      {listening && <p className="text-green-400 mt-2">Listening...</p>}
    </div>
  );
};

export default AnswerInput;
