import React, { useState } from "react";
import { useParams } from "react-router-dom";

const NegotiationWorkspace = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { id } = useParams();

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-800 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-white">
              Contract Negotiation Workspace
            </h1>

            <nav className="flex gap-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`text-sm font-medium transition-colors ${
                  activeTab === "overview"
                    ? "text-blue-400"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("changes")}
                className={`text-sm font-medium transition-colors ${
                  activeTab === "changes"
                    ? "text-blue-400"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Changes
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`text-sm font-medium transition-colors ${
                  activeTab === "chat"
                    ? "text-blue-400"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Chat
              </button>
              <a
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                href="#"
              >
                Templates
              </a>
              <a
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                href="#"
              >
                AI Tools
              </a>
              <a
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                href="#"
              >
                Help
              </a>
            </nav>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white/80 transition-colors hover:bg-gray-600 hover:text-white">
              <span className="material-symbols-outlined text-xl">
                notifications
              </span>
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              <span className="text-white font-medium">JD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Scroll */}
      <main className="flex-1">
        <div className="min-h-full">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid h-full grid-cols-12 gap-6 p-6">
              {/* Contract Document */}
              <div className="col-span-8 overflow-hidden rounded-xl border border-white/10 bg-gray-800">
                <div className="border-b border-white/10 p-4">
                  <h2 className="text-lg font-semibold text-white">
                    Contract Document
                  </h2>
                </div>
                <div className="h-[calc(100%-4rem)] overflow-y-auto p-6">
                  <div className="space-y-4 text-sm text-gray-300">
                    <div>
                      <h3 className="mb-2 font-semibold text-white">
                        Service Agreement
                      </h3>
                      <p>
                        This Service Agreement ("Agreement") is entered into on
                        [DATE] by and between [CLIENT NAME], a [STATE]
                        corporation ("Client"), and [SERVICE PROVIDER NAME], a
                        [STATE] corporation ("Service Provider").
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-1 font-medium text-white">
                        1. Scope of Services
                      </h4>
                      <p>
                        Service Provider agrees to provide the following
                        services to Client:
                      </p>
                      <ul className="ml-4 mt-2 space-y-1">
                        <li>• Software development and maintenance</li>
                        <li>• Technical consultation and support</li>
                        <li>• System integration services</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-1 font-medium text-white">
                        2. Payment Terms
                      </h4>
                      <p>
                        Client agrees to pay Service Provider a total fee of
                        $[AMOUNT] for the services described herein. Payment
                        shall be made according to the following schedule:
                      </p>
                      <ul className="ml-4 mt-2 space-y-1">
                        <li>• 50% upon execution of this Agreement</li>
                        <li>• 25% upon completion of milestone 1</li>
                        <li>• 25% upon final delivery and acceptance</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-1 font-medium text-white">
                        3. Term and Termination
                      </h4>
                      <p>
                        This Agreement shall commence on [START DATE] and
                        continue until [END DATE], unless earlier terminated in
                        accordance with the provisions herein.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-span-4 space-y-6">
                {/* Progress Card */}
                <div className="rounded-xl border border-white/10 bg-gray-800">
                  <div className="border-b border-white/10 p-4">
                    <h3 className="font-semibold text-white">
                      Negotiation Progress
                    </h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Overall Progress</span>
                        <span className="text-white">65%</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-gray-700">
                        <div className="h-2 w-[65%] rounded-full bg-blue-500"></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          Sections Reviewed
                        </span>
                        <span className="text-sm text-white">8/12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          Proposed Changes
                        </span>
                        <span className="text-sm text-white">15</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          Accepted Changes
                        </span>
                        <span className="text-sm text-white">9</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          Pending Review
                        </span>
                        <span className="text-sm text-white">3</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Card */}
                <div className="rounded-xl border border-white/10 bg-gray-800">
                  <div className="border-b border-white/10 p-4">
                    <h3 className="font-semibold text-white">
                      Recent Activity
                    </h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-sm text-white">
                          edit
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white">
                          Payment terms updated
                        </p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-sm text-white">
                          check
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white">
                          Scope section approved
                        </p>
                        <p className="text-xs text-gray-400">4 hours ago</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-sm text-white">
                          comment
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white">
                          New comment on liability clause
                        </p>
                        <p className="text-xs text-gray-400">6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Changes Tab */}
          {activeTab === "changes" && (
            <div className="h-full p-6">
              <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-gray-800">
                <div className="border-b border-white/10 p-4">
                  <h2 className="text-lg font-semibold text-white">
                    Change Tracking
                  </h2>
                </div>
                <div className="h-[calc(100%-4rem)] overflow-y-auto">
                  <div className="divide-y divide-white/10">
                    <div className="p-4 hover:bg-white/5">
                      <div className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-sm text-white">
                            edit
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-white">
                              Payment Schedule Modification
                            </h4>
                            <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs">
                              Pending
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mb-3">
                            Changed payment schedule from monthly to
                            milestone-based payments with 50% upfront.
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>Proposed by John Doe</span>
                            <span>2 hours ago</span>
                            <span>Section 2</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 rounded-md bg-green-600 text-white text-xs hover:bg-green-700">
                            Accept
                          </button>
                          <button className="px-3 py-1 rounded-md bg-red-600 text-white text-xs hover:bg-red-700">
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 hover:bg-white/5">
                      <div className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-sm text-white">
                            check
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-white">
                              Liability Cap Addition
                            </h4>
                            <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs">
                              Accepted
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mb-3">
                            Added liability cap of $100,000 for both parties to
                            limit financial exposure.
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>Proposed by Sarah Wilson</span>
                            <span>4 hours ago</span>
                            <span>Section 5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === "chat" && (
            <div className="grid h-full grid-cols-12 gap-6 p-6">
              {/* Team Members */}
              <div className="col-span-4 overflow-hidden rounded-xl border border-white/10 bg-gray-800">
                <div className="border-b border-white/10 p-4">
                  <h3 className="font-semibold text-white">Team Members</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-sm text-white font-medium">
                          JD
                        </span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">John Doe</p>
                      <p className="text-xs text-gray-400">Lead Negotiator</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-sm text-white font-medium">
                          SW
                        </span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Sarah Wilson
                      </p>
                      <p className="text-xs text-gray-400">Legal Counsel</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat */}
              <div className="col-span-8 flex flex-col overflow-hidden rounded-xl border border-white/10 bg-gray-800">
                <div className="border-b border-white/10 p-4">
                  <h3 className="font-semibold text-white">
                    Discussion Thread
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-white font-medium">SW</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">
                          Sarah Wilson
                        </span>
                        <span className="text-xs text-gray-400">2:30 PM</span>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-gray-300">
                          I've reviewed the liability section and I think we
                          need to add a cap. The current unlimited liability is
                          too risky for both parties.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-white font-medium">JD</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">
                          John Doe
                        </span>
                        <span className="text-xs text-gray-400">2:32 PM</span>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-gray-300">
                          I agree. What amount do you suggest for the cap? I was
                          thinking $100K should be reasonable.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="border-t border-white/10 p-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <textarea
                        placeholder="Type your message..."
                        className="w-full resize-none rounded-lg bg-white/5 border border-white/10 p-3 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows="2"
                      ></textarea>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 self-end">
                      <span className="material-symbols-outlined text-lg">
                        send
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NegotiationWorkspace;
