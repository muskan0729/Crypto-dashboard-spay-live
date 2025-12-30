import { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { useToast } from "../contexts/ToastContext";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { TableSkeleton } from "../components/TableSkeleton";

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
      payin_wallet: item.payin_wallet,
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
        className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 
                   text-black text-sm font-semibold px-4 py-1.5 rounded-xl 
                   shadow-lg hover:opacity-90 transition"
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
        toast.success("Settlement done successfully!!");
        refetch();
        setPayinFormData({ payin_wallet: "", remark: "" });
        setShowModal(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="bg-black min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl px-6 py-4">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 blur-2xl" />
        <h4 className="relative font-bold text-[#ffd700] text-2xl">
          Payin Settlement
        </h4>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">
          <Table
            columns={membercolumn}
            data={tableDataWithActions}
            showDeleteColumn={false}
            showDateFilter={false}
            showStatusFilter={false}
            className="rounded-xl overflow-hidden border border-white/10"
            paginationClassName="flex justify-end gap-2 mt-4"
            previousClassName="bg-gradient-to-r from-yellow-400 to-orange-400 
                               text-black px-3 py-1 rounded-md shadow cursor-pointer"
            nextClassName="bg-gradient-to-r from-orange-400 to-red-400 
                           text-black px-3 py-1 rounded-md shadow cursor-pointer"
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center 
                     bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white/5 backdrop-blur-xl border border-white/10 
                       rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="relative px-6 py-4">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 blur-xl" />
              <div className="relative flex justify-between items-center">
                <h3 className="text-[#ffd700] font-bold text-lg">
                  Payin Settlement — {selectedUser?.name}
                </h3>
                <Button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full 
                             bg-white/10 text-white hover:bg-red-500 transition"
                >
                  ✕
                </Button>
              </div>
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
                  className="w-full bg-black/30 text-white border border-white/20 
                             rounded-xl px-3 py-2 focus:outline-none 
                             focus:ring-2 focus:ring-yellow-400"
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
                  className="w-full bg-black/30 text-white border border-white/20 
                             rounded-xl px-3 py-2 focus:outline-none 
                             focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 
                           text-black font-semibold py-2 rounded-xl shadow-lg 
                           hover:opacity-90 transition"
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
