import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DraftEditor = () => {
  const { id } = useParams();
  const [selectedClause, setSelectedClause] = useState("definitions");
  const [selectedVersion, setSelectedVersion] = useState("v3");
  const [selectedAlternative, setSelectedAlternative] = useState("alt1");
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [documentContent, setDocumentContent] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  // AI Suggestions for different clauses
  const aiSuggestionsData = {
    definitions: [
      {
        id: "def_1",
        title: "Add Intellectual Property Definition",
        content:
          'Consider adding a definition for "Intellectual Property" to clarify ownership of work products and deliverables.',
        type: "addition",
        priority: "high",
      },
      {
        id: "def_2",
        title: "Clarify Service Provider Definition",
        content:
          "The Service Provider definition could be more specific about the entity type and jurisdiction.",
        type: "modification",
        priority: "medium",
      },
    ],
    services: [
      {
        id: "serv_1",
        title: "Add Performance Standards",
        content:
          "Consider adding specific performance metrics and quality standards for the services to be provided.",
        type: "addition",
        priority: "high",
      },
      {
        id: "serv_2",
        title: "Include Delivery Timeline",
        content:
          "Adding specific timelines and milestones would help clarify expectations for both parties.",
        type: "addition",
        priority: "medium",
      },
    ],
    payment: [
      {
        id: "pay_1",
        title: "Add Currency Specification",
        content:
          "Specify the currency for all payments to avoid confusion in international agreements.",
        type: "modification",
        priority: "high",
      },
      {
        id: "pay_2",
        title: "Include Late Payment Interest",
        content:
          "The current late payment clause could be strengthened with clearer interest calculation methods.",
        type: "modification",
        priority: "medium",
      },
    ],
    confidentiality: [
      {
        id: "conf_1",
        title: "Add Return of Information Clause",
        content:
          "Consider adding a clause requiring return or destruction of confidential information upon termination.",
        type: "addition",
        priority: "high",
      },
      {
        id: "conf_2",
        title: "Strengthen Exception Language",
        content:
          "The exceptions to confidentiality could be more precisely defined to avoid disputes.",
        type: "modification",
        priority: "medium",
      },
    ],
    termination: [
      {
        id: "term_1",
        title: "Add Immediate Termination Causes",
        content:
          "Consider adding specific grounds for immediate termination without notice (e.g., breach of confidentiality).",
        type: "addition",
        priority: "high",
      },
      {
        id: "term_2",
        title: "Clarify Post-Termination Obligations",
        content:
          "The surviving obligations after termination should be more clearly specified.",
        type: "modification",
        priority: "medium",
      },
    ],
    governing_law: [
      {
        id: "gov_1",
        title: "Add Jurisdiction Clause",
        content:
          "Consider specifying the exact jurisdiction and court system that will handle disputes.",
        type: "addition",
        priority: "high",
      },
      {
        id: "gov_2",
        title: "Include Mediation Step",
        content:
          "Adding a mandatory mediation step before arbitration could save costs and time.",
        type: "addition",
        priority: "medium",
      },
    ],
  };

  const tocItems = [
    { id: "definitions", label: "1. Definitions" },
    { id: "services", label: "2. Services" },
    { id: "payment", label: "3. Payment Terms" },
    { id: "confidentiality", label: "4. Confidentiality" },
    { id: "termination", label: "5. Termination" },
    { id: "governing_law", label: "6. Governing Law" },
  ];

  const versionHistory = [
    { id: "v3", label: "Version 3.0 - Current", timestamp: "2024-01-15 14:30" },
    {
      id: "v2",
      label: "Version 2.1 - 2 hours ago",
      timestamp: "2024-01-15 12:15",
    },
    {
      id: "v1",
      label: "Version 1.0 - Yesterday",
      timestamp: "2024-01-14 16:45",
    },
  ];

  const clauseAlternatives = [
    {
      id: "alt1",
      label: "Standard Definition",
      description: "Industry standard clause with basic coverage",
    },
    {
      id: "alt2",
      label: "Comprehensive Definition",
      description: "Detailed clause with extensive coverage",
    },
    {
      id: "alt3",
      label: "Simplified Definition",
      description: "Simplified clause for basic agreements",
    },
  ];

  // Content for different clauses
  const clauseContent = {
    definitions: `1. DEFINITIONS

For the purposes of this Agreement, the following terms shall have the meanings set forth below:

1.1 "Services" means the professional consulting services to be provided by the Service Provider as described in Exhibit A attached hereto and incorporated herein by reference.

1.2 "Client" means [CLIENT NAME], a [STATE] [ENTITY TYPE] with its principal place of business at [CLIENT ADDRESS].

1.3 "Service Provider" means [PROVIDER NAME], a [STATE] [ENTITY TYPE] with its principal place of business at [PROVIDER ADDRESS].

1.4 "Confidential Information" means any and all non-public, confidential or proprietary information disclosed by either party to the other party.

1.5 "Effective Date" means the date this Agreement is executed by both parties.`,
    services: `2. SERVICES

2.1 Service Provider agrees to provide the Services to Client in accordance with the terms and conditions of this Agreement.

2.2 The specific scope of Services is detailed in Exhibit A, which may be modified from time to time by mutual written agreement of the parties.

2.3 Service Provider shall perform the Services in a professional and workmanlike manner in accordance with industry standards.

2.4 Time is not of the essence with respect to the performance of Services unless otherwise specified in writing.`,
    payment: `3. PAYMENT TERMS

3.1 In consideration for the Services, Client shall pay Service Provider the fees set forth in Exhibit B.

3.2 Payment terms are Net 30 days from the date of invoice.

3.3 Late payments shall incur a service charge of 1.5% per month or the maximum rate permitted by law, whichever is less.

3.4 Client shall reimburse Service Provider for all reasonable out-of-pocket expenses incurred in connection with the Services, provided such expenses are pre-approved in writing.`,
    confidentiality: `4. CONFIDENTIALITY

4.1 Each party acknowledges that it may receive Confidential Information from the other party.

4.2 Each party agrees to hold all Confidential Information in strict confidence and not to disclose such information to third parties without the prior written consent of the disclosing party.

4.3 The obligations of confidentiality shall survive termination of this Agreement for a period of five (5) years.

4.4 This section shall not apply to information that: (a) is publicly available, (b) becomes publicly available through no breach of this Agreement, or (c) is required to be disclosed by law.`,
    termination: `5. TERMINATION

5.1 This Agreement may be terminated by either party upon thirty (30) days written notice to the other party.

5.2 Either party may terminate this Agreement immediately upon written notice in the event of a material breach by the other party that remains uncured for fifteen (15) days after written notice.

5.3 Upon termination, all unpaid fees for Services performed prior to termination shall become immediately due and payable.

5.4 The provisions of Sections 4 (Confidentiality) and 6 (Governing Law) shall survive any termination of this Agreement.`,
    governing_law: `6. GOVERNING LAW

6.1 This Agreement shall be governed by and construed in accordance with the laws of [STATE], without regard to its conflict of laws principles.

6.2 Any disputes arising under this Agreement shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.

6.3 The prevailing party in any dispute shall be entitled to recover its reasonable attorneys' fees and costs.`,
  };

  // Update document content when clause selection changes
  useEffect(() => {
    setDocumentContent(
      clauseContent[selectedClause] ||
        "Select a clause from the table of contents to begin editing."
    );
  }, [selectedClause]);

  const handleClauseSelect = (clauseId) => {
    setSelectedClause(clauseId);
    setSidebarOpen(false); // Close mobile sidebar
  };

  const handleVersionSelect = (versionId) => {
    setSelectedVersion(versionId);
    // In a real app, this would load the version content
  };

  const handleAlternativeSelect = (altId) => {
    setSelectedAlternative(altId);
    // In a real app, this would update the content with the alternative
  };

  const handleAISuggestionAction = (action, suggestionId) => {
    if (action === "accept") {
      // In a real app, this would insert the suggestion into the document
      setAiSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
      alert(
        "AI suggestion has been accepted and integrated into the document!"
      );
    } else if (action === "reject") {
      setAiSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
    } else if (action === "dismiss") {
      setAiSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
    }
  };

  const saveDocument = () => {
    // Simulate saving
    alert("Document saved successfully!");
  };

  const shareDocument = () => {
    // Simulate sharing
    alert("Document sharing link copied to clipboard!");
  };

  const getAISuggestion = async () => {
    setLoadingAI(true);
    setShowAISuggestion(true);

    // Simulate AI processing time
    setTimeout(() => {
      const suggestions = aiSuggestionsData[selectedClause] || [];
      setAiSuggestions(suggestions);
      setLoadingAI(false);
    }, 1500);
  };

  const dismissAllSuggestions = () => {
    setAiSuggestions([]);
    setShowAISuggestion(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center justify-center w-8 h-8 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Draft Editor
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={getAISuggestion}
                disabled={loadingAI}
                className={`inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors ${
                  loadingAI
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {loadingAI ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">
                      auto_awesome
                    </span>
                    <span className="hidden sm:inline">AI Suggest</span>
                  </>
                )}
              </button>
              <button
                onClick={shareDocument}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-lg">share</span>
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={saveDocument}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-lg">save</span>
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar - Table of Contents */}
        <aside
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 
          w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 
          flex-shrink-0 transition-transform duration-300 ease-in-out overflow-hidden
        `}
        >
          <div className="p-6 h-full overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Document Navigation
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Table of Contents
            </h3>
            <nav className="space-y-1 mb-8">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleClauseSelect(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedClause === item.id
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Version History
            </h3>
            <div className="space-y-1">
              {versionHistory.map((version) => (
                <button
                  key={version.id}
                  onClick={() => handleVersionSelect(version.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedVersion === version.id
                      ? "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  <div className="font-medium">{version.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">
                    {version.timestamp}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 lg:p-8 min-h-full">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Service Agreement
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Draft document • Last edited 2 hours ago • Editing:{" "}
                  {tocItems.find((item) => item.id === selectedClause)?.label}
                </p>
              </div>

              {/* Document Editor */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                <div className="border-b border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {tocItems.find((item) => item.id === selectedClause)
                        ?.label || "Document Content"}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-lg">
                        edit
                      </span>
                      Editable
                    </div>
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <textarea
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    className="w-full h-96 bg-transparent border-none resize-none text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-0 text-base leading-relaxed font-mono custom-scrollbar"
                    placeholder="Start writing your document..."
                  />
                </div>
              </div>

              {/* AI Suggestions */}
              {showAISuggestion && (
                <div className="space-y-4">
                  {loadingAI ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            AI Analyzing{" "}
                            {
                              tocItems.find(
                                (item) => item.id === selectedClause
                              )?.label
                            }
                            ...
                          </h4>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Our AI is reviewing the clause for potential
                            improvements
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : aiSuggestions.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                            auto_awesome
                          </span>
                          AI Suggestions for{" "}
                          {
                            tocItems.find((item) => item.id === selectedClause)
                              ?.label
                          }
                        </h3>
                        <button
                          onClick={dismissAllSuggestions}
                          className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                          Dismiss All
                        </button>
                      </div>

                      {aiSuggestions.map((suggestion, index) => (
                        <div
                          key={suggestion.id}
                          className={`border rounded-xl p-6 ${
                            suggestion.priority === "high"
                              ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                              : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                suggestion.priority === "high"
                                  ? "bg-amber-100 dark:bg-amber-900/40"
                                  : "bg-blue-100 dark:bg-blue-900/40"
                              }`}
                            >
                              <span
                                className={`material-symbols-outlined text-lg ${
                                  suggestion.priority === "high"
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-blue-600 dark:text-blue-400"
                                }`}
                              >
                                {suggestion.type === "addition"
                                  ? "add_circle"
                                  : "edit"}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-slate-900 dark:text-white">
                                  {suggestion.title}
                                </h4>
                                <div className="flex items-center gap-1">
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      suggestion.priority === "high"
                                        ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                    }`}
                                  >
                                    {suggestion.priority} priority
                                  </span>
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      suggestion.type === "addition"
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                                    }`}
                                  >
                                    {suggestion.type}
                                  </span>
                                </div>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 mb-4">
                                {suggestion.content}
                              </p>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleAISuggestionAction(
                                      "accept",
                                      suggestion.id
                                    )
                                  }
                                  className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    check
                                  </span>
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleAISuggestionAction(
                                      "reject",
                                      suggestion.id
                                    )
                                  }
                                  className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    close
                                  </span>
                                  Reject
                                </button>
                                <button
                                  onClick={() =>
                                    handleAISuggestionAction(
                                      "dismiss",
                                      suggestion.id
                                    )
                                  }
                                  className="flex items-center gap-1 px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 text-sm font-medium rounded-md transition-colors"
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    visibility_off
                                  </span>
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    showAISuggestion &&
                    !loadingAI && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">
                            check_circle
                          </span>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              No Suggestions Needed
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                              This clause looks well-structured. Great work!
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Clause Alternatives */}
        <aside className="hidden xl:block w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex-shrink-0 overflow-hidden">
          <div className="p-6 h-full overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Clause Explanation
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              {selectedClause === "definitions" &&
                "This section defines key terms used throughout the agreement to ensure clarity and avoid misunderstandings."}
              {selectedClause === "services" &&
                "This clause outlines the specific services to be provided and the standards of performance expected."}
              {selectedClause === "payment" &&
                "This clause specifies payment terms, amounts, and schedules for the services provided."}
              {selectedClause === "confidentiality" &&
                "This clause protects sensitive information shared between parties during the course of the agreement."}
              {selectedClause === "termination" &&
                "This clause outlines the conditions under which the agreement may be terminated by either party."}
              {selectedClause === "governing_law" &&
                "This clause determines which state laws govern the agreement and how disputes will be resolved."}
            </p>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Alternative Clauses
            </h3>
            <div className="space-y-2 mb-6">
              {clauseAlternatives.map((alternative) => (
                <button
                  key={alternative.id}
                  onClick={() => handleAlternativeSelect(alternative.id)}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                    selectedAlternative === alternative.id
                      ? "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white border border-slate-300 dark:border-slate-600"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  <div className="font-medium">{alternative.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {alternative.description}
                  </div>
                </button>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Clause Provenance
            </h3>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                This clause is based on industry-standard legal language for
                {selectedClause === "definitions" &&
                  " definitions sections in commercial agreements"}
                {selectedClause === "services" &&
                  " service provider agreements"}
                {selectedClause === "payment" && " consulting agreements"}
                {selectedClause === "confidentiality" &&
                  " non-disclosure provisions"}
                {selectedClause === "termination" && " termination clauses"}
                {selectedClause === "governing_law" &&
                  " governing law provisions"}
                . It has been reviewed and approved by legal counsel.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <span className="material-symbols-outlined text-sm">
                  verified
                </span>
                Legally Verified
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DraftEditor;
