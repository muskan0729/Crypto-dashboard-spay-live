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
      request: { curl: `curl --location 'https://live.spay.live/api/GLIDE/create-glide-widget-url' --form 'token="XXXX"'` },
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
        {/* Endpoint Card */}
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#ffd700]/20 blur-[100px]" />
          <h2 className="text-[#ffd700] text-xl font-bold mb-4">
            {activeApi.title}
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                Endpoint
              </p>
              <code className="block p-3 bg-black/60 border border-white/5 rounded-xl text-white text-sm font-mono break-all">
                {activeApi.endpoint}
              </code>
            </div>

            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                Headers
              </p>
              <code className="block p-3 bg-black/60 border border-white/5 rounded-xl text-white text-sm font-mono">
                {activeApi.headers}
              </code>
            </div>
          </div>
        </div>

        {/* Parameters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6">
          <h3 className="text-[#ffd700] font-semibold mb-4">
            Request Body Parameters
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-white">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">Field</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">Req.</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeApi.parameters.map((p, i) => (
                  <tr key={i} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3 font-mono text-[#ffd700]">{p.field}</td>
                    <td className="px-4 py-3 text-slate-400">{p.type}</td>
                    <td className={`px-4 py-3 font-semibold ${p.required === "Yes" ? "text-red-400" : "text-slate-500"}`}>
                      {p.required}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Code Samples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-[#ffd700] font-semibold mb-3">
              Sample Request
            </h3>
            <pre className="bg-black/70 border border-white/5 p-4 rounded-xl text-xs text-slate-300 overflow-x-auto font-mono">
              {activeApi.request.curl}
            </pre>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-green-400 font-semibold mb-3">
              Success Response
            </h3>
            <pre className="bg-black/70 border border-white/5 p-4 rounded-xl text-xs text-slate-300 overflow-x-auto font-mono">
              {activeApi.successResponse.curl}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-black text-white p-4 md:p-8 overflow-hidden">
      {/* Fixed Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff4d4d]/40 via-[#ffb84d]/20 to-[#b33c00] bg-fixed" />

      {/* Ambient Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-[#ff4d4d]/30 to-[#ffb84d]/30 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? "block" : "hidden"} md:block md:w-80`}>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-[#ffd700] font-bold mb-6">
              Documentation
            </h2>

            <nav className="space-y-2">
              {apiSections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all ${
                    activeSection === s.id
                      ? "bg-gradient-to-r from-[#ffb84d] to-[#ffd700] text-black shadow-lg"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default PayinDoc;
