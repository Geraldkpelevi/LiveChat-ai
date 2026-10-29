
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900">
        Page not found
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        The page you requested doesn't exist.
      </p>

      <Link
        to="/messages"
        className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Back to Messages
      </Link>
    </div>
  );
}
