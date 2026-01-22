import { useState, useEffect } from "react";
import Button from "../components/Button";
import Table from "../components/Table";
import { BankModal } from "../components/BankModal";
import { useGet } from "../hooks/useGet";
import Toggle from "../components/Toggle";
import { usePost } from "../hooks/usePost";
import { TOGGLE_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";

const OnboardBank = () => {
  const [activeTab, setActiveTab] = useState("payin");
  const [bankData, setBankData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { data: payinbanks, refetch: payinRefetch, loading: payinLoading } =
    useGet("/payinbanks-List");

  const { data: payoutbanks, refetch: payoutRefetch, loading: payoutLoading } =
    useGet("/payoutbanks-List");

  const { execute: updatePayinToggle } = usePost("/update-payin-bank-status");
  const { execute: updatePayoutToggle } = usePost(
    "/update-payout-bank-status"
  );

  const handleModal = () => setShowModal((prev) => !prev);

  const handleStatusToggle = async (rowId, checked) => {
    try {
      let res;
      if (activeTab === "payin") {
        res = await updatePayinToggle({
          id: rowId,
          onboarded_payin_bank_status: checked,
        });
      } else {
        res = await updatePayoutToggle({
          id: rowId,
          onboarded_payout_bank_status: checked,
        });
      }

      if (res) {
        activeTab === "payin" ? payinRefetch() : payoutRefetch();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (activeTab === "payin") {
      setBankData(
        payinbanks?.data?.map((item, i) => ({
          sqno: i + 1,
          id: item.id,
          bank_name: item.onboard_payin_bank,
          status: item.onboarded_payin_bank_status === 1 ? "Active" : "Inactive",
        })) || []
      );
    } else {
      setBankData(
        payoutbanks?.data?.map((item, i) => ({
          sqno: i + 1,
          id: item.id,
          bank_name: item.onboard_payout_bank,
          status:
            item.onboarded_payout_bank_status === 1 ? "Active" : "Inactive",
        })) || []
      );
    }
  }, [activeTab, payinbanks, payoutbanks]);

  const bankColumn = [
    { header: "SQ No", accessor: "sqno" },
    { header: "Bank Name", accessor: "bank_name" },
    {
      header: "Status",
      accessor: "status",
      Cell: ({ value, row }) => (
        <Toggle
          defaultChecked={value === "Active"}
          onChange={(checked) => handleStatusToggle(row.id, checked)}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#050B14] relative overflow-hidden p-6">
      {/* Cinematic Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-cyan-400/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative space-y-6">
        {/* Header */}
        <div className="relative flex justify-between items-center rounded-2xl px-6 py-4
                        bg-white/5 backdrop-blur-2xl border border-cyan-400/20
                        shadow-[0_0_40px_-10px_rgba(34,211,238,0.3)]">
          <h4 className="text-xl font-semibold tracking-wider text-cyan-300">
            Onboard Bank
          </h4>

          <Button
            onClick={handleModal}
            className="
              px-4 py-2 rounded-xl font-medium tracking-wide
              text-cyan-300 bg-cyan-400/10 border border-cyan-400/30
              shadow-[0_0_12px_rgba(34,211,238,0.35)]
              transition-all duration-300
              hover:bg-cyan-400/20 hover:scale-105
              hover:shadow-[0_0_22px_rgba(34,211,238,0.6)]
              active:scale-95
            "
          >
            ADD BANK
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4">
          {["payin", "payout"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl font-medium tracking-wide transition-all duration-300
                ${
                  activeTab === tab
                    ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-105"
                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                }`}
            >
              {tab === "payin" ? "Payin Bank List" : "Payout Bank List"}
            </Button>
          ))}
        </div>

        {/* Table */}
        <div className="relative rounded-2xl p-6
                        bg-white/5 backdrop-blur-2xl border border-white/10
                        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_-20px_rgba(0,255,255,0.25)]">
          {(activeTab === "payin" && payinLoading) ||
          (activeTab === "payout" && payoutLoading) ? (
            <TableSkeleton />
          ) : (
            <Table
              columns={bankColumn}
              data={bankData}
              className="rounded-xl overflow-hidden border border-cyan-400/10"
              rowClassName={(i) =>
                i % 2 === 0
                  ? "bg-white/10 hover:bg-cyan-400/10 transition"
                  : "bg-white/5 hover:bg-cyan-400/10 transition"
              }
              paginationClassName="flex justify-end gap-2 mt-4"
              previousClassName="px-3 py-1 rounded-lg text-cyan-300 bg-cyan-400/10
                                 border border-cyan-400/20 hover:bg-cyan-400/20
                                 hover:shadow-[0_0_12px_rgba(34,211,238,0.5)]
                                 transition-all"
              nextClassName="px-3 py-1 rounded-lg text-cyan-300 bg-blue-500/10
                             border border-blue-400/20 hover:bg-blue-500/20
                             hover:shadow-[0_0_12px_rgba(59,130,246,0.5)]
                             transition-all"
              showPagination
              showStatusFilter
              showExport={false}
              showSearch
              showDateFilter={false}
              setData={setBankData}
              endPoint={
                activeTab === "payin"
                  ? "/delete-payinbank"
                  : "/delete-payoutbank"
              }
              refreshTable={
                activeTab === "payin" ? payinRefetch : payoutRefetch
              }
              statusList={TOGGLE_STATUSES}
            />
          )}
        </div>
      </div>

      <BankModal
        showModal={showModal}
        handleModal={handleModal}
        activeTab={activeTab}
        refreshTable={activeTab === "payin" ? payinRefetch : payoutRefetch}
      />
    </div>
  );
};

export default OnboardBank;
