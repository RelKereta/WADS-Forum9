import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("farrell.arya@binus.ac.id");
  const [password, setPassword] = useState("2702323540");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const { login, user, refreshUser } = useAuth();

  // Effect to handle navigation after successful login
  useEffect(() => {
    if (loginSuccess || user) {
      console.log("Login successful, navigating to /todo");
      navigate("/todo");
    }
  }, [loginSuccess, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Logging in with:", email);
      
      // Try direct API call with credentials to support sessions
      try {
        console.log("Attempting direct API call to: http://localhost:5001/api/auth/login");
        const response = await axios.post("http://localhost:5001/api/auth/login", 
          {
            email,
            password
          },
          {
            withCredentials: true // Important for session cookies
          }
        );
        
        console.log("Direct login successful:", response.data);
        
        // Store user data in localStorage for app state
        if (response.data.user) {
          localStorage.setItem("auth_user", JSON.stringify(response.data.user));
        }
        
        // Update the user in AuthContext
        console.log("Refreshing user in AuthContext");
        refreshUser();
        
        // Force navigation
        console.log("Setting login success flag");
        setLoginSuccess(true);
        return;
      } catch (directError) {
        console.error("Direct login failed:", directError);
        
        if (directError.response) {
          setError(`Direct login failed: ${directError.response.data?.message || directError.response.statusText} (${directError.response.status})`);
        } else if (directError.request) {
          setError("Server not responding. Please make sure the backend server is running at http://localhost:5001.");
          console.error("No response received:", directError.request);
        } else {
          setError(`Error: ${directError.message}`);
        }
        
        // Try login via authService as a fallback
        console.log("Direct login failed, trying through authService", directError.message);
        
        try {
          await login(email, password);
          console.log("Auth service login successful");
          setLoginSuccess(true);
        } catch (serviceError) {
          console.error("AuthService login also failed:", serviceError);
          
          if (serviceError.response) {
            setError(`AuthService login failed: ${serviceError.response.data?.message || serviceError.response.statusText} (${serviceError.response.status})`);
          } else if (serviceError.request) {
            setError("AuthService received no response. Check network connection and server status.");
          } else {
            setError(`AuthService error: ${serviceError.message}`);
          }
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.response) {
        // The server responded with an error
        setError(`Login failed: ${err.response.data?.message || err.response.statusText}`);
      } else if (err.request) {
        // No response received
        setError("Server not responding. Please try again later.");
      } else {
        // Other error
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Login</h2>
          {error && <p className="mt-2 text-red-600">{error}</p>}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-2"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign Up
            </button>
          </div>
          
          <div className="text-sm text-center text-gray-600">
            Test account: farrell.arya@binus.ac.id / 2702323540
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
