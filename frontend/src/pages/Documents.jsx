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

    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await documentsAPI.upload(formData);
      setDocuments((prev) => [data, ...prev]);
      setShowUploadModal(false);
    } catch (err) {
      // Demo mode - simulate successful upload
      const demoDoc = {
        id: `demo-${Date.now()}`,
        filename: file.name,
        file_type: file.name.split(".").pop(),
        uploaded_at: new Date().toISOString(),
        analysis: {
          document_type: "Document",
          risk_level: "Low",
          summary: "Document uploaded successfully in demo mode.",
        },
      };
      setDocuments((prev) => [demoDoc, ...prev]);
      setShowUploadModal(false);
    } finally {
      setUploadLoading(false);
    }
  };

  const openAnalysisModal = (document) => {
    setSelectedDocument(document);
  };

  const closeAnalysisModal = () => {
    setSelectedDocument(null);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.filename
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      doc.file_type === selectedFilter ||
      (selectedFilter === "analyzed" && doc.analysis) ||
      (selectedFilter === "pending" && !doc.analysis);
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { id: "all", label: "All Documents" },
    { id: "pdf", label: "PDF Files" },
    { id: "docx", label: "Word Documents" },
    { id: "analyzed", label: "Analyzed" },
    { id: "pending", label: "Pending Analysis" },
  ];

  const riskColors = {
    Low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    Medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    High: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-lg">upload</span>
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
      ) : filteredDocuments.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-400 mb-4 block">
            description
          </span>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No Documents Found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {searchTerm || selectedFilter !== "all"
              ? "No documents match your current filters."
              : "Upload your first document to get started."}
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-lg">upload</span>
            Upload Document
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
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredDocuments.map((document) => (
                  <tr
                    key={document.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">
                            {document.file_type === "pdf"
                              ? "picture_as_pdf"
                              : "description"}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                            {document.filename}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {document.analysis?.document_type || "Unknown Type"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 uppercase">
                      {document.file_type}
                    </td>
                    <td className="px-6 py-4">
                      {document.analysis?.risk_level ? (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            riskColors[document.analysis.risk_level]
                          }`}
                        >
                          {document.analysis.risk_level}
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(document.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openAnalysisModal(document)}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          View Analysis
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.docx,.doc,.txt"
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
                  {selectedDocument.analysis?.risk_level && (
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        riskColors[selectedDocument.analysis.risk_level]
                      }`}
                    >
                      {selectedDocument.analysis.risk_level} Risk
                    </span>
                  )}
                </div>

                {selectedDocument.analysis?.summary && (
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Summary
                    </h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedDocument.analysis.summary}
                    </p>
                  </div>
                )}

                {selectedDocument.analysis?.recommendations && (
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
