import React, { useEffect, useState } from "react";
import { useGet } from "../hooks/useGet";

const PayinDoc = () => {
  const [activeSection, setActiveSection] = useState("payin-request");
  const [apiSections, setApiSections] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

  // Replace ${id} with actual logic if available, otherwise using a placeholder
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
      errorExamples: [
        { code: "400", message: "Missing required fields", cause: "Required fields not included" },
        { code: "403", message: "Account deactivated", cause: "Payin deactivated by Admin" },
      ],
    },
  ];

  useEffect(() => {
    if (payinGateway === "Glide") {
      setApiSections(GLIDE_SECTIONS);
      setActiveSection("glide-payin-request");
    } else {
        // Fallback or loading state
        setApiSections(GLIDE_SECTIONS);
    }
  }, [payinGateway]);

  const activeApi = apiSections.find((s) => s.id === activeSection);

  const renderContent = () => {
    if (!activeApi) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03c5fc]"></div>
        </div>
    );

    switch (activeApi.type) {
      case "api":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Endpoint Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#03c5fc] blur-[80px] opacity-10" />
               <h2 className="text-[#03c5fc] text-xl font-bold mb-4">{activeApi.title}</h2>
               <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Endpoint</p>
                    <code className="block p-3 bg-black/40 border border-white/5 rounded-xl text-white break-all text-sm font-mono">
                        {activeApi.endpoint}
                    </code>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Headers</p>
                    <code className="block p-3 bg-black/40 border border-white/5 rounded-xl text-white text-sm font-mono">
                        {activeApi.headers}
                    </code>
                  </div>
               </div>
            </div>

            {/* Parameters Table */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6">
              <h3 className="text-[#03c5fc] font-semibold mb-4">Request Body Parameters</h3>
              <div className="overflow-x-auto -mx-6 sm:mx-0">
                <table className="min-w-full text-left text-sm text-white">
                    <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                        <th className="px-4 py-3 font-bold text-slate-300">Field</th>
                        <th className="px-4 py-3 font-bold text-slate-300">Type</th>
                        <th className="px-4 py-3 font-bold text-slate-300">Req.</th>
                        <th className="px-4 py-3 font-bold text-slate-300">Description</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {activeApi.parameters.map((param, index) => (
                        <tr key={index} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-mono text-[#03c5fc]">{param.field}</td>
                        <td className="px-4 py-3 text-slate-400">{param.type}</td>
                        <td className={`px-4 py-3 font-bold ${param.required === "Yes" ? "text-red-400" : "text-gray-500"}`}>
                            {param.required}
                        </td>
                        <td className="px-4 py-3 text-slate-300 min-w-[200px]">{param.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
            </div>

            {/* Code Examples */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-[#03c5fc] font-semibold mb-3">Sample Request</h3>
                    <pre className="bg-black/60 p-4 rounded-xl text-xs text-slate-300 overflow-x-auto font-mono border border-white/5">
                        {activeApi.request.curl}
                    </pre>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-green-400 font-semibold mb-3">Success Response</h3>
                    <pre className="bg-black/60 p-4 rounded-xl text-xs text-slate-300 overflow-x-auto font-mono border border-white/5">
                        {activeApi.successResponse.curl}
                    </pre>
                </div>
            </div>
          </div>
        );
      default:
        return <p className="text-white">Content loading...</p>;
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white p-4 md:p-8 overflow-x-hidden">
      {/* 🟦 THEME GLOWS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1a3299] blur-[150px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#03c5fc] blur-[150px] opacity-10 pointer-events-none" />

      {/* Mobile Header Toggle */}
      <div className="md:hidden flex items-center justify-between mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
        <h2 className="text-[#03c5fc] font-bold">API Docs</h2>
        <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white/10 rounded-lg"
        >
            <i className={`fa-solid ${isSidebarOpen ? 'fa-xmark' : 'fa-bars'}`} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative z-10 max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className={`
            ${isSidebarOpen ? 'block' : 'hidden'} 
            md:block md:w-80 w-full shrink-0 space-y-4 
            sticky top-8 self-start
        `}>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-[#03c5fc] text-lg font-bold mb-6 hidden md:block">Documentation</h2>
            <nav className="flex flex-col gap-2">
              {apiSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-300 ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-[#1a3299] to-[#03c5fc] text-white shadow-[0_0_20px_rgba(3,197,252,0.3)]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default PayinDoc;