import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { documentsAPI } from "../services/api";

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data } = await documentsAPI.getAll();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      // Fallback to demo data
      setDocuments([
        {
          id: "demo-1",
          filename: "Sample_NDA.pdf",
          file_type: "pdf",
          uploaded_at: "2024-01-15T10:30:00Z",
          analysis: {
            document_type: "Non-Disclosure Agreement",
            risk_level: "Low",
            summary: "Standard NDA with balanced terms for both parties.",
          },
        },
        {
          id: "demo-2",
          filename: "Service_Agreement.docx",
          file_type: "docx",
          uploaded_at: "2024-01-14T14:20:00Z",
          analysis: {
            document_type: "Service Agreement",
            risk_level: "Medium",
            summary: "Service agreement with some clauses requiring review.",
          },
        },
      ]);
      setError(null);
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
      const { data } = await documentsAPI.upload(formData);
      setDocuments((prev) => [data, ...prev]);
      setShowUploadModal(false);
      alert("Document uploaded and analyzed successfully!");
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
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return "picture_as_pdf";
      case "docx":
      case "doc":
        return "description";
      case "txt":
        return "text_snippet";
      default:
        return "insert_drive_file";
    }
  };

  const filters = [
    { id: "all", label: "All Documents" },
    { id: "low", label: "Low Risk" },
    { id: "medium", label: "Medium Risk" },
    { id: "high", label: "High Risk" },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Documents
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  upload
                </span>
                Upload Document
              </button>
              <Link
                to="/draft"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                New Document
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1">
        <div className="p-6 space-y-6">
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

          {/* Documents List */}
          {loading ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">
                Loading documents...
              </p>
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
              <div className="text-red-500 mb-4">
                <span className="material-symbols-outlined text-4xl">
                  error
                </span>
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
          ) : filteredDocuments.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl text-slate-400">
                  folder_open
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No documents found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Upload your first document to get started with AI analysis
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  upload
                </span>
                Upload Document
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">
                          {getFileIcon(doc.file_type)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                          {doc.filename}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {doc.file_type?.toUpperCase()} •{" "}
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {doc.analysis && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {doc.analysis.document_type}
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskStyle(
                            doc.analysis.risk_level
                          )}`}
                        >
                          {doc.analysis.risk_level} Risk
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {doc.analysis.summary}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => viewDocumentAnalysis(doc)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View Analysis
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Download"
                      >
                        <span className="material-symbols-outlined text-lg">
                          download
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Upload Document
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Upload a legal document (PDF, DOCX, TXT) for AI analysis and
                insights.
              </p>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={uploadLoading}
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer flex flex-col items-center ${
                    uploadLoading ? "pointer-events-none" : ""
                  }`}
                >
                  {uploadLoading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                  ) : (
                    <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">
                      upload
                    </span>
                  )}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {uploadLoading
                      ? "Uploading and analyzing..."
                      : "Click to upload file"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    PDF, DOCX, TXT up to 10MB
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Document Analysis
                </h3>
                <button
                  onClick={closeAnalysisModal}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {selectedDocument.filename}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {selectedDocument.analysis?.document_type}
                    </p>
                  </div>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRiskStyle(
                      selectedDocument.analysis?.risk_level
                    )}`}
                  >
                    {selectedDocument.analysis?.risk_level} Risk
                  </span>
                </div>

                {selectedDocument.analysis && (
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-slate-900 dark:text-white mb-2">
                        Summary
                      </h5>
                      <p className="text-slate-600 dark:text-slate-400">
                        {selectedDocument.analysis.summary}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-slate-900 dark:text-white mb-2">
                        Analysis Details
                      </h5>
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                        <pre className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                          {typeof selectedDocument.analysis.analysis ===
                          "string"
                            ? selectedDocument.analysis.analysis
                            : JSON.stringify(
                                selectedDocument.analysis.analysis,
                                null,
                                2
                              )}
                        </pre>
                      </div>
                    </div>

                    {selectedDocument.analysis.recommendations && (
                      <div>
                        <h5 className="font-medium text-slate-900 dark:text-white mb-2">
                          Recommendations
                        </h5>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                          {selectedDocument.analysis.recommendations.map(
                            (rec, index) => (
                              <li key={index} className="text-sm">
                                {rec}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
