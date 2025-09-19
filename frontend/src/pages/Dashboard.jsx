import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: "Total Documents",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Active Contracts",
      value: "89",
      change: "+4%",
      changeType: "positive",
    },
    {
      name: "Pending Reviews",
      value: "23",
      change: "-8%",
      changeType: "negative",
    },
    {
      name: "Compliance Score",
      value: "94%",
      change: "+2%",
      changeType: "positive",
    },
  ];

  const recentDocuments = [
    {
      name: "NDA - Acme Corp",
      status: "Signed",
      date: "2024-01-15",
      type: "NDA",
    },
    {
      name: "Service Agreement - Beta Inc",
      status: "Review",
      date: "2024-01-14",
      type: "Service",
    },
    {
      name: "Employment Contract - Charlie",
      status: "Draft",
      date: "2024-01-13",
      type: "Employment",
    },
  ];

  const pendingApprovals = [
    {
      document: "Partnership Agreement",
      requestedBy: "John Doe",
      date: "2024-01-15",
    },
    {
      document: "Vendor Contract",
      requestedBy: "Jane Smith",
      date: "2024-01-14",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Signed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Draft":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard
            </h1>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-80 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-0 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-lg">
                  search
                </span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                <span className="material-symbols-outlined text-lg">
                  notifications
                </span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* If no user, show sign-in prompt */}
      {!user ? (
        <div className="flex-1">
          <div className="p-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Welcome to ClauseCraft
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Please sign in to access your dashboard and manage your legal
                documents.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <div className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.name}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {stat.name}
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`flex items-center text-sm font-medium ${
                        stat.changeType === "positive"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      <span className="material-symbols-outlined text-base mr-1">
                        {stat.changeType === "positive"
                          ? "trending_up"
                          : "trending_down"}
                      </span>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Documents */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Recent Documents
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Document
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {recentDocuments.map((doc, index) => (
                          <tr
                            key={index}
                            className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                  {doc.name}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  {doc.type}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                                  doc.status
                                )}`}
                              >
                                {doc.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                              {doc.date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Pending Approvals */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Pending Approvals
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {pendingApprovals.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {item.document}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            by {item.requestedBy}
                          </p>
                        </div>
                        <button className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors">
                          Review
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alerts */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Alerts
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-lg mt-0.5">
                        warning
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          Contract Renewal Due
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          Acme Corp contract expires in 15 days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End Right Sidebar */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
