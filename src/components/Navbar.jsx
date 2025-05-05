import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-blue-600 p-4 shadow-md mb-4">
            <div className="flex justify-center space-x-4">
                <Link to="/" className="text-white hover:bg-blue-500 px-3 py-2 rounded-md transition">
                    Home
                </Link>
                {user && (
                    <>
                        <Link to="/todo" className="text-white hover:bg-blue-500 px-3 py-2 rounded-md transition">
                            To-Do List
                        </Link>
                        <Link to="/profile" className="text-white hover:bg-blue-500 px-3 py-2 rounded-md transition">
                            Profile
                        </Link>
                        <button
                            onClick={logout}
                            className="text-white bg-red-500 px-3 py-2 rounded-md transition hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
