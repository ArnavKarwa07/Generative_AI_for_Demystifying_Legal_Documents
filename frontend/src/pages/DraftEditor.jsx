import React, { useState } from "react";
import { useParams } from "react-router-dom";

const DraftEditor = () => {
  const { id } = useParams();
  const [selectedClause, setSelectedClause] = useState("definitions");
  const [documentContent, setDocumentContent] = useState(
    "This is the main content of your document. You can edit and modify the content here using AI-powered suggestions and clause alternatives."
  );

  const tocItems = [
    { id: "definitions", label: "1. Definitions", active: true },
    { id: "services", label: "2. Services", active: false },
    { id: "payment", label: "3. Payment Terms", active: false },
    { id: "confidentiality", label: "4. Confidentiality", active: false },
  ];

  const versionHistory = [
    { id: "v3", label: "Version 3.0 - Current" },
    { id: "v2", label: "Version 2.1 - 2 hours ago" },
    { id: "v1", label: "Version 1.0 - Yesterday" },
  ];

  const clauseAlternatives = [
    { id: "alt1", label: "Standard Definition", active: true },
    { id: "alt2", label: "Comprehensive Definition", active: false },
    { id: "alt3", label: "Simplified Definition", active: false },
  ];

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Draft Editor
            </h1>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                <span className="material-symbols-outlined text-lg">
                  auto_awesome
                </span>
                AI Suggest
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors">
                <span className="material-symbols-outlined text-lg">share</span>
                Share
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                <span className="material-symbols-outlined text-lg">save</span>
                Save
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-full">
        {/* Left Sidebar - Table of Contents */}
        <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Table of Contents
            </h3>
            <nav className="space-y-1">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedClause(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              Version History
            </h3>
            <div className="space-y-1">
              {versionHistory.map((version) => (
                <button
                  key={version.id}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                >
                  {version.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Service Agreement
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Draft document • Last edited 2 hours ago
                </p>
              </div>

              {/* Document Editor */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                <div className="p-8">
                  <textarea
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    className="w-full h-96 bg-transparent border-none resize-none text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-0 text-base leading-relaxed"
                    placeholder="Start writing your document..."
                  />
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg mt-0.5">
                    auto_awesome
                  </span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      AI Suggestion
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-4">
                      "Consider adding a force majeure clause to protect both
                      parties from unforeseen circumstances that may prevent
                      contract fulfillment."
                    </p>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors">
                        Accept
                      </button>
                      <button className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 text-sm font-medium rounded-md transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Clause Alternatives */}
        <aside className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Clause Explanation
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              This clause outlines the payment terms for the services provided.
              It specifies the payment schedule and amounts due at each stage of
              the project.
            </p>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Alternative Clauses
            </h3>
            <div className="space-y-2 mb-6">
              {clauseAlternatives.map((alternative) => (
                <button
                  key={alternative.id}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                    alternative.active
                      ? "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  {alternative.label}
                </button>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Clause Provenance
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This clause is based on industry-standard payment terms for
              consulting agreements. It has been reviewed and approved by legal
              counsel.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DraftEditor;
