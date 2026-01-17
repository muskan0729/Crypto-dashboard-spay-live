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

  useEffect(() => {
    if (showModal) {
      if (editData) {
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
        className="
          z-50 flex
          bg-black/70
          fixed inset-0 backdrop-blur-md items-center justify-center
        "
      />

      {/* Modal */}
    <div
  onClick={(e) => e.stopPropagation()}
  className="
    fixed top-12 left-1/2 -translate-x-1/2 z-50
    w-full max-w-xl mx-4
    bg-white/5 backdrop-blur-xl
    border border-white/10
    rounded-2xl
    shadow-2xl
    overflow-hidden
  "
>
  {/* Header */}
  <div className="relative px-6 py-4">
    {/* Glow */}
    <div className="
      absolute inset-0
      blur-2xl opacity-80
    " />

    <div className="relative flex items-center justify-between">
      <h3 className="
        text-[#FFD700] text-lg font-semibold tracking-wide
        drop-shadow-[0_0_8px_rgba(255,215,0,0.35)]
      ">
        {editData ? "Edit Scheme" : "Add New Scheme"}
      </h3>

      <Button
        onClick={handleModal}
        className="
          w-9 h-9 flex items-center justify-center
          rounded-full
          bg-black/30 border border-white/10
          text-white
          transition-all duration-200
          hover:bg-red-500 hover:scale-105
          hover:shadow-lg hover:shadow-red-500/40
          active:scale-95
        "
      >
        <i className="fa-solid fa-xmark" />
      </Button>
    </div>

    <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
  </div>

  {/* Form */}
  <form onSubmit={handleSubmit} className="p-6 space-y-6">

    {/* Scheme Name */}
    <div>
      <label className="block mb-2 text-sm font-medium text-[#FFD700]">
        Scheme Name
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Scheme Name"
        className="
          w-full px-4 py-2
          bg-black/30 text-[#FFD700]
          border border-white/10
          rounded-xl
          placeholder:text-[#FFD700]/40
          focus:outline-none
          focus:ring-2 focus:ring-yellow-400/50
          transition
        "
      />
    </div>

    {/* Tabs */}
    <div className="border-b border-white/10">
      <ul className="flex space-x-4 text-sm font-medium">
        {["tab1", "tab2", "tab3", "tab4"].map((tab, idx) => {
          const labels = ["Payin", "Payout", "Rolling", "GST"];
          const icons = [
            "fa-money-bill-transfer",
            "fa-credit-card",
            "fa-rotate",
            "fa-percent",
          ];
          return (
            <li key={tab}>
              <Button
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`
                  flex items-center gap-2 px-4 py-2
                  border-b-2 transition-all duration-200
                  ${
                    activeTab === tab
                      ? "border-[#FFD700] text-[#FFD700]"
                      : "border-transparent text-white/50 hover:text-[#FFD700]"
                  }
                `}
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
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
      <table className="w-full text-sm text-left">
        <thead className="bg-black/40 text-[#FFD700] uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-3">Operator</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Amount / %</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/10">

          {/* PAYIN */}
          {activeTab === "tab1" && (
            <tr>
              <td className="px-6 py-4 text-white/70">Payin Commission Slab</td>
              <td className="px-6 py-4">
                <select
                  value={payin.type}
                  onChange={(e) => setPayin(p => ({ ...p, type: e.target.value }))}
                  className="
                    w-full px-4 py-2
                    bg-black/40 text-[#FFD700]
                    border border-white/10
                    rounded-xl
                    focus:ring-2 focus:ring-yellow-400/40
                  "
                >
                  <option value="flat">Flat</option>
                  <option value="percent">Percent</option>
                </select>
              </td>
              <td className="px-6 py-4">
                <input
                  type="number"
                  value={payin.amount}
                  onChange={(e) => setPayin(p => ({ ...p, amount: e.target.value }))}
                  className="
                    w-full px-3 py-2
                    bg-black/30 text-[#FFD700]
                    border border-white/10
                    rounded-lg
                  "
                />
              </td>
            </tr>
          )}

          {/* PAYOUT */}
          {activeTab === "tab2" && (
            <>
              <tr>
                <td className="px-6 py-4 text-white/70">Payout Below 700</td>
                <td className="px-6 py-4">
                  <select
                    value={payout.below700.type}
                    onChange={(e) =>
                      setPayout(p => ({
                        ...p,
                        below700: { ...p.below700, type: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2 bg-black/40 text-[#FFD700] rounded-xl border border-white/10"
                  >
                    <option value="flat">Flat</option>
                    <option value="percent">Percent</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={payout.below700.amount}
                    onChange={(e) =>
                      setPayout(p => ({
                        ...p,
                        below700: { ...p.below700, amount: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-black/30 text-[#FFD700] rounded-lg border border-white/10"
                  />
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4 text-white/70">Payout Above 700</td>
                <td className="px-6 py-4">
                  <select
                    value={payout.above700.type}
                    onChange={(e) =>
                      setPayout(p => ({
                        ...p,
                        above700: { ...p.above700, type: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2 bg-black/40 text-[#FFD700] rounded-xl border border-white/10"
                  >
                    <option value="flat">Flat</option>
                    <option value="percent">Percent</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={payout.above700.amount}
                    onChange={(e) =>
                      setPayout(p => ({
                        ...p,
                        above700: { ...p.above700, amount: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-black/30 text-[#FFD700] rounded-lg border border-white/10"
                  />
                </td>
              </tr>
            </>
          )}
  {activeTab === "tab3" && (
                  <>
                    <tr>
                      <td className="px-6 py-4 text-gray-300">
                        Rolling Payin Amount
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={rollingPayin.type}
                          onChange={(e) =>
                            setRollingPayin((r) => ({
                              ...r,
                              type: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 text-[#ffd700] bg-black/40 border border-white/10 rounded-xl"
                        >
                          <option value="flat">Flat</option>
                          <option value="percent">Percent</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={rollingPayin.amountStr}
                          onChange={(e) =>
                            setRollingPayin((r) => ({
                              ...r,
                              amountStr: e.target.value,
                              amount: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="w-full px-2 py-1 text-[#ffd700] bg-black/20 border border-white/10 rounded-md"
                        />
                      </td>
                    </tr>

                    <tr>
                      <td className="px-6 py-4 text-gray-300">
                        Rolling Fixed Amount
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={rollingFixed.type}
                          onChange={(e) =>
                            setRollingFixed((r) => ({
                              ...r,
                              type: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 text-[#ffd700] bg-black/40 border border-white/10 rounded-xl"
                        >
                          <option value="flat">Flat</option>
                          <option value="percent">Percent</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={rollingFixed.amountStr}
                          onChange={(e) =>
                            setRollingFixed((r) => ({
                              ...r,
                              amountStr: e.target.value,
                              amount: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="w-full px-2 py-1 text-[#ffd700] bg-black/20 border border-white/10 rounded-md"
                        />
                      </td>
                    </tr>
                  </>
                )}
          {/* GST */}
          {activeTab === "tab4" && (
            <tr>
              <td className="px-6 py-4 text-white/70">Goods and Service Tax</td>
              <td className="px-6 py-4">
                <select className="w-full px-4 py-2 bg-black/40 text-[#FFD700] rounded-xl border border-white/10">
                  <option value="flat">Flat</option>
                  <option value="percent">Percent</option>
                </select>
              </td>
              <td className="px-6 py-4">
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="w-full px-3 py-2 bg-black/30 text-[#FFD700] rounded-lg border border-white/10"
                />
              </td>
            </tr>
          )}

        </tbody>
      </table>
    </div>

    {/* Submit */}
    <div className="text-right">
      <Button
        type="submit"
        disabled={creating || updating}
        className="
          px-8 py-2.5
          bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400
          text-black font-semibold
          rounded-xl
          shadow-lg
          hover:opacity-90
          hover:shadow-yellow-400/40
          transition-all duration-200
          active:scale-95
        "
      >
        {editData ? "Update" : "Submit"}
      </Button>
    </div>

  </form>
</div>

    </>
  );
};
