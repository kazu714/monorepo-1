import { Welcome } from "../../welcome/welcome";
import { Link } from "react-router";

export default function Home() {
  return (
    <div>
      <Welcome />
      <div className="text-center mt-8 space-x-4">
        <Link
          to="/todos"
          className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          View Todos
        </Link>
        <Link
          to="/login"
          className="inline-block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
