import { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";
import { TableSkeleton } from "../components/TableSkeleton";

const LoadWallet = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [walletData, setWalletData] = useState([]);
  const [modalType, setModalType] = useState("load");

  const toast = useToast();
  const [walletFormData, setWalletFormData] = useState({
    payout_wallet: "",
    remark: "",
  });

  const { data: tableData, refetch, loading } = useGet("/get-merchants");
  const { execute: loadWallet } = usePost("/payout-load-wallet");
  const { execute: reverseTopup } = usePost("/payout-take-back");

  const initialDataOfWallet = tableData?.data;

  useEffect(() => {
    const formattedTableData = initialDataOfWallet?.map((item, index) => ({
      sqno: index + 1,
      id: item.id,
      name: item.name,
      payout_wallet: item.payout_wallet,
    }));
    setWalletData(formattedTableData || []);
  }, [initialDataOfWallet]);

  const handleChange = (e) => {
    setWalletFormData({ ...walletFormData, [e.target.name]: e.target.value });
  };

  const handleSubmitLoadWallet = async (e) => {
    e.preventDefault();
    const payload = {
      user_id: selectedUser.id,
      payout_wallet: walletFormData.payout_wallet,
      remark: walletFormData.remark,
    };
    try {
      const res = await loadWallet(payload);
      if (res) {
        toast.success("Wallet loaded successfully!!");
        refetch();
        setShowModal(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!!");
    }
  };

  const handleSubmitReverseTopup = async (e) => {
    e.preventDefault();
    const payload = {
      user_id: selectedUser.id,
      payout_wallet: walletFormData.payout_wallet,
      remark: walletFormData.remark,
    };
    try {
      const res = await reverseTopup(payload);
      if (res) {
        toast.success("Deducted balance from wallet successfully!!");
        refetch();
        setShowModal(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!!");
    }
  };

  const membercolumn = [
    { header: "SQNo", accessor: "sqno" },
    { header: "Name", accessor: "name" },
    { header: "Payout Wallet", accessor: "payout_wallet" },
    { header: "Action", accessor: "action" },
  ];

  const tableDataWithActions = walletData?.map((row) => ({
    ...row,
    action: (
      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            setSelectedUser(row);
            setModalType("load");
            setShowModal(true);
          }}
          className="bg-[#FFD700] hover:bg-yellow-500 text-black text-sm font-medium px-4 py-1.5 rounded-xl shadow-md transition"
        >
          Load Wallet
        </Button>
        <Button
          onClick={() => {
            setSelectedUser(row);
            setModalType("reverse");
            setShowModal(true);
          }}
          className="bg-[#FFB700] hover:bg-yellow-600 text-black text-sm font-medium px-4 py-1.5 rounded-xl shadow-md transition"
        >
          Reverse Top-up
        </Button>
      </div>
    ),
  }));

  return (
    <div className="w-full min-h-screen p-6 space-y-6 bg-black relative">
      {/* Gradient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-red-600 via-orange-500 to-yellow-400 blur-[120px] opacity-20 -z-10 rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-yellow-400 via-orange-500 to-red-600 blur-[150px] opacity-10 -z-10 rounded-full" />

      {/* Header Card */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-6 flex justify-between items-center">
        <h4 className="font-bold text-[#FFD700] text-xl sm:text-2xl">Load Wallet</h4>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : (
        // <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-4">
          <Table
            columns={membercolumn}
            data={tableDataWithActions}
            showStatusFilter={false}
            showDateFilter={false}
            showDeleteColumn={false}
          />
        // </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-md w-full mx-2 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-gradient-to-r from-[#FFD700] via-orange-400 to-[#FFD700] text-black font-semibold rounded-t-2xl px-5 py-3 shadow-md">
              <h3 className="text-lg font-bold">
                {modalType === "load"
                  ? `Load Wallet for ${selectedUser?.name}`
                  : `Reverse Topup for ${selectedUser?.name}`}
              </h3>
              <Button
                onClick={() => setShowModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 text-white border border-black/30 text-lg shadow hover:bg-red-600 hover:text-white transition"
              >
                <i className="fa-solid fa-xmark fa-lg"></i>
              </Button>
            </div>

            {/* Modal Body */}
            <form
              className="p-6 space-y-4"
              onSubmit={modalType === "load" ? handleSubmitLoadWallet : handleSubmitReverseTopup}
            >
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Amount</label>
                <input
                  name="payout_wallet"
                  type="number"
                  value={walletFormData.payout_wallet}
                  onChange={handleChange}
                  placeholder="Enter Amount"
                  className="w-full bg-black/40 text-white border border-white/10 rounded-xl p-2 text-sm focus:ring-2 focus:ring-[#FFD700] outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Remark</label>
                <textarea
                  rows="3"
                  name="remark"
                  value={walletFormData.remark}
                  onChange={handleChange}
                  placeholder="Enter Remark"
                  className="w-full bg-black/40 text-white border border-white/10 rounded-xl p-2 text-sm focus:ring-2 focus:ring-[#FFD700] outline-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FFD700] hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-xl shadow-md transition"
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadWallet;
