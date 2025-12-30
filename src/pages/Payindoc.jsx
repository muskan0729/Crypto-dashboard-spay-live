import React, { useEffect, useState } from "react";
import { useGet } from "../hooks/useGet";

const PayinDoc = () => {
  const [activeSection, setActiveSection] = useState("payin-request");
  const [apiSections, setApiSections] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: getmerchant } = useGet("/show-merchant/current");
  const [payinGateway, setpayinGateway] = useState(null);

  useEffect(() => {
    if (getmerchant?.data) {
      setpayinGateway(getmerchant.data.payin_at_onboard);
    }
  }, [getmerchant]);

  const GLIDE_SECTIONS = [
    {
      id: "glide-payin-request",
      title: "Create Payin Payment Request",
      type: "api",
      endpoint: "POST https://live.spay.live/api/GLIDE/create-glide-widget-url",
      headers: "Content-Type: application/json",
      parameters: [
        { field: "token", type: "String", required: "Yes", description: "API key/token provided by Spay" },
        { field: "order_id", type: "String", required: "Yes", description: "Unique transaction ID (merchant side) Max 20 Chars" },
        { field: "amount", type: "String", required: "Yes", description: "Transaction amount in INR" },
        { field: "buyer_email", type: "String", required: "Yes", description: "Customer's email address" },
        { field: "buyer_phone", type: "String", required: "Yes", description: "Customer's 10-digit mobile number" },
      ],
      request: { curl: `curl --location 'https://live.spay.live/api/GLIDE/create-glide-widget-url' --form 'token="L3szdVgxEHYqq433GIvwcaQOszSx5J"'` },
      successResponse: { curl: `{ "status_code": 200, "status": "success", "data": { "url": "..." } }` },
    },
  ];

  useEffect(() => {
    if (payinGateway === "Glide") {
      setApiSections(GLIDE_SECTIONS);
      setActiveSection("glide-payin-request");
    } else {
      setApiSections(GLIDE_SECTIONS);
    }
  }, [payinGateway]);

  const activeApi = apiSections.find((s) => s.id === activeSection);

  const renderContent = () => {
    if (!activeApi) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffd700]" />
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Endpoint */}
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-red-500/20 via-orange-400/20 to-yellow-400/20 blur-[100px]" />
          <h2 className="text-[#ffd700] text-xl font-bold mb-4">{activeApi.title}</h2>

          <div className="space-y-4">
            <div>
              <p className="text-white/60 text-xs font-bold uppercase mb-1">Endpoint</p>
              <code className="block p-4 bg-black/60 border border-white/10 rounded-xl text-sm text-white font-mono break-all">
                {activeApi.endpoint}
              </code>
            </div>

            <div>
              <p className="text-white/60 text-xs font-bold uppercase mb-1">Headers</p>
              <code className="block p-4 bg-black/60 border border-white/10 rounded-xl text-sm text-white font-mono">
                {activeApi.headers}
              </code>
            </div>
          </div>
        </div>

        {/* Parameters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6">
          <h3 className="text-[#ffd700] font-semibold mb-4">Request Body Parameters</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-white/60">Field</th>
                  <th className="px-4 py-3 text-left text-white/60">Type</th>
                  <th className="px-4 py-3 text-left text-white/60">Req.</th>
                  <th className="px-4 py-3 text-left text-white/60">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeApi.parameters.map((param, i) => (
                  <tr key={i} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3 font-mono text-[#ffd700]">{param.field}</td>
                    <td className="px-4 py-3 text-white/70">{param.type}</td>
                    <td className={`px-4 py-3 font-bold ${param.required === "Yes" ? "text-red-400" : "text-white/40"}`}>
                      {param.required}
                    </td>
                    <td className="px-4 py-3 text-white/70">{param.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Code Samples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-[#ffd700] font-semibold mb-3">Sample Request</h3>
            <pre className="bg-black/70 p-4 rounded-xl text-xs text-white/80 font-mono overflow-x-auto border border-white/10">
              {activeApi.request.curl}
            </pre>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-green-400 font-semibold mb-3">Success Response</h3>
            <pre className="bg-black/70 p-4 rounded-xl text-xs text-white/80 font-mono overflow-x-auto border border-white/10">
              {activeApi.successResponse.curl}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-black text-white p-4 md:p-8 overflow-x-hidden">
      {/* Global Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-500/20 blur-[200px]" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-500/20 blur-[200px]" />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
        <h2 className="text-[#ffd700] font-bold">API Docs</h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white/10"
        >
          <i className={`fa-solid ${isSidebarOpen ? "fa-xmark" : "fa-bars"}`} />
        </button>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? "block" : "hidden"} md:block md:w-80`}>
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

        {/* Main */}
        <main className="flex-1 min-w-0">{renderContent()}</main>
      </div>
    </div>
  );
};

export default PayinDoc;
