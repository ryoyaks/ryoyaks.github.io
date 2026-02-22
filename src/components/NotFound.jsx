import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black-100 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-medium text-white mb-8">Page Not Found</h2>
        <p className="text-gray-400 mb-8 text-lg">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-300 text-black-100 font-semibold py-2 px-6 rounded-full
          transition-all duration-300 hover:bg-transparent hover:text-blue-300 border-2 border-blue-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
