import React, { useState } from "react";
import { Link } from "react-router-dom";

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const documents = [];

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.party.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1">
      <header className="flex items-center justify-between h-16 px-8 border-b border-gray-800">
        <div className="flex-1">
          <label className="relative text-gray-400 focus-within:text-gray-200">
            <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 left-3">
              search
            </span>
            <input
              className="bg-gray-800 border-gray-700 placeholder-gray-500 rounded-md pl-10 pr-4 py-2 w-full max-w-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
              placeholder="Search documents..."
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>
        <div className="flex items-center gap-4">
          <button
            aria-label="Notifications"
            className="relative p-2 rounded-full hover:bg-gray-800"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23374151'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-family='Arial' font-size='40'%3EU%3C/text%3E%3C/svg%3E\")",
            }}
          ></div>
        </div>
      </header>

      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Documents</h2>
          <Link
            to="/draft"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            New Document
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700">
              <span>Party</span>
              <span className="material-symbols-outlined text-gray-400">
                expand_more
              </span>
            </button>
          </div>
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700">
              <span>Status</span>
              <span className="material-symbols-outlined text-gray-400">
                expand_more
              </span>
            </button>
          </div>
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700">
              <span>Type</span>
              <span className="material-symbols-outlined text-gray-400">
                expand_more
              </span>
            </button>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-gray-800/50 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-800/80">
                <tr>
                  <th
                    className="px-6 py-3 text-sm font-semibold text-gray-300"
                    scope="col"
                  >
                    Document
                  </th>
                  <th
                    className="px-6 py-3 text-sm font-semibold text-gray-300"
                    scope="col"
                  >
                    Party
                  </th>
                  <th
                    className="px-6 py-3 text-sm font-semibold text-gray-300"
                    scope="col"
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-sm font-semibold text-gray-300"
                    scope="col"
                  >
                    Type
                  </th>
                  <th
                    className="px-6 py-3 text-sm font-semibold text-gray-300"
                    scope="col"
                  >
                    Last Modified
                  </th>
                  <th className="relative px-6 py-3" scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-800/70">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {doc.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {doc.party}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full 
                        ${
                          doc.status === "Active"
                            ? "text-green-400 bg-green-500/10"
                            : doc.status === "Draft"
                            ? "text-yellow-400 bg-yellow-500/10"
                            : "text-blue-400 bg-blue-500/10"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {doc.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {doc.lastModified}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={
                          doc.status === "Draft"
                            ? `/draft/${doc.id}`
                            : `/documents/${doc.id}`
                        }
                        className="text-[var(--primary-color)] hover:text-blue-500"
                      >
                        {doc.status === "Draft" ? "Continue Draft" : "Open"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
