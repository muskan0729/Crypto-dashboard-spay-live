import { useEffect, useMemo, useState, useRef } from "react";
import useAutoFetch from "../hooks/useAutoFetch";
import { MONTH_NAMES } from "../constants/Constants";
import DashboardSkeleton from "../components/DashboardSkeleton";
import "../css/dashboard.css";
import ApexCharts from "apexcharts";
import TransactionTable from "../components/TransactionTable";
import { areaOptions1, areaOptions2 } from "../components/chartOptions";
import TransactionsChart from "../components/TransactionAreaChart";
import DashboardSummary from "../components/DashboardSummary";
import { ca } from "date-fns/locale";
// import largesttxn from "../images/largesttxn.jpg";

export const Dashboard = () => {
  // Get role from localStorage
  const [role] = useState(atob(localStorage.getItem("role")) || "admin");

  const [transactionData, setTransactionData] = useState([]);
  const [largeTransactionData, setLargeTransactionData] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [donutChart, setDonutChart] = useState(null);
  const [today, setToday] = useState(false);

  // Fetch data
  const { data: cardData, loading: recordLoading } =
    useAutoFetch("/collection-record");
  const { data: tableData } = useAutoFetch(
    "/reportrecords-List?status=success"
  );
  const { data: cryptotableData } = useAutoFetch(
    "/crypto-reportrecords-list?status=success"
  );
  const [chartDataArea, setchartDataArea] = useState(null);

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
      role === "crypto"
        ? cryptoprocessLargeTransactionData
        : processLargeTransactionData;

    // Format table data
    const formattedTableData = tableSource.map((item, index) => {
      const date = new Date(item.created_at);
      const formattedDate = `${date.getDate()} ${
        MONTH_NAMES[date.getMonth()]
      } ${date.getFullYear()}`;
      const formattedTime = date.toLocaleTimeString();

      return {
        sq: index + 1,
        txn: item.txnid,
        name: item.user.name,
        type: item.product,
        amount: item.amount,
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        datetime: formattedDate + " " + formattedTime,
      };
    });
    setTransactionData(formattedTableData);

    // Format large transactions
    const formattedLargeTransactionData = largeSource.map((item) => ({
      name: item.user.name,
      amount: item.amount,
    }));
    console.log("----------------", formattedLargeTransactionData);
    setLargeTransactionData(formattedLargeTransactionData);
  }, [
    role,
    processTableData,
    processLargeTransactionData,
    cryptoprocessTableData,
    cryptoprocessLargeTransactionData,
  ]);
  
  useEffect(() => {
    if (!recordLoading && cardData) {
      setInitialLoad(false);
    }
    setDonutChart(cardData?.transactionStatusCounts);
    //console.log("------------------",cardData);
  }, [recordLoading, cardData]);

  useEffect(() => {
    if (!cardData) return;

    // Transform API data to chart format
    // Assuming cardData has these fields: total_payin_amount, total_payin_count, etc.
    const transformedData = {
      Total: {
        PayIn: {
          amount: [cardData.total_payin_amount], // you can expand by months if needed
          count: [cardData.total_payin_count],
        },
        PayOut: {
          amount: [cardData.total_payout_amount],
          count: [cardData.total_payout_count],
        },
      },
      Today: {
        PayIn: {
          amount: [cardData.today_payin_amount],
          count: [cardData.today_payin_count],
        },
        PayOut: {
          amount: [cardData.today_payout_amount],
          count: [cardData.today_payout_count],
        },
      },
    };
    setchartDataArea(transformedData);
  }, [cardData]);

  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);

  useEffect(() => {
    if (initialLoad) return;

    const chart1 = chartRef1.current
      ? new ApexCharts(chartRef1.current, areaOptions1)
      : null;
    const chart2 = chartRef2.current
      ? new ApexCharts(chartRef2.current, areaOptions2)
      : null;

    chart1?.render();
    chart2?.render();

    // cleanup on unmount
    return () => {
      chart1?.destroy();
      chart2?.destroy();
    };
  }, [initialLoad]);
  
  const normalCards = {
    totalPayIn: cardData?.total_payin_amount || 0,
    totalPayOut: cardData?.total_payout_amount || 0,
    todayPayIn: cardData?.today_payin || 0,
    todayPayOut: cardData?.today_payout || 0,
  };

  // console.log("normalCards data ====>", normalCards);

  useEffect(() => {
    if (showPassword) {
      console.log();
    }
  }, [showPassword]);

  useEffect(() => {
    console.log(
      "Data for donutChart card data chart Data Area::::->",
      cardData
    );
  }, [cardData]);

  return (
    <>
      {initialLoad ? (
        <DashboardSkeleton />
      ) : (
        <div className="w-full flex justify-center py-8">
          <div className="w-full max-w-[1140px] px-4 lg:px-6">
            {/* -------- TOP CARDS + DONUT/LINE CHART -------- */}
            
            <DashboardSummary
              today={today}
              setToday={setToday}
              showPassword={showPassword}
              role={role}
              donutChart={donutChart}
              normalCards={normalCards}
              chartRef1={chartRef1}
              chartRef2={chartRef2}
            />

            {/* -------- TABLE -------- */}
            <div className="mt-8 mb-4">
              <div className="p-4">
                {/* Add your chart here */}
                {chartDataArea && (
                  <TransactionsChart chartData={chartDataArea} />
                )}
              </div>

              <TransactionTable transactions={transactionData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
