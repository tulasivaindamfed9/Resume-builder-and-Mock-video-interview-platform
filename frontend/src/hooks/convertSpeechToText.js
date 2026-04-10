// React hooks
import { useState, useRef } from "react";

/*
  Custom Hook: convertSpeechToText

  Purpose:
  - Convert user's voice into text using browser Speech API
  - Manage start/stop listening
*/
const convertSpeechToText = () => {
  // Stores the converted speech text
  const [text, setText] = useState("");

  // Tracks whether mic is listening
  const [listening, setListening] = useState(false);

  // Store recognition instance (so we can stop it later)
  const recognitionRef = useRef(null);

  // Function to start listening
  const startListening = () => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    // Create new speech recognition instance
    const recognition = new SpeechRecognition();

    // Language setting
    recognition.lang = "en-US";

    // Continuous listening (keeps recording until stopped)
    recognition.continuous = true;

    // When listening starts
    recognition.onstart = () => setListening(true);

    // When speech is detected
    recognition.onresult = (event) => {
      let transcript = "";

      // Loop through results and build full text
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      // Update state with spoken text
      setText(transcript);
    };

    // When listening stops
    recognition.onend = () => setListening(false);

    // Start listening
    recognition.start();

    // Save instance so we can stop later
    recognitionRef.current = recognition;
  };

  // Function to stop listening
  const stopListening = () => {
    recognitionRef.current?.stop(); // safely stop if exists
  };

  // Return values so component can use
  return {
    text,
    listening,
    startListening,
    stopListening,
    setText,
  };
};

export default convertSpeechToText;