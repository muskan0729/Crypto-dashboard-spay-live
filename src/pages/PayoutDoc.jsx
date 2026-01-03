import React, { useEffect, useState } from "react";
import { useGet } from "../hooks/useGet";

const PayoutDoc = () => {
  const [activeSection, setActiveSection] = useState("payout-request");
  const [apiSections, setApiSections] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: getmerchant } = useGet("/show-merchant/current");
  const [payoutGateway, setpayoutGateway] = useState(null);

  useEffect(() => {
    if (getmerchant?.data) {
      setpayoutGateway(getmerchant.data.payout_at_onboard);
    }
  }, [getmerchant]);

  const GLIDE_SECTIONS = [
    {
      id: "glide-payout-request",
      title: "Create payout Payment Request",
      type: "api",
      endpoint: "POST https://dashboard.spaykrypto.com/api/GLIDE/create-glide-payout-widget",
      headers: "Content-Type: application/json",
      parameters: [
        {
          field: "token",
          type: "String",
          required: "Yes",
          description: "API key/token provided by Spay",
        },
        {
          field: "orderid",
          type: "String",
          required: "Yes",
          description: "Unique order ID (merchant side) Max 20 Chars",
        },
        {
          field: "amount",
          type: "String",
          required: "Yes",
          description: "Transaction amount in INR",
        },
        {
          field: "buyer_email",
          type: "String",
          required: "Yes",
          description: "Customer's email address",
        },
        {
          field: "buyer_phone",
          type: "String",
          required: "Yes",
          description: "Customer's 10-digit mobile number",
        },
        {
          field: "buyer_wallet",
          type: "String",
          required: "Yes",
          description: "0xc3301B3fDBFCB535AF691e0Fc53B13A859cC0057"
        }
      ],
      request: {
        curl: `curl -X POST "http://127.0.0.1:8000/api/GLIDE/create-glide-payout-widget" \
  -H "x-glide-project-id: b2373-a1e1-c5ac0d6efc83" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 88|pRVgQ9J9ZQuNu98izybeb43c6a" \
  -d '{
    "token": "L3szdVgxEHcaQOszSx5J",
    "orderid": "zB2C9z6q3e0jhO",
    "amount": "0.001",
    "buyer_email": "amar@spay.live",
    "buyer_phone": "9967184313",
    "buyer_wallet": "0xc3301B391e0Fc53B13A859cC0057"
  }'`,
      },
      successResponse: {
        curl: `{ "status_code": 200, "status": "success", "data": { "url": "..." } }`,
      },
    },
    // {
    //   id: "glide-payment-status-request",
    //   title: "Check Payment Status",
    //   type: "api",
    //   endpoint: "POST https://live.spay.live/api/GLIDE/create-glide-widget-url",
    //   headers: "Content-Type: application/json",
    //   parameters: [
    //     {
    //       field: "token",
    //       type: "String",
    //       required: "Yes",
    //       description: "API key/token provided by Spay",
    //     },
    //     {
    //       field: "order_id",
    //       type: "String",
    //       required: "Yes",
    //       description: "Unique transaction ID (merchant side) Max 20 Chars",
    //     },
    //     {
    //       field: "amount",
    //       type: "String",
    //       required: "Yes",
    //       description: "Transaction amount in INR",
    //     },
    //     {
    //       field: "buyer_email",
    //       type: "String",
    //       required: "Yes",
    //       description: "Customer's email address",
    //     },
    //     {
    //       field: "buyer_phone",
    //       type: "String",
    //       required: "Yes",
    //       description: "Customer's 10-digit mobile number",
    //     },
    //   ],
    //   request: {
    //     curl: `curl --location 'https://live.spay.live/api/GLIDE/create-glide-widget-url' --form 'token="L3szdVgxEHYqq433GIvwcaQOszSx5J"'`,
    //   },
    //   successResponse: {
    //     curl: `{ "status_code": 200, "status": "success", "data": { "url": "..." } }`,
    //   },
    // },
    {
      id: "glide-callback-response",
      title: "Callback Response",
      type: "api",
      endpoint: "POST https://dashboard.spaykrypto.com/api/GLIDE/webhook/transaction",
      headers: "Content-Type: application/json",
      parameters: [
        
      ],
      request: { },
      successResponse: {
        curl: `{ {"webhookId":"cf6dd72e-6394-455a-b88e-d6fc0d14d9e5","type":"SESSION_UPDATE","payload":{"sessionId":"fa6eaa6b-132d-4816-b56e-29da2e546077","createdAt":"2025-12-30T12:35:35.481837Z","expiresAt":"2025-12-30T12:45:35.481837Z","expired":false,"paymentStatus":"paid","paymentChainId":"eip155:137","paymentChainName":"Polygon","paymentChainLogoUrl":"https://static.paywithglide.xyz/logos/polygon-9146df3f.png","paymentCurrency":"eip155:137/erc20:0x3c499c542cef5e3811e1192ce70d8cc03d5c3359","paymentCurrencySymbol":"USDC","paymentCurrencyLogoUrl":"https://static.buildwithglide.com/logos/usdc-8aaf5df7.png","paymentCurrencyTier":"tier1","paymentAmount":"0.001076","paymentAmountUSD":"0.001076","payerAccount":"0xc3301B3fDBFCB535AF691e0Fc53B13A859cC0057","payerAccounts":["0xc3301B3fDBFCB535AF691e0Fc53B13A859cC0057"],"payerWalletAddress":"0xc3301B3fDBFCB535AF691e0Fc53B13A859cC0057","enableRefundEmails":false,"paymentAction":"signTypedData","paymentTransactionHash":"0xc6e652f48ec62e65a998c971e4bef60c599c14ef7c34c8db5aebdcb85ba85d92","paymentTransactionUrl":"https://polygonscan.com/tx/0xc6e652f48ec62e65a998c971e4bef60c599c14ef7c34c8db5aebdcb85ba85d92","unsignedTypedData":{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Permit":[{"name":"owner","type":"address"},{"name":"spender","type":"address"},{"name":"value","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"deadline","type":"uint256"}]},"primaryType":"Permit","domain":{"name":"USD Coin","version":"2","chainId":"0x89","verifyingContract":"0x3c499c542cef5e3811e1192ce70d8cc03d5c3359","salt":""},"message":{"deadline":"1767098735","nonce":"2","owner":"0xc3301B3fDBFCB535AF691e0Fc53B13A859cC0057","spender":"0x078Bf499222bFcbbFB50EbB191270A9baC93ce44","value":"1076"}},"sponsoredTransactionChainId":"eip155:8453","sponsoredTransactionChainName":"Base","sponsoredTransactionChainLogoUrl":"https://static.paywithglide.xyz/logos/base-b7acabea.png","sponsoredTransactionStatus":"success","sponsoredTransactionHash":"0xe4c49a44dc9c67fb533a231919463d3e40ba9696cb054f80cbc2464984f5979d","sponsoredTransactionUrl":"https://basescan.org/tx/0xe4c49a44dc9c67fb533a231919463d3e40ba9696cb054f80cbc2464984f5979d","sponsoredTransaction":{"to":"0xf706a9b5594a423012245ca46cf6092690418951","value":"0x0","input":"0xa9059cbb00000000000000000000000064b6043c48cce5a8ecb53d25d80fa117a1cf344e0000000000000000000000000000000000000000000000000000000000000000"},"sponsoredTransactionAmount":"0","sponsoredTransactionCurrency":"eip155:8453/erc20:0xf706a9b5594a423012245ca46cf6092690418951","sponsoredTransactionCurrencySymbol":"GTT","sponsoredTransactionCurrencyLogoUrl":"https://static.buildwithglide.com/logos/favicon_color-c2211627.png","sponsoredTransactionAmountUSD":"0","gasRefuelAmount":"0","gasRefuelUSD":"0","gasRefuelTransactionStatus":"","gasRefuelTransactionHash":null,"gasRefuelTransactionUrl":null,"gasCurrencySymbol":"","gasCurrencyLogoUrl":"","gasFeeUSD":"0.0010723536","paymentTransactionGasFeeUSD":"0.00218381349507826428","serviceFeeUSD":"0.000002680884","totalFeeUSD":"0.00325884797907826428","etaInSeconds":10,"metadata":"eNodkctuqzAARH_JhlKJZQmPwI3t4PgB3mFA1wY7QSVtKV9f2t3ozGZ0ZvyulsGWr6VLjA4M7h29aijmzleFlEunWEL5vY-vt3It78ros3Dl9LBCDs8-wJzLTTCGttvZLKSIMnKK31ERNThMApG3kcyUGUJsx7MAkrmrAPmFA3zCYFkHLp7jlCAKRKqyXFFXWerjEIH8fWyWjAiKkTRr7-GqiyGjGaQ9_wprKR56rkOVwahnTo5eEc3waTz2ap6Holn-dVnklK9qnRkhZfnCg-HRz8-JyuWi-QYGZsIB9uDmN8PtCjunllG4j1qaT9K4D-YUJ1wBdsb3tjGS2vizn6vXLp9fbo24lPbLaplPvy6wbHeSGo9TDlWaTK1vIZ7mTTEE8OGm3d-OPBi0v0U4RQFm9MjGkKLecVFClP7fccAjcvC_zh_M_vqmRn0f39gq_gF3-I8E","allowArbitraryDeposit":false,"actualPaymentChainId":"eip155:137","actualPaymentChainName":"Polygon","actualPaymentChainLogoUrl":"https://static.paywithglide.xyz/logos/polygon-9146df3f.png","actualPaymentCurrency":"eip155:137/erc20:0x3c499c542cef5e3811e1192ce70d8cc03d5c3359","actualPaymentCurrencySymbol":"USDC","actualPaymentCurrencyLogoUrl":"https://static.buildwithglide.com/logos/usdc-8aaf5df7.png","actualPaymentCurrencyTier":"tier1","actualPaymentAmount":"0.001076","actualPaymentAmountUSD":"0.0010750344840000000328","widgetConfig":{"appMetadata":{"id":"spay.live","name":"Spay","logoUrl":"https://spay.live/public/images/Spay TM Logo (Black).webp","faviconUrl":"https://spay.live/public/images/Spay TM Logo (Black).webp"},"theme":{"colorScheme":"normal","fontSrcCss":"","fontFamily":"","modalBorderWidth":"1px","modalBorderRadius":"16px","buttonPrimaryForeground":"#ffffff","buttonPrimaryBackground":"#262626","buttonPrimaryBorderColor":"transparent","buttonPrimaryBorderWidth":"0px","buttonPrimaryBorderRadius":"8px","buttonPrimaryPadding":"8px","buttonSecondaryBackground":"#f5f5f5","buttonSecondaryBorderColor":"transparent","buttonSecondaryBorderWidth":"0px","buttonSecondaryBorderRadius":"6px","buttonSecondaryPadding":"8px","alertBackground":"#f5f5f5","alertBorderWidth":"0px","colorModalBackdrop":"#f5f5f5","colorModalBackground":"#ffffff","colorModalBackgroundLinearGradient":"","colorModalBorder":"#f5f5f5","colorTextPrimary":"#171717","colorTextSecondary":"#a3a3a3","colorBackgroundSecondary":"#f5f5f5","colorAlertBackground":"#f5f5f5","colorAlertAccent":"#171717","colorAlertWarningBackground":"#ffedd5","colorAlertWarningAccent":"#f97316","colorAlertBorder":"transparent","appLogoHeight":"32px"}}},"entityId":"fa6eaa6b-132d-4816-b56e-29da2e546077"} }`,
      },
    },
  ];

  useEffect(() => {
    if (payoutGateway === "Glide") {
      setApiSections(GLIDE_SECTIONS);
      setActiveSection("glide-payout-request");
    } else {
      setApiSections(GLIDE_SECTIONS);
    }
  }, [payoutGateway]);

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
          <h2 className="text-[#ffd700] text-xl font-bold mb-4">
            {activeApi.title}
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-white/60 text-xs font-bold uppercase mb-1">
                Endpoint
              </p>
              <code className="block p-4 bg-black/60 border border-white/10 rounded-xl text-sm text-white font-mono break-all">
                {activeApi.endpoint}
              </code>
            </div>

            <div>
              <p className="text-white/60 text-xs font-bold uppercase mb-1">
                Headers
              </p>
              <code className="block p-4 bg-black/60 border border-white/10 rounded-xl text-sm text-white font-mono">
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
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-white/60">Field</th>
                  <th className="px-4 py-3 text-left text-white/60">Type</th>
                  <th className="px-4 py-3 text-left text-white/60">Req.</th>
                  <th className="px-4 py-3 text-left text-white/60">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeApi.parameters.map((param, i) => (
                  <tr key={i} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3 font-mono text-[#ffd700]">
                      {param.field}
                    </td>
                    <td className="px-4 py-3 text-white/70">{param.type}</td>
                    <td
                      className={`px-4 py-3 font-bold ${
                        param.required === "Yes"
                          ? "text-red-400"
                          : "text-white/40"
                      }`}
                    >
                      {param.required}
                    </td>
                    <td className="px-4 py-3 text-white/70">
                      {param.description}
                    </td>
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
            <pre className="bg-black/70 p-4 rounded-xl text-xs text-white/80 font-mono overflow-x-auto border border-white/10">
              {activeApi.request.curl}
            </pre>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-green-400 font-semibold mb-3">
              Success Response
            </h3>
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
        <aside
          className={`${isSidebarOpen ? "block" : "hidden"} md:block md:w-80`}
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl sticky top-8">
            <h2 className="hidden md:block text-[#ffd700] text-lg font-bold mb-6">
              Documentation
            </h2>

            <nav className="space-y-2">
              {apiSections.map((section, index) => {  
                // Create a unique key by combining id and index
                const key = `${section.id}-${index}`;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveSection(section.id);
                      setIsSidebarOpen(false);
                      console.log("htfh");
                      
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition ${
                      activeSection === section.id
                        ? "bg-gradient-to-r from-red-500/40 via-orange-400/40 to-yellow-400/40 text-white shadow-lg"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {section.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">{renderContent()}</main>
      </div>
    </div>
  );
};

export default PayoutDoc;
