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

  const {
    data: payinbanks,
    refetch: payinRefetch,
    loading: payinLoading,
  } = useGet("/payinbanks-List");

  const {
    data: payoutbanks,
    refetch: payoutRefetch,
    loading: payoutLoading,
  } = useGet("/payoutbanks-List");

  const { execute: updatePayinToggle } = usePost("/update-payin-bank-status");
  const { execute: updatePayoutToggle } = usePost("/update-payout-bank-status");

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
        setBankData((prev) =>
          prev.map((item) =>
            item.id === rowId
              ? { ...item, status: checked ? "Active" : "Inactive" }
              : item
          )
        );
        activeTab === "payin" ? payinRefetch() : payoutRefetch();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Format data based on active tab
  useEffect(() => {
    if (activeTab === "payin") {
      const mapped =
        payinbanks?.data?.map((item, index) => ({
          sqno: index + 1,
          id: item.id,
          bank_name: item.onboard_payin_bank,
          status: item.onboarded_payin_bank_status === 1 ? "Active" : "Inactive",
        })) || [];
      setBankData(mapped);
    } else {
      const mapped =
        payoutbanks?.data?.map((item, index) => ({
          sqno: index + 1,
          id: item.id,
          bank_name: item.onboard_payout_bank,
          status:
            item.onboarded_payout_bank_status === 1 ? "Active" : "Inactive",
        })) || [];
      setBankData(mapped);
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
    <div className="p-6 bg-black  space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex justify-between items-center px-6 py-4">
        <h4 className="font-bold text-[#ffd700] text-2xl">Onboard Bank</h4>
        <Button
          className="bg-white/10 text-[#ffd700] border border-white/20 font-semibold px-4 py-2 rounded-xl shadow-md hover:bg-white/20 transition duration-200"
          onClick={handleModal}
        >
          ADD BANK
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4">
        <Button
          className={`px-5 py-2 rounded-xl font-medium ${
            activeTab === "payin"
              ? "bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-black shadow-lg"
              : "bg-white/5 text-white hover:bg-white/10 transition"
          }`}
          onClick={() => setActiveTab("payin")}
        >
          Payin Bank List
        </Button>
        <Button
          className={`px-5 py-2 rounded-xl font-medium ${
            activeTab === "payout"
              ? "bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-black shadow-lg"
              : "bg-white/5 text-white hover:bg-white/10 transition"
          }`}
          onClick={() => setActiveTab("payout")}
        >
          Payout Bank List
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6">
        {(activeTab === "payin" && payinLoading) ||
        (activeTab === "payout" && payoutLoading) ? (
          <TableSkeleton />
        ) : (
          <Table
            columns={bankColumn}
            data={bankData}
            className="shadow-xl rounded-2xl overflow-hidden border border-white/10"
            rowClassName={(rowIndex) =>
              rowIndex % 2 === 0
                ? "bg-white/10 hover:bg-white/20"
                : "bg-white/5 hover:bg-white/20"
            }
            paginationClassName="flex justify-end gap-2 mt-4"
            previousClassName="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-black px-3 py-1 rounded-md shadow-sm cursor-pointer transition"
            nextClassName="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-black px-3 py-1 rounded-md shadow-sm cursor-pointer transition"
            showPagination={true}
            showStatusFilter={true}
            showExport={false}
            showSearch={true}
            showDateFilter={false}
            setData={setBankData}
            endPoint={
              activeTab === "payin" ? "/delete-payinbank" : "/delete-payoutbank"
            }
            refreshTable={activeTab === "payin" ? payinRefetch : payoutRefetch}
            statusList={TOGGLE_STATUSES}
          />
        )}
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
