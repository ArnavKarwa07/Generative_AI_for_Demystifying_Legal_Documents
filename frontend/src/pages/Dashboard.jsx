import React from "react";

const Dashboard = () => {
  return (
    <div className="flex-1">
      <header className="flex items-center justify-between border-b border-solid border-gray-700 px-10 py-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              className="form-input w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md bg-gray-800 text-white placeholder:text-gray-400 border-none pl-10 pr-4 py-2 focus:ring-2 focus:ring-[var(--primary-color)]"
              placeholder="Search"
            />
          </div>
          <button className="p-2 rounded-full hover:bg-gray-800">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <div className="p-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="col-span-1 xl:col-span-2">
            {/* Recent Documents */}
            <div className="bg-gray-800 rounded-md p-6">
              <h3 className="text-xl font-bold mb-4">Recent Documents</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-3 px-4 text-sm font-medium text-gray-400">
                        Document
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-400">
                        Status
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-400">
                        Last Updated
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-400">
                        Owner
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* No dummy data - will be populated from API */}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-gray-800 rounded-md p-6 mt-8">
              <h3 className="text-xl font-bold mb-4">Pending Approvals</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-3 px-4 text-sm font-medium text-gray-400">
                        Document
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-400">
                        Requested By
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-400">
                        Date
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-400 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* No dummy data - will be populated from API */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-1 space-y-8">
            {/* Alerts */}
            <div className="bg-gray-800 rounded-md p-6">
              <h3 className="text-xl font-bold mb-4">Alerts</h3>
              {/* No dummy alerts - will be populated from API */}
            </div>

            {/* Playbook Compliance */}
            <div className="bg-gray-800 rounded-md p-6">
              <h3 className="text-xl font-bold mb-4">Playbook Compliance</h3>
              {/* No dummy compliance data - will be populated from API */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
