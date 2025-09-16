import React from "react";
import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return (
      location.pathname === path ||
      (path === "/documents" && location.pathname.startsWith("/documents")) ||
      (path === "/draft" && location.pathname.startsWith("/draft")) ||
      (path === "/clauses" && location.pathname.startsWith("/clauses")) ||
      (path === "/negotiation" && location.pathname.startsWith("/negotiation"))
    );
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-gray-800 rounded-md">
            <svg
              className="w-6 h-6 text-[var(--primary-color)]"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <h1 className="text-xl font-bold">ClauseCraft</h1>
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
              isActive("/")
                ? "text-white bg-gray-800"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/documents"
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
              isActive("/documents")
                ? "text-white bg-gray-800"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined">description</span>
            <span>Documents</span>
          </Link>

          <Link
            to="/clauses"
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
              isActive("/clauses")
                ? "text-white bg-gray-800"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined">menu_book</span>
            <span>Clauses</span>
          </Link>

          <Link
            to="/draft"
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
              isActive("/draft")
                ? "text-white bg-gray-800"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined">edit</span>
            <span>Draft Editor</span>
          </Link>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
          >
            <span className="material-symbols-outlined">group</span>
            <span>People</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
          >
            <span className="material-symbols-outlined">
              integration_instructions
            </span>
            <span>Integrations</span>
          </a>
        </nav>

        <div className="mt-auto p-4">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23374151'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-family='Arial' font-size='40'%3EU%3C/text%3E%3C/svg%3E\")",
            }}
          ></div>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default Layout;
