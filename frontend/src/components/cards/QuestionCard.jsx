import React, { useEffect ,useRef} from "react";
import convertTextToSpeech from "../../hooks/convertTextToSpeech";

/*
 
  Props:
  - question: current interview question
*/
const QuestionCard = ({ question }) => {
  const { speak } = convertTextToSpeech();

  // Store last spoken question
  const lastSpokenRef = useRef("");

  useEffect(() => {
     if (!question) return;

    // Speak only if question changed
    if (question && lastSpokenRef.current !== question) {
      speak(question);
      lastSpokenRef.current = question;
    }
  }, [question,speak]);

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold">{question}</h2>
    </div>
  );
};

export default QuestionCard;