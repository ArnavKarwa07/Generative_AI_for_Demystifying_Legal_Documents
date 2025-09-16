import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { documentsAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDocuments();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentsAPI.getAll();
      setDocuments(response.data);
    } catch (err) {
      setError("Failed to fetch documents");
      // Fallback to mock data for demo purposes
      setDocuments([
        {
          id: 1,
          title: "NDA - Acme Corp",
          party: "Acme Corporation",
          status: "Signed",
          type: "NDA",
          updated_at: "2024-01-15",
        },
        {
          id: 2,
          title: "Service Agreement - Beta Inc",
          party: "Beta Inc",
          status: "Review",
          type: "Service",
          updated_at: "2024-01-14",
        },
        {
          id: 3,
          title: "Employment Contract",
          party: "John Doe",
          status: "Draft",
          type: "Employment",
          updated_at: "2024-01-13",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const name = doc.title || doc.name || "";
    const party = doc.party || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || doc.status.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Signed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Draft":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  const filters = [
    { id: "all", label: "All Documents" },
    { id: "signed", label: "Signed" },
    { id: "review", label: "In Review" },
    { id: "draft", label: "Draft" },
  ];

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Documents
            </h1>
            <Link
              to="/draft"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              New Document
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative max-w-md">
            <input
              type="search"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-lg">
              search
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Authentication Check */}
        {!user ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Please sign in to view documents
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              You need to be authenticated to access your documents.
            </p>
          </div>
        ) : loading ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">
              Loading documents...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
            <div className="text-red-500 mb-4">
              <span className="material-symbols-outlined text-4xl">error</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Error loading documents
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">{error}</p>
            <button
              onClick={fetchDocuments}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Party
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Last Modified
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredDocuments.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mr-3">
                            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-lg">
                              description
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {doc.title || doc.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {doc.party}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                            doc.status
                          )}`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {doc.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(
                          doc.updated_at || doc.lastModified
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/documents/${doc.id}`}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                          >
                            View
                          </Link>
                          {doc.status === "Draft" && (
                            <Link
                              to={`/draft/${doc.id}`}
                              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
                            >
                              Edit
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
