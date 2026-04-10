const FeedbackCard = ({ feedback }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Interview Feedback</h2>

      {feedback.map((item, index) => (
        <div key={index} className="bg-gray-800 p-4 mb-3 rounded-lg">
          <p><strong>Score:</strong> {item.score}</p>
          <p><strong>Feedback:</strong> {item.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default FeedbackCard;