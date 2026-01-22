import { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { useToast } from "../contexts/ToastContext";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { TableSkeleton } from "../components/TableSkeleton";
import CryptoAmount from "../components/CryptoAmounts";

const PayinSettlement = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const toast = useToast();
  const [payinSettlementData, setPayinSettlementData] = useState([]);
  const [payinFormData, setPayinFormData] = useState({
    payin_wallet: "",
    remark: "",
  });

  const { data: tableData, refetch, loading } = useGet("/get-merchants");
  const { execute: payinSettlement } = usePost("/payin-settlement");

  const initialDataOfPayinWallet = tableData?.data;

  useEffect(() => {
    const formattedData = initialDataOfPayinWallet?.map((item, index) => ({
      sqno: index + 1,
      id: item.id,
      name: item.name,
      payin_wallet: <CryptoAmount amount={item.payin_wallet} symbol="₹" />,
    }));
    setPayinSettlementData(formattedData || []);
  }, [initialDataOfPayinWallet]);

  const membercolumn = [
    { header: "SQ No", accessor: "sqno" },
    { header: "Name", accessor: "name" },
    { header: "Payin Wallet", accessor: "payin_wallet" },
    { header: "Action", accessor: "action" },
  ];

  const tableDataWithActions = payinSettlementData?.map((row) => ({
    ...row,
    action: (
      <Button
        onClick={() => {
          setSelectedUser(row);
          setShowModal(true);
        }}
        className="
          px-4 py-1.5 rounded-xl
          text-sm font-medium tracking-wide text-cyan-300
          bg-cyan-400/10 border border-cyan-400/30
          shadow-[0_0_12px_rgba(34,211,238,0.35)]
          transition-all duration-300 ease-out
          hover:scale-105
          hover:bg-cyan-400/20
          hover:shadow-[0_0_22px_rgba(34,211,238,0.6)]
          active:scale-95
        "
      >
        Payin Settlement
      </Button>
    ),
  }));

  const handleChange = (e) => {
    setPayinFormData({ ...payinFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: selectedUser.id,
      payin_wallet: payinFormData.payin_wallet,
      remark: payinFormData.remark,
    };

    try {
      const res = await payinSettlement(payload);
      if (res) {
        toast.success("Settlement done successfully!");
        refetch();
        setPayinFormData({ payin_wallet: "", remark: "" });
        setShowModal(false);
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] relative overflow-hidden p-6">
      {/* Cinematic background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 
                        bg-white/5 backdrop-blur-2xl px-6 py-4
                        shadow-[0_0_40px_-10px_rgba(34,211,238,0.25)]">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-transparent blur-2xl" />
          <h4 className="relative text-xl font-semibold tracking-wider text-cyan-300">
            Payin Settlement
          </h4>
        </div>

        {/* Table */}
        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="relative rounded-2xl border border-white/10 bg-white/5 
                          backdrop-blur-2xl p-4
                          shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_-20px_rgba(0,255,255,0.25)]">
            <Table
              columns={membercolumn}
              data={tableDataWithActions}
              showDeleteColumn={false}
              showDateFilter={false}
              showStatusFilter={false}
              className="rounded-xl overflow-hidden border border-cyan-400/10"
              paginationClassName="flex justify-end gap-2 mt-4"
              previousClassName="px-3 py-1 rounded-lg text-cyan-300 bg-cyan-400/10
                                 border border-cyan-400/20 hover:bg-cyan-400/20
                                 hover:shadow-[0_0_12px_rgba(34,211,238,0.5)]
                                 transition-all"
              nextClassName="px-3 py-1 rounded-lg text-cyan-300 bg-blue-500/10
                             border border-blue-400/20 hover:bg-blue-500/20
                             hover:shadow-[0_0_12px_rgba(59,130,246,0.5)]
                             transition-all"
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-[#050B14]/80 backdrop-blur-md"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md mx-4 overflow-hidden
                       rounded-2xl border border-cyan-400/20
                       bg-white/5 backdrop-blur-2xl
                       shadow-[0_0_60px_-15px_rgba(34,211,238,0.4)]"
          >
            {/* Modal Header */}
            <div className="px-6 py-4">
              <h3 className="text-cyan-300 font-semibold tracking-widest text-lg
                             drop-shadow-[0_0_10px_rgba(34,211,238,0.45)]">
                Payin Settlement
                <span className="ml-2 text-cyan-300/70 font-normal">
                  — {selectedUser?.name}
                </span>
              </h3>
              <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block mb-1 text-sm text-white/70">
                  Amount
                </label>
                <input
                  type="number"
                  name="payin_wallet"
                  value={payinFormData.payin_wallet}
                  onChange={handleChange}
                  className="
                    w-full rounded-xl px-3 py-2
                    bg-black/30 text-cyan-100
                    border border-white/20
                    transition-all duration-300
                    focus:outline-none
                    focus:border-cyan-400
                    focus:ring-2 focus:ring-cyan-400/40
                    focus:shadow-[0_0_15px_rgba(34,211,238,0.5)]
                  "
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-white/70">
                  Remark
                </label>
                <textarea
                  rows="3"
                  name="remark"
                  value={payinFormData.remark}
                  onChange={handleChange}
                  className="
                    w-full rounded-xl px-3 py-2
                    bg-black/30 text-cyan-100
                    border border-white/20
                    transition-all duration-300
                    focus:outline-none
                    focus:border-cyan-400
                    focus:ring-2 focus:ring-cyan-400/40
                    focus:shadow-[0_0_15px_rgba(34,211,238,0.5)]
                  "
                />
              </div>

              <Button
                type="submit"
                className="
                  w-full py-2 rounded-xl
                  font-semibold tracking-wide text-[#050B14]
                  bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500
                  shadow-[0_0_25px_rgba(34,211,238,0.6)]
                  transition-all duration-300
                  hover:scale-[1.02]
                  hover:shadow-[0_0_40px_rgba(34,211,238,0.85)]
                  active:scale-95
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

export default PayinSettlement;
