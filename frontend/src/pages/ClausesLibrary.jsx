import React, { useState } from "react";

const ClausesLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("approved");
  const [selectedTags, setSelectedTags] = useState("All");

  const clauses = [];

  const tabs = [
    { id: "all", label: "All" },
    { id: "approved", label: "Approved" },
    { id: "draft", label: "Draft" },
  ];

  const tagFilters = [
    "All",
    "Confidentiality",
    "Indemnification",
    "Termination",
    "Payment",
  ];

  const filteredClauses = clauses.filter(
    (clause) =>
      clause.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedTags === "All" || clause.tags.includes(selectedTags))
  );

  return (
    <div className="bg-[#111418] min-h-screen text-white font-manrope">
      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-[#181C21] p-6">
          <div className="flex flex-col h-full">
            <div className="mb-10">
              <h1 className="text-2xl font-bold text-white">ClauseCraft</h1>
            </div>

            <nav className="flex flex-col gap-4">
              <a
                className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-400 transition-colors hover:bg-[#283039] hover:text-white"
                href="/"
              >
                <span className="material-symbols-outlined">home</span>
                <span className="text-sm font-medium">Home</span>
              </a>
              <a
                className="flex items-center gap-3 rounded-md px-3 py-2 bg-[var(--primary-color)] text-white"
                href="/clauses"
              >
                <span className="material-symbols-outlined">description</span>
                <span className="text-sm font-medium">Clauses</span>
              </a>
              <a
                className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-400 transition-colors hover:bg-[#283039] hover:text-white"
                href="/documents"
              >
                <span className="material-symbols-outlined">folder</span>
                <span className="text-sm font-medium">Documents</span>
              </a>
              <a
                className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-400 transition-colors hover:bg-[#283039] hover:text-white"
                href="#"
              >
                <span className="material-symbols-outlined">science</span>
                <span className="text-sm font-medium">Playground</span>
              </a>
              <a
                className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-400 transition-colors hover:bg-[#283039] hover:text-white"
                href="#"
              >
                <span className="material-symbols-outlined">settings</span>
                <span className="text-sm font-medium">Admin</span>
              </a>
            </nav>

            <div className="mt-auto">
              <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-gray-400 transition-colors hover:bg-[#283039] hover:text-white">
                <span className="material-symbols-outlined">add</span>
                <span className="text-sm font-medium">Invite team</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold tracking-tight">Clauses</h2>
            <button className="flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-opacity-80">
              <span className="material-symbols-outlined">add</span>
              <span>New Clause</span>
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                className="w-full rounded-md border-0 bg-[#283039] py-2 pl-10 pr-4 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)]"
                placeholder="Search clauses..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-[#3b4754]">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`border-b-2 px-1 py-4 text-sm font-medium ${
                    activeTab === tab.id
                      ? "border-[var(--primary-color)] text-[var(--primary-color)]"
                      : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {tagFilters.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTags(tag)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedTags === tag
                    ? "bg-[var(--primary-color)] text-white"
                    : "bg-[#283039] text-white hover:bg-opacity-80"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Clauses Table */}
          <div className="overflow-x-auto rounded-lg border border-[#3b4754]">
            <table className="min-w-full divide-y divide-[#3b4754]">
              <thead className="bg-[#181C21]">
                <tr>
                  <th
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    scope="col"
                  >
                    Clause
                  </th>
                  <th
                    className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    scope="col"
                  >
                    Tags
                  </th>
                  <th
                    className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    scope="col"
                  >
                    Last Updated
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6" scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3b4754] bg-[#111418]">
                {filteredClauses.map((clause) => (
                  <tr key={clause.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                      {clause.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      {clause.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-md bg-[#283039] px-2 py-1 text-xs font-medium text-white mr-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                      {clause.lastUpdated}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a
                        className="text-[var(--primary-color)] hover:text-opacity-80"
                        href="#"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button className="rounded-md bg-[#283039] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-80">
              Export
            </button>
            <button className="rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-80">
              Import
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClausesLibrary;
