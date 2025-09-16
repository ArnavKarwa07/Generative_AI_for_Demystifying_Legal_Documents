import React, { useState } from "react";
import { useParams } from "react-router-dom";

const NegotiationWorkspace = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("redline");
  const [message, setMessage] = useState("");

  const changes = [];

  const playbookItems = [];

  const chatMessages = [];

  const suggestedScripts = [
    "We typically use a 2-year term for NDAs.",
    "Can we discuss the rationale for the 3-year term?",
    "We are open to a 3-year term if it aligns with the project timeline.",
  ];

  const tabs = [
    { id: "redline", label: "Redline" },
    { id: "comments", label: "Comments" },
    { id: "playbook", label: "Negotiation Playbook" },
  ];

  return (
    <div
      className="bg-[#111418] min-h-screen text-white"
      style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
    >
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#283039] bg-[#111418]/80 px-10 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-4 text-white">
            <div className="size-6 text-[var(--primary-color)]">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              ClauseCraft
            </h2>
          </div>

          <nav className="hidden items-center gap-9 md:flex">
            <a
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              href="/"
            >
              Home
            </a>
            <a
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              href="/documents"
            >
              Documents
            </a>
            <a
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              href="#"
            >
              Playbooks
            </a>
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

          <div className="flex items-center justify-end gap-4">
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#283039] text-white/80 transition-colors hover:bg-[#3b4754] hover:text-white">
              <span className="material-symbols-outlined text-xl">
                notifications
              </span>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC1Y_8XVdcCmNLp6iq9HYhEYJ9DGLhz6XJWYhMSRRoQYas35lBnxbxTJBDNi8qaYVXbr2ljabUBQuUDeuwVwsFCCmKj1r6iPV0y1dw1YOTYwkBkQN3lHM5axL0y3244lk0hM8lfzR28tufa33V_thGWtjUb1hTgarbuEKFH6xbfnZhzsurUeM1ksb3d8ldHg1ltPhPtSQFTV3f_e9uYiFmM5IlxJNt9CaAKv8Bfih-CuOHMOuOi-SKc4Hy9-vP9G4C8_C708k9yiW8")',
              }}
            ></div>
          </div>
        </header>

        <div className="flex flex-1 flex-col px-6 py-5 md:flex-row md:gap-6">
          {/* Main Content */}
          <main className="flex-1">
            {/* Breadcrumb */}
            <div className="mb-4 flex items-center gap-2 text-sm font-medium">
              <a className="text-gray-400 hover:text-white" href="/documents">
                Documents
              </a>
              <span className="text-gray-400">/</span>
              <a className="text-gray-400 hover:text-white" href="#">
                NDA with Acme Corp
              </a>
              <span className="text-gray-400">/</span>
              <span className="text-white">Redline</span>
            </div>

            <h1 className="text-3xl font-bold text-white">
              NDA with Acme Corp
            </h1>

            {/* Tabs */}
            <div className="mt-6 border-b border-[#3b4754]">
              <div className="flex gap-8 px-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-4 ${
                      activeTab === tab.id
                        ? "border-b-[var(--primary-color)] text-white"
                        : "border-b-transparent text-gray-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <p className="text-sm font-bold">{tab.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <p className="px-4 py-6 text-base text-white/80">
              This redline view shows the changes made to the document. You can
              review and accept or reject changes individually or in bulk.
            </p>

            {/* Changes Table */}
            <div className="overflow-x-auto rounded-lg border border-[#3b4754]">
              <table className="min-w-full divide-y divide-[#3b4754]">
                <thead className="bg-[#1c2127]">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                      scope="col"
                    >
                      Change
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                      scope="col"
                    >
                      Description
                    </th>
                    <th className="relative px-6 py-3" scope="col">
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b4754] bg-[#111418]">
                  {changes.map((change) => (
                    <tr key={change.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                        {change.type}: {change.item}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                        {change.description}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <a
                          className="text-[var(--primary-color)] hover:text-blue-500"
                          href="#"
                        >
                          Review
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="flex w-full flex-col gap-6 md:w-96">
            {/* Negotiation Playbook */}
            <div className="rounded-lg border border-[#283039] bg-[#1c2127] p-4">
              <h2 className="text-xl font-bold text-white">
                Negotiation Playbook
              </h2>
              <p className="mt-2 text-sm text-white/60">
                This playbook provides guidance on negotiating this type of
                agreement. Follow the recommended strategies to achieve your
                desired outcome.
              </p>
              <div className="mt-4 space-y-3">
                {playbookItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-md bg-[#283039] p-3"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#3b4754] text-white">
                      <span className="material-symbols-outlined">
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-gray-400">{item.priority}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="flex flex-col rounded-lg border border-[#283039] bg-[#1c2127]">
              <div className="border-b border-[#283039] p-4">
                <h2 className="text-xl font-bold text-white">Chat</h2>
              </div>
              <div className="flex-1 space-y-4 p-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      msg.isUser ? "justify-end" : ""
                    }`}
                  >
                    {!msg.isUser && (
                      <img
                        alt={msg.sender}
                        className="h-8 w-8 rounded-full"
                        src={msg.avatar}
                      />
                    )}
                    <div
                      className={`flex flex-col ${
                        msg.isUser ? "items-end" : "items-start"
                      }`}
                    >
                      <p className="text-xs text-gray-400">{msg.sender}</p>
                      <div
                        className={`mt-1 rounded-lg px-3 py-2 text-white ${
                          msg.isUser
                            ? "rounded-tr-none bg-[var(--primary-color)]"
                            : "rounded-tl-none bg-[#283039]"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                    {msg.isUser && (
                      <img
                        alt="Your avatar"
                        className="h-8 w-8 rounded-full"
                        src={msg.avatar}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex items-center gap-2 border-t border-[#283039] p-4">
                <img
                  alt="AI assistant"
                  className="h-8 w-8 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcu4WNqFVdVnerqTZfL0T82PxvSjgddGWhVy_3ppBP6HT_8AIgv8gSGxJk0ebhvNr2R4tgDptFThFQfcZ4emQ2NIyShAZwcQymNj0l1v845ppnal-CdM9CRKRAEtltUB4b2DpxEaMg1hlp13vl3R5YEYzxsgi0hlk902CQRD1blRl_8S7vGsM-16oD-fFKu1agouYsNiB6CshOE0mqYqIcKO50G_Lq4MZb6q0O-4v9ZCdDGKR3wmjE_pwGA8XGkhnFyiCJz58VLNs"
                />
                <div className="relative flex-1">
                  <input
                    className="w-full rounded-md border-0 bg-[#283039] py-2 pl-3 pr-20 text-sm text-white placeholder:text-gray-400 focus:ring-1 focus:ring-[var(--primary-color)]"
                    placeholder="Type your message..."
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button className="text-white/60 hover:text-white">
                      <span className="material-symbols-outlined text-lg">
                        attach_file
                      </span>
                    </button>
                    <button className="ml-2 rounded-md bg-[var(--primary-color)] px-3 py-1 text-sm font-semibold text-white hover:bg-blue-500">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Scripts */}
            <div className="rounded-lg border border-[#283039] bg-[#1c2127] p-4">
              <h2 className="text-xl font-bold text-white">
                Suggested Scripts
              </h2>
              <p className="mt-2 text-sm text-white/60">
                Choose a script to quickly respond to common negotiation points.
              </p>
              <div className="mt-4 space-y-2">
                {suggestedScripts.map((script, index) => (
                  <button
                    key={index}
                    className="flex w-full items-center gap-3 rounded-md bg-[#283039] p-3 text-left transition-colors hover:bg-[#3b4754]"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#3b4754] text-white">
                      <span className="material-symbols-outlined text-base">
                        content_copy
                      </span>
                    </div>
                    <p className="flex-1 text-sm text-white">{script}</p>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NegotiationWorkspace;
