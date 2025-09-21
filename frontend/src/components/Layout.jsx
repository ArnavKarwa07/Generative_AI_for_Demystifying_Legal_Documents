import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SearchBox from "./SearchBox";
import ChatBot from "./ChatBot";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout, loading, demoMode } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (path) => {
    return (
      location.pathname === path ||
      (path === "/documents" && location.pathname.startsWith("/documents")) ||
      (path === "/draft" && location.pathname.startsWith("/draft")) ||
      (path === "/clauses" && location.pathname.startsWith("/clauses")) ||
      (path === "/negotiation" && location.pathname.startsWith("/negotiation"))
    );
  };

  const navigationItems = [
    { path: "/", icon: "dashboard", label: "Dashboard" },
    { path: "/documents", icon: "description", label: "Documents" },
    { path: "/clauses", icon: "menu_book", label: "Clauses Library" },
    { path: "/draft", icon: "edit", label: "Draft Editor" },
  ];

  const notifications = [
    {
      id: 1,
      message: "Document analysis completed",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      message: "New clause suggestion available",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      message: "Draft saved successfully",
      time: "3 hours ago",
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Desktop Navbar */}
      <nav className="hidden lg:block bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    ClauseCraft
                  </h1>
                  {demoMode && (
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Demo Mode
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex space-x-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side - Search, Notifications, User */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="w-80">
                <SearchBox
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search documents, clauses..."
                  size="small"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative flex items-center justify-center w-9 h-9 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined">
                    notifications
                  </span>
                  {notifications.some((n) => n.unread) && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0 ${
                            notification.unread
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : ""
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm text-slate-900 dark:text-white">
                              {notification.message}
                            </p>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              {user ? (
                <button
                  onClick={logout}
                  className="flex items-center justify-center w-9 h-9 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <span className="material-symbols-outlined">logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Header and Sidebar */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center justify-center w-9 h-9 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
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
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                ClauseCraft
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Notifications */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex items-center justify-center w-9 h-9 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <span className="material-symbols-outlined text-lg">
                  notifications
                </span>
                {notifications.some((n) => n.unread) && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            fixed inset-y-0 left-0 z-50 
            w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 
            flex flex-col shadow-xl transition-transform duration-300 ease-in-out
          `}
        >
          {/* Mobile Sidebar Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    ClauseCraft
                  </h1>
                  {demoMode && (
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Demo Mode
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-center w-8 h-8 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile User Profile */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                    {demoMode && (
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {user.role}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center block"
              >
                Sign In
              </Link>
            )}
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <main className="bg-slate-50 dark:bg-slate-900 min-h-screen lg:pt-0">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        )}
      </main>

      {/* Floating Chatbot Button */}
      {user && (
        <button
          onClick={() => setChatbotOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
          title="Open AI Assistant"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      <ChatBot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </div>
  );
};

export default Layout;
