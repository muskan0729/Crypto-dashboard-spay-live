import { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";
import { TableSkeleton } from "../components/TableSkeleton";
import CryptoAmount from "../components/CryptoAmounts";

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
      payout_wallet: <CryptoAmount amount={item.payout_wallet} symbol="₹" />,
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
          className="bg-[#53eafd] hover:bg-yellow-500 text-black text-sm font-medium px-4 py-1.5 rounded-xl shadow-md transition"
        >
          Load Wallet
        </Button>
        <Button
          onClick={() => {
            setSelectedUser(row);
            setModalType("reverse");
            setShowModal(true);
          }}
          className="bg-[#53eafd] hover:bg-yellow-600 text-black text-sm font-medium px-4 py-1.5 rounded-xl shadow-md transition"
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
        <h4 className="font-bold text-[#53eafd] text-xl sm:text-2xl">
          Load Wallet
        </h4>
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
          className="
    fixed inset-0 z-50
    flex items-center justify-center
    bg-black/60 backdrop-blur-sm
  "
          onClick={() => setShowModal(false)}
        >
          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="
      relative
      w-full max-w-md mx-4
      bg-white/5 backdrop-blur-xl
      border border-white/10
      rounded-2xl
      shadow-2xl
      overflow-hidden
      transform transition-all
    "
          >
            {/* Header */}
            <div className="relative px-6 py-4 overflow-hidden">
              {/* Warm glow */}
              <div
                className="
          absolute inset-0
          blur-2xl opacity-80
        "
              />

              {/* Header content */}
              <div className="relative flex items-center justify-between">
                <h3
                  className="
            text-[#53eafd]
            font-semibold tracking-wide text-lg
            drop-shadow-[0_0_8px_rgba(255,215,0,0.35)]
          "
                >
                  {modalType === "load" ? "Load Wallet" : "Reverse Topup"}
                  <span className="ml-2 text-[#53eafd]/70 font-normal">
                    — {selectedUser?.name}
                  </span>
                </h3>

                <Button
                  onClick={() => setShowModal(false)}
                  className="
            w-9 h-9
            flex items-center justify-center
            rounded-full
            bg-black/30
            border border-white/10
            text-white
            transition-all duration-200
            hover:bg-red-500 hover:scale-105
            hover:shadow-lg hover:shadow-red-500/40
            active:scale-95
          "
                >
                  ✕
                </Button>
              </div>

              {/* Divider */}
              <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </div>

            {/* Body */}
            <form
              onSubmit={
                modalType === "load"
                  ? handleSubmitLoadWallet
                  : handleSubmitReverseTopup
              }
              className="p-6 space-y-5"
            >
              {/* Amount */}
              <div>
                <label className="block mb-1 text-sm text-white/70">
                  Amount
                </label>
                <input
                  type="number"
                  name="payout_wallet"
                  value={walletFormData.payout_wallet}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className="
            w-full
            bg-black/30 text-white
            border border-white/20
            rounded-xl
            px-3 py-2
            focus:outline-none
            focus:ring-2 focus:ring-yellow-400
          "
                />
              </div>

              {/* Remark */}
              <div>
                <label className="block mb-1 text-sm text-white/70">
                  Remark
                </label>
                <textarea
                  rows="3"
                  name="remark"
                  value={walletFormData.remark}
                  onChange={handleChange}
                  placeholder="Enter remark"
                  className="
            w-full
            bg-black/30 text-white
            border border-white/20
            rounded-xl
            px-3 py-2
            focus:outline-none
            focus:ring-2 focus:ring-yellow-400
          "
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="
          w-full
          bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400
          text-black font-semibold
          py-2.5 rounded-xl
          shadow-lg
          transition
          hover:opacity-90 hover:shadow-yellow-400/40
        "
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
