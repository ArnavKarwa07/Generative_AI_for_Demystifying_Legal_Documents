import React, { useState } from "react";
import { useParams } from "react-router-dom";

const DraftEditor = () => {
  const { id } = useParams();
  const [selectedClause, setSelectedClause] = useState("definitions");
  const [documentContent, setDocumentContent] = useState("");

  const tocItems = [];

  const versionHistory = [];

  const clauseAlternatives = [];

  return (
    <div className="flex h-screen flex-col bg-[#111418] text-white">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#283039] px-6 py-3">
        <div className="flex items-center gap-3">
          <svg
            className="size-6 text-[var(--primary-color)]"
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
              fill="currentColor"
            ></path>
          </svg>
          <h1 className="text-xl font-bold">ClauseCraft</h1>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a className="text-gray-300 hover:text-white" href="/">
            Home
          </a>
          <a className="text-white" href="/documents">
            Documents
          </a>
          <a className="text-gray-300 hover:text-white" href="/clauses">
            Clauses
          </a>
          <a className="text-gray-300 hover:text-white" href="#">
            Templates
          </a>
          <a className="text-gray-300 hover:text-white" href="#">
            Help
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#283039] text-gray-400 hover:bg-[#3b4754] hover:text-white">
            <span className="material-symbols-outlined">notifications</span>
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

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-72 flex-shrink-0 border-r border-solid border-r-[#283039] p-6">
          <div className="flex flex-col gap-6">
            {/* Table of Contents */}
            <div>
              <h3 className="mb-4 text-base font-semibold text-gray-400">
                Table of Contents
              </h3>
              <nav className="flex flex-col gap-2">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedClause(item.id)}
                    className={`rounded-md px-3 py-2 text-sm text-left ${
                      item.active
                        ? "bg-[#283039] font-semibold text-white"
                        : "text-gray-300 hover:bg-[#283039]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Version History */}
            <div>
              <h3 className="mb-4 text-base font-semibold text-gray-400">
                Version History
              </h3>
              <nav className="flex flex-col gap-2">
                {versionHistory.map((version) => (
                  <button
                    key={version.id}
                    className="rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-[#283039] text-left"
                  >
                    {version.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold">Service Agreement</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600">
                  <span className="material-symbols-outlined text-base">
                    spark
                  </span>
                  Simulate
                </button>
                <button className="flex items-center gap-2 rounded-md bg-[#283039] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3b4754]">
                  <span className="material-symbols-outlined text-base">
                    share
                  </span>
                  Share
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="prose prose-invert max-w-none rounded-md border border-[#283039] bg-[#1c2127] p-8 text-gray-300">
              <div className="whitespace-pre-line">{documentContent}</div>

              {/* AI Suggestion Example */}
              <div className="relative rounded-md border-l-4 border-[var(--primary-color)] bg-[#111418] p-4 mt-6">
                <p className="mb-4">
                  <strong>Confidential Information</strong> means any data or
                  information that is proprietary to the Client and not
                  generally known to the public, whether in tangible or
                  intangible form, whenever and however disclosed, including,
                  but not limited to...
                </p>
                <div className="flex items-center gap-2">
                  <button className="rounded-md bg-green-600/20 px-3 py-1 text-xs font-semibold text-green-400 hover:bg-green-600/30">
                    Accept
                  </button>
                  <button className="rounded-md bg-red-600/20 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-600/30">
                    Reject
                  </button>
                  <span className="text-xs text-gray-500">AI Suggestion</span>
                </div>
              </div>
            </div>

            <p className="mt-2 text-right text-xs text-gray-500">
              Last edited 2 hours ago
            </p>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 flex-shrink-0 border-l border-solid border-l-[#283039] p-6">
          <div className="flex flex-col gap-6">
            {/* Clause Explanation */}
            <div>
              <h3 className="mb-3 text-base font-semibold text-gray-400">
                Clause Explanation
              </h3>
              <p className="text-sm text-gray-300">
                This clause outlines the payment terms for the services
                provided. It specifies the payment schedule and amounts due at
                each stage of the project.
              </p>
            </div>

            {/* Alternative Clauses */}
            <div>
              <h3 className="mb-3 text-base font-semibold text-gray-400">
                Alternative Clauses
              </h3>
              <div className="flex flex-col gap-2">
                {clauseAlternatives.map((alternative) => (
                  <button
                    key={alternative.id}
                    className={`rounded-md p-3 text-left text-sm ${
                      alternative.active
                        ? "bg-[#283039] text-gray-300"
                        : "text-gray-300 hover:bg-[#283039]"
                    }`}
                  >
                    {alternative.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clause Provenance */}
            <div>
              <h3 className="mb-3 text-base font-semibold text-gray-400">
                Clause Provenance
              </h3>
              <p className="text-sm text-gray-300">
                This clause is based on industry-standard payment terms for
                consulting agreements. It has been reviewed and approved by
                legal counsel.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DraftEditor;
