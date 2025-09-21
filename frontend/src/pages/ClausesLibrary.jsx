import React, { useState } from "react";

const ClausesLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTags, setSelectedTags] = useState("All");

  const clauses = [
    {
      id: 1,
      name: "Standard Confidentiality",
      tags: ["Confidentiality", "NDA"],
      lastUpdated: "2024-01-15",
      status: "approved",
    },
    {
      id: 2,
      name: "Payment Terms - Net 30",
      tags: ["Payment", "Terms"],
      lastUpdated: "2024-01-14",
      status: "approved",
    },
    {
      id: 3,
      name: "Termination Clause",
      tags: ["Termination", "Contract"],
      lastUpdated: "2024-01-13",
      status: "draft",
    },
  ];

  const tabs = [
    { id: "all", label: "All Clauses" },
    { id: "approved", label: "Approved" },
    { id: "draft", label: "Draft" },
  ];

  const tagFilters = [
    "All",
    "Confidentiality",
    "Payment",
    "Termination",
    "Contract",
  ];

  const filteredClauses = clauses.filter((clause) => {
    const matchesSearch = clause.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || clause.status === activeTab;
    const matchesTag =
      selectedTags === "All" || clause.tags.includes(selectedTags);
    return matchesSearch && matchesTab && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex items-center justify-between">
        <div></div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
          <span className="material-symbols-outlined text-lg">add</span>
          New Clause
        </button>
      </div>

      {/* Tabs */}
      <div>
        <nav className="flex space-x-8 border-b border-slate-200 dark:border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tag Filters */}
      <div>
        <div className="flex flex-wrap gap-2">
          {tagFilters.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTags(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTags === tag
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Clauses Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Clause
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredClauses.map((clause) => (
                <tr
                  key={clause.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {clause.name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {clause.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {clause.lastUpdated}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClausesLibrary;
