import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import Toggle from "../components/Toggle";
import Button from "../components/Button";
import { SchemeModal } from "../components/SchemeModal";
import useAutoFetch from "../hooks/useAutoFetch";
import { usePut } from "../hooks/usePut";
import { MONTH_NAMES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";
import CryptoAmount from "../components/CryptoAmounts";

export const Member = () => {
  const navigate = useNavigate();
  const memberDetails = useNavigate();

  const [merchantData, setMerchantData] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { executePut: updateSingle } = usePut("/update-user-statuses");
  const { executePut: updateAll } = usePut("/payin-payout-statuses");

  const {
    data: dataOfMerchants,
    loading,
    refetch,
  } = useAutoFetch("/get-merchants", 20000);

  const merchants = useMemo(
    () => dataOfMerchants?.data ?? [],
    [dataOfMerchants]
  );

  useEffect(() => {
    if (!loading) setInitialLoad(false);
  }, [loading]);

  /* ---------------- Format Data ---------------- */
  useEffect(() => {
    if (!merchants.length) return;

    const formattedMerchantData = initialDataOfMerchants.map((item, index) => {
      const payinBank = item.payin_at_onboard;

      return {
        sqno: index + 1,
        id: item.id,
        // name: item.name,
        name: (
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => {
              localStorage.setItem("merchantId", item.id);
              memberDetails(`/MerchantDetails/${item.id}`);
            }}
          >
            {item.name}
          </span>
        ),
        payin_bank: payinBank,
        payin: item.payin_status,

        payout: item.payout_status,
        payincharge: <CryptoAmount amount={item.total_charge?.CRYPTO || 0} symbol="₹" />,
        //Number(item.total_charge?.CRYPTO || 0).toFixed(20),
        payoutcharge: <CryptoAmount amount={item.total_charge?.payout || 0} symbol="₹" />,
        //Number(item.total_charge?.payout || 0).toFixed(20),
        //cryptocharge: Number(item.total_charge?.CRYPTO || 0).toFixed(2),

        totalwalletpayin: <CryptoAmount amount={item.total_amount?.CRYPTO || 0} symbol="₹" />,
        //Number(item.total_amount?.CRYPTO || 0).toFixed(20),
        totalwalletpayout: <CryptoAmount amount={item.total_amount?.payout || 0} symbol="₹" />,
        //Number(item.total_amount?.payout || 0).toFixed(20),
        totalwallet: <CryptoAmount amount={item.total_payout || 0} symbol="₹" />,
        //Number(item.total_payout || 0).toFixed(20),
        account: item.account_status,

        walletpayin: <CryptoAmount amount={item.payin_wallet || 0} symbol="₹" />,
        walletpayout: <CryptoAmount amount={item.payout_wallet || 0} symbol="₹" />,
        date:
          new Date(item.created_at).getDate() +
          " " +
          MONTH_NAMES[new Date(item.created_at).getMonth()] +
          " " +
          new Date(item.created_at).getFullYear(),
      };
    });

    setMerchantData(formatted);
  }, [merchants, memberDetails]);

  /* ---------------- Toggles ---------------- */
  const handlePayinToggle = async (v, id, account) => {
    if (!account) return;
    await updateSingle({ user_id: id, payin_status: v });
  };

  const handlePayoutToggle = async (v, id, account) => {
    if (!account) return;
    await updateSingle({ user_id: id, payout_status: v });
  };

  const handleAllPayinToggle = async (v) => {
    await updateAll({ payin_status: v ? 1 : 0 });
    refetch();
  };

  const handleAllPayoutToggle = async (v) => {
    await updateAll({ payout_status: v ? 1 : 0 });
    refetch();
  };

  /* ---------------- Columns ---------------- */
  const columns = [
    { header: "SQ No", accessor: "sqno" },
    { header: "Name", accessor: "name" },
    { header: "Payin", accessor: "payin" },
    { header: "Payout", accessor: "payout" },
    { header: "Payin Wallet", accessor: "walletpayin" },
    { header: "Payout Wallet", accessor: "walletpayout" },
    { header: "Total Payin Wallet", accessor: "totalwalletpayin" },
    { header: "Payin Charge", accessor: "payincharge" },
    { header: "Total Payout Wallet", accessor: "totalwalletpayout" },
    { header: "Payout Charge", accessor: "payoutcharge" },
    { header: "Total Wallet", accessor: "totalwallet" },
    { header: "Payin Onboarded Bank", accessor: "payin_bank" },
  ];

  const tableData = merchantData.map((row) => ({
    ...row,
    payin: (
      <Toggle
        defaultChecked={row.payin}
        onChange={(v) => handlePayinToggle(v, row.id, row.account)}
        disabled={!row.account}
      />
    ),
    payout: (
      <Toggle
        defaultChecked={row.payout}
        onChange={(v) => handlePayoutToggle(v, row.id, row.account)}
        disabled={!row.account}
      />
    ),
  }));

  return (
    <div className="p-4 space-y-6 w-full ">
      {/* ---------------- Header (MATCHES SCHEME) ---------------- */}
      <div className="border  w-full relative bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl flex flex-wrap gap-4 justify-between p-4">
        <div>
          <h4 className="font-bold text-[#ffd700] text-xl">Member Manager</h4>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-sm text-white">
              <span>All Payin</span>
              <Toggle onChange={handleAllPayinToggle} />
            </div>

            <div className="flex items-center gap-2 text-sm text-white">
              <span>All Payout</span>
              <Toggle onChange={handleAllPayoutToggle} />
            </div>

            <Button
              className="bg-white/10 border border-[#ffd700]/50 text-[#ffd700] font-semibold px-4 py-2 rounded-2xl shadow-md hover:bg-white/20 hover:border-[#ffd700] transition"
              onClick={() => navigate("/member-create")}
            >
              + ADD NEW
            </Button>
          </div>
        </div>

        {/* ---------------- Table ---------------- */}
        <div className="w-full flex justify-center mt-4">
          <div className="w-[95%]">
            {initialLoad ? (
              <TableSkeleton />
            ) : (
              <Table
                columns={columns}
                data={tableData}
                endPoint="/delete-merchant"
                setData={setMerchantData}
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden"
              />
            )}

            <SchemeModal
              showModal={showModal}
              handleModal={() => setShowModal(!showModal)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
