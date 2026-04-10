/*
  Component: Avatar

  Purpose:
  - Show AI interviewer profile (image + name)
*/
const Avatar = () => {
  return (
    <div className="flex items-center justify-center gap-4 mb-4">
      {/* AI avatar image */}
      <img
        src="https://cdn.sanity.io/images/pm8sh1r9/production/d91abd659c38841f9f56b59a21cb790777b3d1f1-2922x1638.png?fm=webp&fit=crop"
        alt="AI Interviewer"
        className="w-40 h-40  border-2 border-blue-500"
      />

      {/* AI name and role */}
      <div>
        <p className="text-white font-semibold">AI Interviewer</p>
        <p className="text-gray-400 text-sm">AskMe AI</p>
      </div>
    </div>
  );
};

export default Avatar;