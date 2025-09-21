import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register, demoUsers } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let result;
      if (isRegister) {
        result = await register({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          role: "user",
        });
        if (result.success) {
          // After successful registration, automatically login
          result = await login({
            email: credentials.email,
            password: credentials.password,
          });
        }
      } else {
        result = await login(credentials);
      }

      if (result.success) {
        navigate("/");
        setCredentials({ email: "", password: "", name: "" });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoUser) => {
    const demoCredentials = {
      email: demoUser.email,
      password:
        demoUser.email === "demo@clausecraft.com"
          ? "demo123"
          : demoUser.email === "lawyer@clausecraft.com"
          ? "lawyer123"
          : "client123",
    };

    setLoading(true);
    setError("");

    try {
      const result = await login(demoCredentials);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            ClauseCraft
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            AI-Powered Legal Document Platform
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white dark:bg-slate-800 py-8 px-6 shadow-xl rounded-xl border border-gray-200 dark:border-slate-700">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                {isRegister ? "Create Account" : "Welcome Back"}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-center">
                {isRegister
                  ? "Sign up to start using ClauseCraft"
                  : "Sign in to your account"}
              </p>
            </div>

            {/* Demo Users Section */}
            {!isRegister && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Quick Demo Login
                </h4>
                <div className="grid gap-2">
                  {demoUsers &&
                    demoUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleDemoLogin(user)}
                        disabled={loading}
                        className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-white">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white text-sm">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {user.email} • {user.role}
                            </div>
                          </div>
                          <div className="text-blue-600 dark:text-blue-400">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                      Or continue with email
                    </span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-400 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-700 dark:text-red-400 text-sm">
                    {error}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={credentials.name || ""}
                    onChange={(e) =>
                      setCredentials({ ...credentials, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : isRegister ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                  setCredentials({ email: "", password: "", name: "" });
                }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                {isRegister
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </div>

            {/* Additional Info */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-slate-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By signing in, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
