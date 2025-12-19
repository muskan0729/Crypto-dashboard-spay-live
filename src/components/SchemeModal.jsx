import { useEffect, useState } from "react";
import Button from "./Button";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";

export const SchemeModal = ({
  showModal,
  handleModal,
  editData,
  refreshTable,
}) => {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("tab1");
  const [percentage, setPercentage] = useState(18);
  const [name, setName] = useState("");
  const [payin, setPayin] = useState({ type: "percent", amount: 0 });
  const [payout, setPayout] = useState({
    below700: { type: "flat", amount: 0 },
    above700: { type: "percent", amount: 0 },
  });
  const [rollingPayin, setRollingPayin] = useState({
    type: "percent",
    amount: 0,
    amountStr: "0",
  });
  const [rollingFixed, setRollingFixed] = useState({
    type: "flat",
    amount: 0,
    amountStr: "0",
  });
  const [selectedRolling, setSelectedRolling] = useState("payin");

  const { execute: createScheme, loading: creating } =
    usePost("/create-scheme");
  const { execute: updateScheme, loading: updating } = usePost(
    editData ? `/update-scheme/${editData.id}` : ""
  );

  // Initialize modal state when it opens
  useEffect(() => {
    if (showModal) {
      if (editData) {
        // Pre-fill with edit data
        setName(editData.name || "");
        setPayin({
          type: editData.payin_commision_type,
          amount: editData.payin_commision_amount,
        });
        setPayout({
          below700: {
            type: editData.payout_commision_type_below,
            amount: editData.payout_commision_amount_below,
          },
          above700: {
            type: editData.payout_commision_type_above,
            amount: editData.payout_commision_amount_above,
          },
        });
        setRollingPayin({
          type: editData.rolling_payin_type || "percent",
          amount: editData.rolling_payin_amount || 0,
          amountStr: String(editData.rolling_payin_amount || 0),
        });
        setRollingFixed({
          type: editData.rolling_fixed_type || "percent",
          amount: editData.rolling_fixed_amount || 0,
          amountStr: String(editData.rolling_fixed_amount || 0),
        });
        setSelectedRolling(
          editData.rolling_payin_amount > 0 ? "payin" : "fixed"
        );
        setPercentage(editData.gst_amount || 18);
      } else {
        // Reset for adding new scheme
        setName("");
        setPayin({ type: "percent", amount: 0 });
        setPayout({
          below700: { type: "flat", amount: 0 },
          above700: { type: "percent", amount: 0 },
        });
        setRollingPayin({ type: "percent", amount: 0, amountStr: "0" });
        setRollingFixed({ type: "percent", amount: 0, amountStr: "0" });
        setSelectedRolling("payin");
        setPercentage(18);
      }
    }
  }, [showModal, editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.info("Please enter scheme name");
      return;
    }

    const payload = {
      name: name,
      payin_commision_type: payin.type,
      payin_commision_amount: parseFloat(payin.amount) || 0,
      payout_commision_type_below: payout.below700.type,
      payout_commision_amount_below: parseFloat(payout.below700.amount) || 0,
      payout_commision_type_above: payout.above700.type,
      payout_commision_amount_above: parseFloat(payout.above700.amount) || 0,
      rolling_payin_amount:
        selectedRolling === "payin"
          ? parseFloat(rollingPayin.amountStr) || 0
          : 0,
      rolling_payin_type:
        selectedRolling === "payin" ? rollingPayin.type : null,
      rolling_fixed_amount:
        selectedRolling === "fixed"
          ? parseFloat(rollingFixed.amountStr) || 0
          : 0,
      rolling_fixed_type:
        selectedRolling === "fixed" ? rollingFixed.type : null,
      gst_amount: parseFloat(percentage) || 18,
      gst_type: "percent",
    };

    try {
      if (editData) {
        await updateScheme(payload);
        toast.success("Scheme updated successfully!");
      } else {
        console.log("Payload of Scheme: ", payload);
        await createScheme(payload);
        toast.success("Scheme created successfully!");
      }
      refreshTable();
      handleModal();
    } catch (err) {
      console.error("Error saving scheme:", err);
      toast.error(err.message || "Something went wrong");
    }
  };

  if (!showModal) return null;

  return (
    <>
     {/* Overlay */}
<div
  className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50"
></div>

{/* Modal */}
<div
  className="fixed top-10 left-1/2 -translate-x-1/2 z-50 
             w-full max-w-xl rounded-xl 
             bg-gradient-to-b from-black via-[#0b0b0b] to-black 
             border border-[#d4af37]/40 shadow-[0_0_25px_rgba(212,175,55,0.25)]"
  onClick={(e) => e.stopPropagation()}
>

  {/* Header */}
  <div className="flex items-center justify-between px-6 py-4 
                  rounded-t-xl 
                  bg-gradient-to-r from-[#1a1a1a] to-black 
                  border-b border-[#d4af37]/40">
    <h3 className="text-lg font-semibold text-[#d4af37] tracking-wide">
      {editData ? "Edit Scheme" : "Add New Scheme"}
    </h3>

    <Button
      onClick={handleModal}
      className="w-8 h-8 flex items-center justify-center 
                 rounded-full bg-black 
                 border border-[#d4af37] 
                 text-[#d4af37] 
                 hover:bg-[#d4af37] hover:text-black 
                 transition"
    >
      <i className="fa-solid fa-xmark"></i>
    </Button>
  </div>

  {/* Form */}
  <form
    className="p-6 bg-black rounded-b-xl"
    onSubmit={handleSubmit}
  >

    {/* Scheme Name */}
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-[#d4af37]">
        Scheme Name
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Scheme Name"
        className="w-full bg-black border border-[#d4af37]/50 
                   text-[#d4af37] 
                   rounded-lg p-2 
                   placeholder:text-[#d4af37]/40
                   focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
      />
    </div>

    {/* Tabs */}
    <div className="border-b border-[#d4af37]/30 mb-4">
      <ul className="flex text-sm font-medium">
        {["tab1", "tab2", "tab3", "tab4"].map((tab, idx) => {
          const labels = ["Payin", "Payout", "Rolling", "GST"];
          const icons = [
            "fa-money-bill-transfer",
            "fa-credit-card",
            "fa-rotate",
            "fa-percent",
          ];

          return (
            <li key={tab} className="mr-4">
              <Button
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-3 
                  border-b-2 transition
                  ${
                    activeTab === tab
                      ? "border-[#d4af37] text-[#d4af37]"
                      : "border-transparent text-gray-500 hover:text-[#d4af37]"
                  }`}
              >
                <i className={`fa-solid ${icons[idx]}`} />
                {labels[idx]}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>

    {/* Table */}
    <div className="overflow-hidden rounded-lg border border-[#d4af37]/30">
      <table className="w-full text-sm text-left">
        <thead className="bg-[#111] text-[#d4af37] uppercase">
          <tr>
            <th className="px-6 py-3">Operator</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Amount / %</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#d4af37]/20">

          {/* PAYIN */}
          {activeTab === "tab1" && (
            <tr>
              <td className="px-6 py-4 text-gray-300">
                Payin Commission Slab
              </td>
              <td className="px-6 py-4">
                <select className="bg-black border border-[#d4af37]/40 text-[#d4af37] rounded-md px-2 py-1">
                  <option value="flat">Flat</option>
                  <option value="percent">Percent</option>
                </select>
              </td>
              <td className="px-6 py-4">
                <input
                  type="number"
                  className="w-full bg-black border border-[#d4af37]/40 
                             text-[#d4af37] rounded-md px-2 py-1"
                />
              </td>
            </tr>
          )}

          {/* GST */}
          {activeTab === "tab4" && (
            <tr>
              <td className="px-6 py-4 text-gray-300">
                Goods and Service Tax
              </td>
              <td className="px-6 py-4">
                <select
                  disabled
                  className="bg-black border border-[#d4af37]/40 text-[#d4af37] rounded-md px-2 py-1"
                >
                  <option>Percent</option>
                </select>
              </td>
              <td className="px-6 py-4">
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="w-full bg-black border border-[#d4af37]/40 
                             text-[#d4af37] rounded-md px-2 py-1"
                />
              </td>
            </tr>
          )}

        </tbody>
      </table>
    </div>

    {/* Submit */}
    <div className="mt-6 text-right">
      <Button
        type="submit"
        disabled={creating || updating}
        className="px-6 py-2 rounded-lg 
                   bg-gradient-to-r from-[#d4af37] to-[#b8962e] 
                   text-black font-semibold 
                   hover:opacity-90 transition"
      >
        {editData ? "Update" : "Submit"}
      </Button>
    </div>

  </form>
</div>
    </>
  );
};
