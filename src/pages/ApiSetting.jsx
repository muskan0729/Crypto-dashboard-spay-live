import React, { useEffect, useState } from "react"; 
import { usePost } from "../hooks/usePost";
import Table from "../components/Table";
import { useGet } from "../hooks/useGet";
import { useToast } from "../contexts/ToastContext";
import { MONTH_NAMES } from "../constants/Constants";

const ApiSetting = () => {
  const [activeTab, setActiveTab] = useState("apiToken");
  const [apiToken, setApiToken] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const Toast = useToast();
  
  const { execute } = usePost("/generate-token");
  const endPoint = activeTab === "apiToken" ? "/get-tokens" : "";
  const { data: apiTokensData, refetch: refetchApiTokens } = useGet(endPoint);
  const initialDataOfTokens = apiTokensData?.data;

  useEffect(() => {
    const formattedMerchantData = initialDataOfTokens?.map((item, index) => ({
      sqno: index + 1,
      id: item.id,
      ip: item.ip,
      token: item.token,
      date:
        new Date(item.created_at).getDate() +
        " " +
        MONTH_NAMES[new Date(item.created_at).getMonth()] +
        " " +
        new Date(item.created_at).getFullYear(),
    }));
    setApiToken(formattedMerchantData || []);
  }, [initialDataOfTokens]);

  const tokenTableColumns = [
    { header: "SQNo", accessor: "sqno" },
    { header: "IP", accessor: "ip" },
    { header: "Token", accessor: "token" },
    { header: "Date", accessor: "date" },
  ];

  const handleGenerateToken = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await execute({});
      if (res.message === "Auth token generated successfully") {
        Toast.success("Token Generated Successfully");
        refetchApiTokens();
      }
    } catch (err) {
      console.error("Error generating token:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
            activeTab === "apiToken"
              ? "border-b-2 border-[#ffd700] text-[#ffd700]"
              : "text-gray-400 hover:text-[#ffd700]"
          }`}
          onClick={() => setActiveTab("apiToken")}
        >
          🔑 API Tokens
        </button>
        
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* ---- API Token Tab ---- */}
        {activeTab === "apiToken" && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 relative overflow-hidden">
            {/* Gradient Glow */}
            <div className="absolute -z-10 w-60 h-60 top-[-2rem] right-[-2rem] bg-gradient-to-tr from-red-500/30 via-orange-400/20 to-yellow-400/20 blur-[120px] rounded-full"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-bold text-[#ffd700]">
                Manage API Tokens
              </h2>

              <button
                onClick={handleGenerateToken}
                disabled={isLoading}
                type="button"
                className={`${
                  isLoading
                    ? "bg-[#ffd700]/50 cursor-not-allowed opacity-80"
                    : "bg-[#ffd700]/30 hover:bg-[#ffd700]/50"
                } text-black font-medium rounded-xl text-sm px-5 py-2.5 transition flex items-center`}
              >
                {isLoading && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 mr-2 text-black animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 
                      100.591 50 100.591C22.3858 100.591 0 
                      78.2051 0 50.5908C0 22.9766 22.3858 
                      0.59082 50 0.59082C77.6142 0.59082 100 
                      22.9766 100 50.5908ZM9.08144 50.5908C9.08144 
                      73.1895 27.4013 91.5094 50 91.5094C72.5987 
                      91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 
                      27.9921 72.5987 9.67226 50 9.67226C27.4013 
                      9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#000"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 
                      97.8624 35.9116 97.0079 33.5539C95.2932 
                      28.8227 92.871 24.3692 89.8167 
                      20.348C85.8452 15.1192 80.8826 10.7238 
                      75.2124 7.41289C69.5422 4.10194 63.2754 
                      1.94025 56.7698 1.05124C51.7666 0.367541 
                      46.6976 0.446843 41.7345 1.27873C39.2613 
                      1.69328 37.813 4.19778 38.4501 
                      6.62326C39.0873 9.04874 41.5694 10.4717 
                      44.0505 10.1071C47.8511 9.54855 51.7191 
                      9.52689 55.5402 10.0491C60.8642 10.7766 
                      65.9928 12.5457 70.6331 15.2552C75.2735 
                      17.9648 79.3347 21.5619 82.5849 
                      25.841C84.9175 28.9121 86.7997 32.2913 
                      88.1811 35.8758C89.083 38.2158 91.5421 
                      39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                {isLoading ? "Generating..." : "Generate New Token"}
              </button>
            </div>

            <Table
              columns={tokenTableColumns}
              data={apiToken}
              endPoint="/delete-token"
              refreshTable={refetchApiTokens}
              showStatusFilter={false}
              showExport={false}
              setData={setApiToken}
              showDateFilter={false}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden"
              rowClassName={(rowIndex) =>
                rowIndex % 2 === 0
                  ? "bg-white/10 hover:bg-white/20 transition"
                  : "bg-white/5 hover:bg-white/20 transition"
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiSetting;
