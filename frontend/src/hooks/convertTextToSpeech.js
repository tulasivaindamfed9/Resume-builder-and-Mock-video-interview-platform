/*
  Custom Hook: convertTextToSpeech

  Purpose:
  - Convert text into voice (AI speaking)
*/
const convertTextToSpeech = () => {
  // Function to speak text
  const speak = (text) => {
     // 🔥 IMPORTANT: Stop previous speech
    window.speechSynthesis.cancel();
    
    // Create speech object
    const speech = new SpeechSynthesisUtterance(text);

    // Language
    speech.lang = "en-US";

    // Speed of speaking
    speech.rate = 1;

    // Start speaking
    window.speechSynthesis.speak(speech);
  };

  return { speak };
};

export default convertTextToSpeech;