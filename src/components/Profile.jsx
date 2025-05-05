import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    photoURL: ""
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError("Please login to view your profile");
      return;
    }

    // Load profile data from current user
    setLoading(true);
    setError(null);
    
    try {
      // Create initial profile from user data
      const initialProfile = {
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}`
      };
      
      setProfile(initialProfile);
      setFormData(initialProfile);
      setLoading(false);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile data");
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      // Prepare the data to update
      const updateData = {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      };
      
      // Send profile update to API
      try {
        // Try server-side update first
        const updatedUser = await authService.updateProfile(updateData);
        console.log("Profile updated successfully:", updatedUser);
        setProfile(updatedUser);
        refreshUser(); // Refresh user context
        setSuccessMessage("Profile updated successfully!");
      } catch (apiError) {
        console.error("API update failed, falling back to local update:", apiError);
        
        // Fallback to local update if API fails
        setProfile(formData);
        
        // Update user data in local storage to reflect changes
        const updatedUser = {
          ...user,
          displayName: formData.displayName,
          photoURL: formData.photoURL
        };
        
        localStorage.setItem("auth_user", JSON.stringify(updatedUser));
        refreshUser(); // Update the user in context
        setSuccessMessage("Profile updated locally (server update failed)");
      }
      
      setEditMode(false);
      setLoading(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile changes");
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-xl text-gray-700">Loading profile...</div>;

  if (error) return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
      <button onClick={() => window.history.back()} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
        Go Back
      </button>
    </div>
  );

  if (!user) return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
      <div className="text-center text-xl text-gray-700 mb-4">
        Please login to view your profile
      </div>
      <button onClick={() => window.location.href = "/login"} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
        Login
      </button>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
      <h1 className="text-2xl font-semibold text-center mb-4 text-black">Profile</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {editMode ? (
        <div className="space-y-3">
          <input 
            type="text" 
            name="displayName" 
            value={formData.displayName} 
            onChange={handleChange} 
            placeholder="Display Name" 
            className="w-full p-2 border border-gray-300 rounded-md text-black" 
          />
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            disabled 
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-black" 
          />
          <input 
            type="text" 
            name="photoURL" 
            value={formData.photoURL} 
            onChange={handleChange} 
            placeholder="Profile Picture URL" 
            className="w-full p-2 border border-gray-300 rounded-md text-black" 
          />
          <div className="text-sm text-gray-500">
            Leave blank to use default avatar: https://ui-avatars.com/api/?name=Your+Name
          </div>
          
          <div className="flex space-x-2">
            <button onClick={handleSave} className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
              Save Profile
            </button>
            <button onClick={() => setEditMode(false)} className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-black">
          {profile?.photoURL && (
            <div className="flex justify-center mb-4">
              <img 
                src={profile.photoURL} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover" 
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName || 'User')}` }}
              />
            </div>
          )}
          <p><strong>Name:</strong> {profile?.displayName || "Not provided"}</p>
          <p><strong>Email:</strong> {profile?.email || "Not provided"}</p>

          <button onClick={() => setEditMode(true)} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            Edit Profile
          </button>
          <button onClick={logout} className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 mt-2">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
