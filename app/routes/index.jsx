import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Welcome to Remix Mongo Auth CRUD</h1>
      <div className="flex gap-4">
        <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded">Login</Link>
        <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded">Sign Up</Link>
      </div>
    </div>
  );
}
