import { useEffect, useMemo, useState, useRef } from "react";
import { DonutChart } from "../components/DonutChart";
import { LineChart } from "../components/LineChart";
import Table from "../components/Table";
import useAutoFetch from "../hooks/useAutoFetch";
import { MONTH_NAMES } from "../constants/Constants";
import DashboardSkeleton from "../components/DashboardSkeleton";
import "../css/dashboard.css";
import ApexCharts from "apexcharts";
import TransactionStatusPie from "../components/TransactionStatusPie";
import TransactionLineChart from "../components/TransactionLineChart";
import TransactionTable from "../components/TransactionTable";
// import largesttxn from "../images/largesttxn.jpg";

export const Dashboard = () => {
  // Get role from localStorage
  const [role] = useState(atob(localStorage.getItem("role")) || "admin");

  const [transactionData, setTransactionData] = useState([]);
  const [largeTransactionData, setLargeTransactionData] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch data
  const { data: cardData, loading: recordLoading } = useAutoFetch("/collection-record");
  const { data: tableData } = useAutoFetch("/reportrecords-List?status=success");
  const { data: cryptotableData } = useAutoFetch("/crypto-reportrecords-list?status=success");

  const initialDataOfTransactions = tableData?.data;
  const cryptoinitialDataOfTransactions = cryptotableData?.data;

  // console.log("Table Data:", tableData);
  // console.log("Crypto Table Data:", cryptotableData);

  // Process table data
  const processTableData = useMemo(() => {
    if (!initialDataOfTransactions) return [];
    return [...initialDataOfTransactions].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [initialDataOfTransactions]);

  const cryptoprocessTableData = useMemo(() => {
    if (!cryptoinitialDataOfTransactions) return [];
    return [...cryptoinitialDataOfTransactions].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [cryptoinitialDataOfTransactions]);

  // Process top 4 largest transactions
  const processLargeTransactionData = useMemo(() => {
    if (!initialDataOfTransactions) return [];
    return [...initialDataOfTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [initialDataOfTransactions]);

  const cryptoprocessLargeTransactionData = useMemo(() => {
    if (!cryptoinitialDataOfTransactions) return [];
    return [...cryptoinitialDataOfTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [cryptoinitialDataOfTransactions]);

  // Format transaction & large transaction data
  useEffect(() => {
    const tableSource =
      role === "crypto" ? cryptoprocessTableData : processTableData;

    const largeSource =
      role === "crypto" ? cryptoprocessLargeTransactionData : processLargeTransactionData;

    // Format table data
    const formattedTableData = tableSource.map((item, index) => {
      const date = new Date(item.created_at);
      const formattedDate = `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
      const formattedTime = date.toLocaleTimeString();

      return {
        sqno: index + 1,
        txnid: item.txnid,
        name: item.user.name,
        type: item.product,
        amount: item.amount,
        status: (
          <span className="px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        ),
        time: (
          <div className="flex flex-col">
            <span className="text-sm font-medium">{formattedDate}</span>
            <span className="text-sm text-gray-500">{formattedTime}</span>
          </div>
        ),
      };
    });
    setTransactionData(formattedTableData);

    // Format large transactions
    const formattedLargeTransactionData = largeSource.map((item) => ({
      name: item.user.name,
      amount: item.amount,
    }));

    setLargeTransactionData(formattedLargeTransactionData);
  }, [
    role,
    processTableData,
    processLargeTransactionData,
    cryptoprocessTableData,
    cryptoprocessLargeTransactionData,
  ]);

  // Table columns
  const transactioncolumn = [
    { header: "SQ No.", accessor: "sqno" },
    { header: "TXN Id", accessor: "txnid" },
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "status" },
    { header: "Date/Time", accessor: "time" },
  ];

  useEffect(() => {
    if (!recordLoading && cardData) setInitialLoad(false);
    console.log(cardData);
  }, [recordLoading, cardData]);




const chartRef1 = useRef(null);
const chartRef2 = useRef(null);

useEffect(() => {
  if (initialLoad) return;

  const options1 = {
    chart: {
      type: "area",
      height: 80,
      sparkline: { enabled: true },
      toolbar: { show: false },
      background: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#D4AF37"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.5,
        opacityFrom: 0.35,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    series: [
      {
        name: "Collection",
        data: [15, 35, 20, 45, 30, 55, 25],
      },
    ],
    tooltip: { theme: "dark", x: { show: false } },
  };

  const options2 = {
    chart: {
      type: "area",
      height: 80,
      sparkline: { enabled: true },
      toolbar: { show: false },
      background: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#D4AF37"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.5,
        opacityFrom: 0.35,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    series: [
      {
        name: "Collection",
        data: [25, 45, 15, 35, 20, 50, 30],
      },
    ],
    tooltip: { theme: "dark", x: { show: false } },
  };

  const chart1 = chartRef1.current ? new ApexCharts(chartRef1.current, options1) : null;
  const chart2 = chartRef2.current ? new ApexCharts(chartRef2.current, options2) : null;

  chart1?.render();
  chart2?.render();

  // cleanup on unmount
  return () => {
    chart1?.destroy();
    chart2?.destroy();
  };
}, [initialLoad]);

const dates = [
    { x: new Date("2025-01-01").getTime(), y: 1200000 },
    { x: new Date("2025-01-02").getTime(), y: 1400000 },
    { x: new Date("2025-01-03").getTime(), y: 1300000 },
    { x: new Date("2025-01-04").getTime(), y: 1100000 },
    { x: new Date("2025-01-05").getTime(), y: 1000000 },
    { x: new Date("2025-01-06").getTime(), y: 900000 },
    { x: new Date("2025-01-07").getTime(), y: 1500000 },
    { x: new Date("2025-01-08").getTime(), y: 1450000 },
    { x: new Date("2025-01-09").getTime(), y: 1350000 },
  ];


  const transactions = [
    { sq: 1, txn: 'Sxxxxxxx10155530365558521', name: 'abc technology pvt ltd', type: 'topup_payout', amount: 1000, status: 'Success', datetime: '10 Dec 2025, 15:55:30' },
    { sq: 1, txn: 'Sxxxxxxx10155530365558522', name: 'abc technology pvt ltd', type: 'topup_payout', amount: 1000, status: 'Success', datetime: '10 Dec 2025, 15:55:30' },
    { sq: 1, txn: 'Sxxxxxxx10155530365558523', name: 'abc technology pvt ltd', type: 'topup_payout', amount: 1000, status: 'Success', datetime: '10 Dec 2025, 15:55:30' },
    { sq: 1, txn: 'Sxxxxxxx10155530365558524', name: 'abc technology pvt ltd', type: 'topup_payout', amount: 1000, status: 'Success', datetime: '10 Dec 2025, 15:55:30' },
    // more transactions
  ];

  // Role-based cards
  const normalCards = [
    { title: "Total Pay-IN Collection", icon: "fa-wallet", value: cardData?.total_payin_amount ?? 0 },
    { title: "Total Pay-OUT", icon: "fa-wallet", value: cardData?.total_payout_amount ?? 0 },
    { title: "Today Pay-IN Collection", icon: "fa-arrow-trend-up", value: cardData?.today_payin ?? 0 },
    { title: "Today Pay-OUT", icon: "fa-arrow-trend-up", value: cardData?.today_payout ?? 0 },
  ];

  const cryptoCard = [
    { title: "Total Crypto-IN Collection", icon: "fa-bitcoin-sign", value: cardData?.total_crypto ?? 0 },
    { title: "Total Crypto-OUT Collection", icon: "fa-bitcoin-sign", value: cardData?.total_crypto_payout ?? 0 },
    { title: "Today Crypto-IN Collection", icon: "fa-bitcoin-sign", value: cardData?.today_crypto ?? 0 },
    { title: "Today Crypto-OUT Collection", icon: "fa-bitcoin-sign", value: cardData?.today_crypto_payout ?? 0 },
  ];

  let cardsToShow = [];
  if (role === "admin") cardsToShow = [...normalCards];
  else if (role === "crypto") cardsToShow = [...cryptoCard];
  else cardsToShow = [...normalCards]; // normal users
console.log(cardData?.transactionStatusCounts);
  return (
    <>
      {initialLoad ? (
        <DashboardSkeleton />
      ) : (
        <div className="w-full flex justify-center py-8">
          <div className="w-full max-w-[1140px] px-4 lg:px-6">
            
            {/* -------- TOP CARDS + DONUT/LINE CHART -------- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

              {/* Cards */}
              

              {/* Charts */}
            {(role === "admin" || role === "user") && (
  <>
    <div className="flex justify-center items-start">
      <div className="w-full max-w-[380px] p-6 rounded-xl backdrop-blur-xl shadow-[0_4px_20px_rgba(255,192,203,0.25)]">
        {/* <DonutChart data={cardData?.transactionStatusCounts} /> */}
        <TransactionStatusPie
          success={200}
          failed={15}
          pending={35}
        />
      </div>
    </div>

    <div className="lg:col-span-2 p-6 rounded-xl backdrop-blur-xl shadow-[0_4px_20px_rgba(144,238,144,0.25)] flex flex-col gap-4">
  {/* Pay-IN Card */}
  <div className="card card-block card-stretch custom-scroll bg-black/80 rounded-xl">
    <div className="card-header d-flex flex-wrap justify-content-between items-center gap-3 px-4 py-3 border-b border-[#433200]">
      <h5 className="text-base sm:text-lg font-semibold text-[#D4AF37]">
        Pay-IN Collection
      </h5>

      <div className="flex gap-2">
        <button className="px-2 py-1 bg-[#02030a] text-[#D4AF37] text-xs rounded border border-[#433200]">
          Total
        </button>
        <button className="px-2 py-1 bg-[#02030a] text-[#D4AF37] text-xs rounded border border-[#433200]">
          Today
        </button>
      </div>
    </div>

    <div className="card-body px-5 py-6 flex justify-between items-start">
      {/* Left column */}
      <div>
        <h6 className="text-2xl font-bold text-[#D4AF37] leading-none">
          ₹ 0.00
        </h6>
        <div className="text-green-500 text-xs font-semibold mt-1">+64%</div>
      </div>

      {/* Chart placeholder with ref */}
      <div ref={chartRef1} className="w-[200px] h-[80px]"></div>
    </div>
  </div>

  {/* Pay-OUT Card */}
  <div className="card card-block card-stretch custom-scroll bg-black/80 rounded-xl">
    <div className="card-header d-flex flex-wrap justify-content-between items-center gap-3 px-4 py-3 border-b border-[#433200]">
      <h5 className="text-base sm:text-lg font-semibold text-[#D4AF37]">
        Pay-OUT Collection
      </h5>

      <div className="flex gap-2">
        <button className="px-2 py-1 bg-[#02030a] text-[#D4AF37] text-xs rounded border border-[#433200]">
          Total
        </button>
        <button className="px-2 py-1 bg-[#02030a] text-[#D4AF37] text-xs rounded border border-[#433200]">
          Today
        </button>
      </div>
    </div>

    <div className="card-body px-5 py-6 flex justify-between items-start">
      {/* Left column */}
      <div>
        <h6 className="text-2xl font-bold text-[#D4AF37] leading-none">
          ₹ 0.00
        </h6>
        <div className="text-green-500 text-xs font-semibold mt-1">+64%</div>
      </div>

      {/* Chart placeholder with ref */}
      <div ref={chartRef2} className="w-[200px] h-[80px]"></div>
    </div>
  </div>
</div>

  </>
)}


              {role === "crypto" && (
                <>
                  <div className="flex justify-center items-start">
                    <div className="w-full max-w-[380px] p-6 rounded-xl backdrop-blur-xl shadow-[0_4px_20px_rgba(255,192,203,0.25)]">
                      {/* <DonutChart data={cardData?.cryptoTransactionStatusCounts} /> */}
                    </div>
                  </div>
                  <div className="lg:col-span-2 p-6 rounded-xl backdrop-blur-xl shadow-[0_4px_20px_rgba(144,238,144,0.25)]">
                    {/* <LineChart data={cardData?.cryptoMonthWiseStatusCounts} className="h-[260px]" /> */}







                  </div>
                </>
              )}

              {/* Large Transactions */}
             
           

            </div>

            {/* -------- TABLE -------- */}
            <div className="mt-8 mb-4">
              <div className="p-4">
                <TransactionLineChart dates={dates} height={350} />
              </div>
              
              {/* <Table
                columns={transactioncolumn}
                data={transactionData}
                showSearch={false}
                showPagination={true}
                showExport={false}
                showStatusFilter={false}
                showDeleteColumn={false}
                showDateFilter={false}
              /> */}
              <TransactionTable transactions={transactions} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
