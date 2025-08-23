import { Welcome } from "../../welcome/welcome";
import { Link } from "react-router";

export default function Home() {
  return (
    <div>
      <Welcome />
      <div className="text-center mt-8">
        <Link 
          to="/example" 
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          View Examples
        </Link>
      </div>
    </div>
  );
}
