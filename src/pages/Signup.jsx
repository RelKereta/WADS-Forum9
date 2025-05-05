import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Signup = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      console.log("Registering new user:", { email, displayName });
      
      let registered = false;
      
      // First try direct API registration
      try {
        const response = await axios.post(
          "http://localhost:5001/api/auth/register",
          { 
            email, 
            password, 
            displayName 
          },
          { 
            withCredentials: true 
          }
        );
        
        console.log("Registration successful:", response.data);
        setSuccess("Account created successfully! Redirecting to login...");
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        
        registered = true;
      } 
      catch (directError) {
        console.error("Direct registration failed:", directError);
        
        if (directError.response) {
          throw new Error(directError.response.data?.message || directError.response.statusText);
        } else if (directError.request) {
          throw new Error("Server not responding. Is it running?");
        } else {
          throw directError;
        }
      }
      
      // Fallback to auth service if direct API call fails
      if (!registered) {
        await register(email, password, displayName);
        setSuccess("Account created successfully! Redirecting to todo app...");
        
        // Redirect after successful sign-up
        setTimeout(() => {
          navigate("/todo");
        }, 2000);
      }
    } 
    catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to create an account. Try again.");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-xl overflow-hidden">
        <h1 className="text-2xl font-semibold text-center mb-4 text-black">Sign Up</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display Name"
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>
          
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              required
              minLength={6}
            />
          </div>
          
          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
          
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-800"
            >
              Already have an account? Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
