import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold mb-6">Welcome to My Todo App</h1>
      <p className="text-lg mb-8">Organize your tasks and manage your profile effortlessly!</p>
      <div className="flex space-x-4">
        {!user ? (
          <>
            <Link to="/signup">
              <button className="bg-white text-blue-500 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition">
                Sign Up
              </button>
            </Link>
            <Link to="/login">
              <button className="bg-white text-blue-500 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition">
                Login
              </button>
            </Link>
          </>
        ) : (
          <Link to="/todo">
            <button className="bg-white text-blue-500 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition">
              Go to To-Do List
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
