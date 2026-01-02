import React, { useEffect, useState } from "react";
import { useGet } from "../hooks/useGet";

const PayoutDoc = () => {
  const [activeSection, setActiveSection] = useState("payout-request");
  const [provider, setProvider] = useState("airpay");
  const [apiSections, setApiSections] = useState([]);

  const { data: getmerchant } = useGet("/show-merchant/${id}");
  const [payoutGateway, setpayoutGateway] = useState(null);

  useEffect(() => {
    if (getmerchant?.data) {
      // setpayoutGateway(getmerchant.data.payout_at_onboard);
      // setpayoutGateway("cashfree");
      setpayoutGateway("busybox")
    }
  }, [getmerchant]);

  const CASHFREE_SECTIONS = [
    { id: 1, title: "Create Payin Payment Request" },
    { id: 2, title: "Check Payment Status" },
    { id: 3, title: "Callback Response" },
  ];
  const BUSYBOX_SECTIONS = [
    { id: 1, title: "Create Payin Payment Request" },
    { id: 2, title: "Check Payment Status" },
    { id: 3, title: "Callback Response" },
  ];

  useEffect(() => {
    if (payoutGateway === "cashfree") {
      setApiSections(CASHFREE_SECTIONS);
      setActiveSection("cashfree-request");
    } else if (payoutGateway === "busybox") {
      setApiSections(BUSYBOX_SECTIONS);
      setActiveSection("busybox-request");
    }
  }, [payoutGateway]);

  // const activeApi = apiSections.find((s) => s.id === activeSection);
  const activeApi = 1;

  const renderContent = () => {
    if (!activeApi) return <p className="text-white/60">Loading...</p>;

    switch (activeApi.type) {
      case "api1":
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-[#ffd700]">
                {activeApi.title}
              </h1>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
                <p className="text-green-400 font-semibold mb-2">ENDPOINT</p>
                <p className="text-white text-sm break-all">
                  {activeApi.endpoint}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
                <p className="text-green-400 font-semibold mb-2">HEADERS</p>
                <p className="text-white text-sm">{activeApi.headers}</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4 overflow-x-auto">
              <h2 className="text-[#ffd700] font-semibold mb-4">
                Request Body Parameters
              </h2>
              <table className="w-full text-sm text-left text-white/80">
                <thead className="text-[#ffd700] border-b border-white/10">
                  <tr>
                    <th className="py-2">Field</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {activeApi.parameters.map((param, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="py-2 font-mono text-yellow-300">
                        {param.field}
                      </td>
                      <td>{param.type}</td>
                      <td>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            param.required === "Yes"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {param.required}
                        </span>
                      </td>
                      <td>{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">
                <h2 className="text-[#ffd700] mb-2">Sample Request (cURL)</h2>
                <pre className="text-xs text-white/80 overflow-x-auto">
                  {activeApi.request.curl}
                </pre>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">
                <h2 className="text-green-400 mb-2">Success Response</h2>
                <pre className="text-xs text-white/80 overflow-x-auto">
                  {activeApi.successResponse.curl}
                </pre>
              </div>

              {activeApi.failedResponse && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">
                  <h2 className="text-red-400 mb-2">Failed Response</h2>
                  <pre className="text-xs text-white/80 overflow-x-auto">
                    {activeApi.failedResponse.curl}
                  </pre>
                </div>
              )}
            </div>
          </div>
        );

      case "callback":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#ffd700]">
              {activeApi.title}
            </h1>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">
              <h3 className="text-[#ffd700] mb-2">Callback Endpoint</h3>
              <code className="text-sm text-white/80 break-all">
                {activeApi.content.endpoint}
              </code>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">
                <h3 className="text-green-400 mb-2">Success Callback</h3>
                <pre className="text-xs text-white/80 overflow-x-auto">
                  {activeApi.content.successResponse}
                </pre>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">
                <h3 className="text-red-400 mb-2">Failed Callback</h3>
                <pre className="text-xs text-white/80 overflow-x-auto">
                  {activeApi.content.failedResponse}
                </pre>
                <p className="text-xs text-red-300 mt-2">
                  Callback failure is sent after timeout if payment remains
                  incomplete.
                </p>
              </div>
            </div>
          </div>
        );

      case "notes":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#ffd700]">
              {activeApi.title}
            </h1>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 space-y-4">
              {activeApi.content.map((note, index) => (
                <div key={index}>
                  <h4 className="text-yellow-300 font-semibold">
                    {note.title}
                  </h4>
                  <p className="text-white/80 text-sm">{note.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-black min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 shadow-xl p-4 hidden md:block">
        <h2 className="text-[#ffd700] font-bold mb-4">API Documentation</h2>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl sticky top-8">
            <h2 className="hidden md:block text-[#ffd700] text-lg font-bold mb-6">
              Documentation
            </h2>

            <nav className="space-y-2">
              {apiSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-red-500/40 via-orange-400/40 to-yellow-400/40 text-white shadow-lg"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 blur-2xl rounded-2xl" />
          <div className="relative">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default PayoutDoc;
