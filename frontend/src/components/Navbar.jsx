import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-blue-600 text-white">

      {/* Logo */}
      <h1 className="text-xl font-bold">AI Career Platform</h1>

      {/* Navigation Links */}
      <div className="space-x-4">

        {/* Link to Resume Builder */}
        <Link to="/" className="hover:underline">
          Resume Builder
        </Link>

        {/* Link to Mock Interview */}
        <Link to="/interview" className="hover:underline">
          Mock Interview
        </Link>

      </div>
    </nav>
  );
};

export default Navbar;