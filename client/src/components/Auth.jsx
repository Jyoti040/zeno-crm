import { useAuth } from '../context/AuthContext' 

/**
 * GoogleAuthButton Component
 * Initiates the Google OAuth login process by redirecting to the backend.
 */
const GoogleAuthButton = () => {
  const { login } = useAuth(); // Get the login function from AuthContext

  const handleLogin = () => {
    login(); // Call the login function from context, which redirects to backend OAuth
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Sign in with Google
    </button>
  );
};

export default GoogleAuthButton;
