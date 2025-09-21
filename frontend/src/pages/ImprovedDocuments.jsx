import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { documentsAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const { demoMode } = useAuth();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      if (demoMode) {
        // Demo data
        setDocuments([
          {
            id: "demo-1",
            filename: "Sample_NDA.pdf",
            file_type: "pdf",
            uploaded_at: "2024-01-15T10:30:00Z",
            size: "1.2 MB",
            analysis: {
              document_type: "Non-Disclosure Agreement",
              risk_level: "Low",
              summary:
                "Standard NDA with balanced terms for both parties. Contains mutual confidentiality obligations with reasonable exceptions.",
              key_clauses: ["Confidentiality", "Non-compete", "Termination"],
              risk_score: 0.2,
            },
          },
          {
            id: "demo-2",
            filename: "Service_Agreement.docx",
            file_type: "docx",
            uploaded_at: "2024-01-14T14:20:00Z",
            size: "2.8 MB",
            analysis: {
              document_type: "Service Agreement",
              risk_level: "Medium",
              summary:
                "Service agreement with some clauses requiring review. Payment terms are favorable but liability clauses need attention.",
              key_clauses: [
                "Payment Terms",
                "Liability",
                "Intellectual Property",
              ],
              risk_score: 0.6,
            },
          },
          {
            id: "demo-3",
            filename: "Employment_Contract.pdf",
            file_type: "pdf",
            uploaded_at: "2024-01-13T09:15:00Z",
            size: "3.1 MB",
            analysis: {
              document_type: "Employment Agreement",
              risk_level: "High",
              summary:
                "Employment contract with several concerning clauses. Non-compete terms are overly broad and termination clauses favor employer heavily.",
              key_clauses: ["Non-compete", "Termination", "Benefits"],
              risk_score: 0.8,
            },
          },
          {
            id: "demo-4",
            filename: "Lease_Agreement.pdf",
            file_type: "pdf",
            uploaded_at: "2024-01-12T16:45:00Z",
            size: "1.9 MB",
            analysis: {
              document_type: "Lease Agreement",
              risk_level: "Low",
              summary:
                "Standard residential lease agreement with fair terms for both landlord and tenant.",
              key_clauses: ["Rent", "Security Deposit", "Maintenance"],
              risk_score: 0.3,
            },
          },
        ]);
      } else {
        const { data } = await documentsAPI.getAll();
        setDocuments(Array.isArray(data) ? data : []);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load documents");
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("analyze", "true");

    try {
      setUploadLoading(true);

      if (demoMode) {
        // Simulate upload for demo
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const newDoc = {
          id: `demo-${Date.now()}`,
          filename: file.name,
          file_type: file.name.split(".").pop(),
          uploaded_at: new Date().toISOString(),
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          analysis: {
            document_type: "General Legal Document",
            risk_level: "Medium",
            summary:
              "Document uploaded and analyzed successfully. Please review the analysis for detailed insights.",
            key_clauses: ["General Provisions"],
            risk_score: 0.5,
          },
        };
        setDocuments((prev) => [newDoc, ...prev]);
      } else {
        const { data } = await documentsAPI.upload(formData);
        setDocuments((prev) => [data, ...prev]);
      }

      setShowUploadModal(false);
      // Reset file input
      event.target.value = "";
    } catch (err) {
      const message =
        err?.response?.data?.detail || err?.message || "Upload failed";
      alert(`Upload failed: ${message}`);
    } finally {
      setUploadLoading(false);
    }
  };

  const viewDocumentAnalysis = (doc) => {
    setSelectedDocument(doc);
  };

  const closeAnalysisModal = () => {
    setSelectedDocument(null);
  };

  const deleteDocument = async (docId) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      if (demoMode) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
      } else {
        await documentsAPI.delete(docId);
        await fetchDocuments();
      }
    } catch (err) {
      alert("Failed to delete document");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const name = doc.filename || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      (doc.analysis &&
        doc.analysis.risk_level &&
        doc.analysis.risk_level.toLowerCase() === selectedFilter);
    return matchesSearch && matchesFilter;
  });

  const getRiskStyle = (riskLevel) => {
    switch (riskLevel) {
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return (
          <svg
            className="w-8 h-8 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "docx":
      case "doc":
        return (
          <svg
            className="w-8 h-8 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-8 h-8 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Documents
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and analyze your legal documents
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span>Upload Document</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Documents
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {documents.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Low Risk
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {
                    documents.filter((d) => d.analysis?.risk_level === "Low")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Medium Risk
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {
                    documents.filter((d) => d.analysis?.risk_level === "Medium")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  High Risk
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {
                    documents.filter((d) => d.analysis?.risk_level === "High")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>

              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Loading documents...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Documents Grid/List */}
        {!loading && !error && (
          <>
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No documents found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm || selectedFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by uploading your first document"}
                </p>
                {!searchTerm && selectedFilter === "all" && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Upload Document
                  </button>
                )}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow ${
                      viewMode === "list" ? "p-6" : "p-4"
                    }`}
                  >
                    {viewMode === "grid" ? (
                      // Grid View
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {getFileIcon(doc.file_type)}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {doc.filename}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {doc.size || "Unknown size"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => viewDocumentAnalysis(doc)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              title="View Analysis"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteDocument(doc.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Delete Document"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskStyle(
                                doc.analysis?.risk_level
                              )}`}
                            >
                              {doc.analysis?.risk_level || "Unknown"} Risk
                            </span>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {doc.analysis?.document_type || "Unknown Type"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                              {doc.analysis?.summary || "No analysis available"}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatDate(doc.uploaded_at)}</span>
                            {doc.analysis?.risk_score && (
                              <span>
                                Risk:{" "}
                                {Math.round(doc.analysis.risk_score * 100)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      // List View
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          {getFileIcon(doc.file_type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {doc.filename}
                              </h3>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskStyle(
                                  doc.analysis?.risk_level
                                )}`}
                              >
                                {doc.analysis?.risk_level || "Unknown"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                              <span>
                                {doc.analysis?.document_type || "Unknown Type"}
                              </span>
                              <span>{doc.size || "Unknown size"}</span>
                              <span>{formatDate(doc.uploaded_at)}</span>
                              {doc.analysis?.risk_score && (
                                <span>
                                  Risk Score:{" "}
                                  {Math.round(doc.analysis.risk_score * 100)}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewDocumentAnalysis(doc)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            View Analysis
                          </button>
                          <button
                            onClick={() => deleteDocument(doc.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600"
                            title="Delete Document"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Upload Document
              </h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    disabled={uploadLoading}
                    className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supported formats: PDF, DOC, DOCX, TXT (max 10MB)
                </p>
                {uploadLoading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {demoMode
                        ? "Simulating upload and analysis..."
                        : "Uploading and analyzing..."}
                    </span>
                  </div>
                )}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    disabled={uploadLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Document Analysis
                  </h2>
                  <button
                    onClick={closeAnalysisModal}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Document Info */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Document Details
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Filename:
                          </span>
                          <p className="font-medium text-gray-900 dark:text-white break-words">
                            {selectedDocument.filename}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Type:
                          </span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedDocument.analysis?.document_type ||
                              "Unknown"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Size:
                          </span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedDocument.size || "Unknown"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Uploaded:
                          </span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatDate(selectedDocument.uploaded_at)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Risk Level:
                          </span>
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskStyle(
                                selectedDocument.analysis?.risk_level
                              )}`}
                            >
                              {selectedDocument.analysis?.risk_level ||
                                "Unknown"}
                            </span>
                          </div>
                        </div>
                        {selectedDocument.analysis?.risk_score && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">
                              Risk Score:
                            </span>
                            <div className="mt-1">
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    selectedDocument.analysis.risk_score < 0.4
                                      ? "bg-green-600"
                                      : selectedDocument.analysis.risk_score <
                                        0.7
                                      ? "bg-yellow-600"
                                      : "bg-red-600"
                                  }`}
                                  style={{
                                    width: `${
                                      selectedDocument.analysis.risk_score * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {Math.round(
                                  selectedDocument.analysis.risk_score * 100
                                )}
                                % risk
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedDocument.analysis?.key_clauses && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Key Clauses
                        </h3>
                        <div className="space-y-2">
                          {selectedDocument.analysis.key_clauses.map(
                            (clause, index) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded mr-2 mb-2"
                              >
                                {clause}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Analysis Content */}
                  <div className="lg:col-span-2">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Analysis Summary
                      </h3>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {selectedDocument.analysis?.summary ||
                            "No analysis available for this document."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <Link
                        to={`/draft?template=${selectedDocument.analysis?.document_type}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Create Similar Draft
                      </Link>
                      <Link
                        to={`/negotiation?doc=${selectedDocument.id}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"
                          />
                        </svg>
                        Start Negotiation
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
