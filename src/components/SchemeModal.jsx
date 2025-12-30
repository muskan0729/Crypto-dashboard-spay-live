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
          z-50 overflow-hidden
          w-full max-w-xl
          bg-white/5
          border border-white/10 rounded-2xl
          shadow-xl
          fixed top-10 left-1/2 -translate-x-1/2 backdrop-blur-xl
        "
      >
        {/* Header */}
        <div
          className="
            flex
            px-6 py-4
            bg-black/20
            border-b border-white/10
            items-center justify-between
          "
        >
          <h3
            className="
              text-[#ffd700] font-semibold text-lg tracking-wide
            "
          >
            {editData ? "Edit Scheme" : "Add New Scheme"}
          </h3>
          <Button
            onClick={handleModal}
            className="
              flex
              w-8 h-8
              text-[#ffd700]
              bg-black/20
              rounded-full border border-[#ffd700]
              items-center justify-center hover:bg-[#ffd700] hover:text-black transition
            "
          >
            <i
              className="
                fa-solid fa-xmark
              "
            ></i>
          </Button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="
            p-6 space-y-6
          "
        >
          {/* Scheme Name */}
          <div>
            <label
              className="
                block
                mb-2
                text-sm font-medium text-[#ffd700]
              "
            >
              Scheme Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Scheme Name"
              className="
                w-full
                p-2
                text-[#ffd700]
                bg-black/20
                border border-white/10 rounded-lg
                placeholder:text-[#ffd700]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd700]
              "
            />
          </div>

          {/* Tabs */}
          <div
            className="
              border-b border-white/10
            "
          >
            <ul
              className="
                flex
                space-x-4
                text-sm font-medium
              "
            >
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
                        flex
                        px-4 py-2
                        border-b-2
                        items-center gap-2 transition
                        ${
                          activeTab === tab
                            ? "border-[#ffd700] text-[#ffd700]"
                            : "border-transparent text-gray-400 hover:text-[#ffd700]"
                        }
                      `}
                    >
                      <i
                        className={`
                          fa-solid ${icons[idx]}
                        `}
                      />
                      {labels[idx]}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Table */}
          <div
            className="
              overflow-hidden
              rounded-lg border border-white/10
            "
          >
            <table
              className="
                w-full
                text-sm text-left
              "
            >
              <thead
                className="
                  text-[#ffd700]
                  bg-black/30
                  uppercase
                "
              >
                <tr>
                  <th
                    className="
                      px-6 py-3
                    "
                  >
                    Operator
                  </th>
                  <th
                    className="
                      px-6 py-3
                    "
                  >
                    Type
                  </th>
                  <th
                    className="
                      px-6 py-3
                    "
                  >
                    Amount / %
                  </th>
                </tr>
              </thead>
              <tbody
                className="
                  divide-y divide-white/10
                "
              >
                {/* PAYIN */}
                {activeTab === "tab1" && (
                  <tr>
                    <td
                      className="
                        px-6 py-4
                        text-gray-300
                      "
                    >
                      Payin Commission Slab
                    </td>
                    <td
                      className="
                        px-6 py-4
                      "
                    >
                      <select
                        className="
                          w-full
                          px-4 py-2
                          text-[#ffd700] text-sm
                          bg-black/40
                          border border-white/10 rounded-xl
                          appearance-none backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#ffd700]/40 focus:border-[#ffd700]/40 hover:border-white/20 transition
                        "
                      >
                        <option
                          value="flat"
                          className="
                            text-white
                            bg-black
                          "
                        >
                          Flat
                        </option>
                        <option
                          value="percent"
                          className="
                            text-white
                            bg-black
                          "
                        >
                          Percent
                        </option>
                      </select>
                    </td>
                    <td
                      className="
                        px-6 py-4
                      "
                    >
                      <input
                        type="number"
                        className="
                          w-full
                          px-2 py-1
                          text-[#ffd700]
                          bg-black/20
                          border border-white/10 rounded-md
                        "
                      />
                    </td>
                  </tr>
                )}

                {/* PAYOUT */}
                {activeTab === "tab2" && (
                  <>
                    <tr>
                      <td
                        className="
                          px-6 py-4
                          text-gray-300
                        "
                      >
                        Payout Below 700
                      </td>
                      <td
                        className="
                          px-6 py-4
                        "
                      >
                        <select
                          className="
                            w-full
                            px-4 py-2
                            text-[#ffd700] text-sm
                            bg-black/40
                            border border-white/10 rounded-xl
                            appearance-none backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#ffd700]/40 focus:border-[#ffd700]/40 hover:border-white/20 transition
                          "
                        >
                          <option
                            value="flat"
                            className="
                              text-white
                              bg-black
                            "
                          >
                            Flat
                          </option>
                          <option
                            value="percent"
                            className="
                              text-white
                              bg-black
                            "
                          >
                            Percent
                          </option>
                        </select>
                      </td>
                      <td
                        className="
                          px-6 py-4
                        "
                      >
                        <input
                          type="number"
                          className="
                            w-full
                            px-2 py-1
                            text-[#ffd700]
                            bg-black/20
                            border border-white/10 rounded-md
                          "
                        />
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="
                          px-6 py-4
                          text-gray-300
                        "
                      >
                        Payout Below 700
                      </td>
                      <td
                        className="
                          px-6 py-4
                        "
                      >
                        <select
                          className="
                            w-full
                            px-4 py-2
                            text-[#ffd700] text-sm
                            bg-black/40
                            border border-white/10 rounded-xl
                            appearance-none backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#ffd700]/40 focus:border-[#ffd700]/40 hover:border-white/20 transition
                          "
                        >
                          <option
                            value="flat"
                            className="
                              text-white
                              bg-black
                            "
                          >
                            Flat
                          </option>
                          <option
                            value="percent"
                            className="
                              text-white
                              bg-black
                            "
                          >
                            Percent
                          </option>
                        </select>
                      </td>
                      <td
                        className="
                          px-6 py-4
                        "
                      >
                        <input
                          type="number"
                          className="
                            w-full
                            px-2 py-1
                            text-[#ffd700]
                            bg-black/20
                            border border-white/10 rounded-md
                          "
                        />
                      </td>
                    </tr>
                  </>
                )}

                {/* ROLLING AMOUNT */}
                {activeTab === "tab3" && (
                  <>
                    <tr>
                      <td
                        className="
                          px-6 py-4
                          text-gray-300
                        "
                      >
                        Rolling Payin Amount
                      </td>
                      <td
                        className="
                          px-6 py-4
                        "
                      >
                        <select
                          className="
                            w-full
                            px-4 py-2
                            text-[#ffd700] text-sm
                            bg-black/40
                            border border-white/10 rounded-xl
                            appearance-none backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#ffd700]/40 focus:border-[#ffd700]/40 hover:border-white/20 transition
                          "
                        >
                          <option
                            value="flat"
                            className="
                              text-white
                              bg-black
                            "
                          >
                            Flat
                          </option>
                          <option
                            value="percent"
                            className="
                              text-white
                              bg-black
                            "
                          >
                            Percent
                          </option>
                        </select>
                      </td>
                      <td
                        className="
                          px-6 py-4
                        "
                      >
                        <input
                          type="number"
                          className="
                            w-full
                            px-2 py-1
                            text-[#ffd700]
                            bg-black/20
                            border border-white/10 rounded-md
                          "
                        />
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="
                          px-6 py-4
                          text-gray-300
                        "
                      >
                        Rolling fixed Amount
                      </td>
                      <td
                        className="
                          px-6 py-4
                        "
                      >
                        <select
                          className="
                            w-full
                            px-4 py-2
                            text-[#ffd700] text-sm
                            bg-black/40
                            border border-white/10 rounded-xl
                            appearance-none backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#ffd700]/40 focus:border-[#ffd700]/40 hover:border-white/20 transition
                          "
                        >
                          <option
                            value="flat"
                            className="
                              text-white
                              bg-black
                            "
                          >
                            Flat
                          </option>
                          <option
                            value="percent"
                            className="
                              text-white
                              bg-black
                            "
                          >
                            Percent
                          </option>
                        </select>
                      </td>
                      <td
                        className="
                          px-6 py-4
                        "
                      >
                        <input
                          type="number"
                          className="
                            w-full
                            px-2 py-1
                            text-[#ffd700]
                            bg-black/20
                            border border-white/10 rounded-md
                          "
                        />
                      </td>
                    </tr>
                  </>
                )}

                {/* GST */}
                {activeTab === "tab4" && (
                  <tr>
                    <td
                      className="
                        px-6 py-4
                        text-gray-300
                      "
                    >
                      Goods and Service Tax
                    </td>
                    <td
                      className="
                        px-6 py-4
                      "
                    >
                      <select
                        className="
                          w-full
                          px-4 py-2
                          text-[#ffd700] text-sm
                          bg-black/40
                          border border-white/10 rounded-xl
                          appearance-none backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#ffd700]/40 focus:border-[#ffd700]/40 hover:border-white/20 transition
                        "
                      >
                        <option
                          value="flat"
                          className="
                            text-white
                            bg-black
                          "
                        >
                          Flat
                        </option>
                        <option
                          value="percent"
                          className="
                            text-white
                            bg-black
                          "
                        >
                          Percent
                        </option>
                      </select>
                    </td>
                    <td
                      className="
                        px-6 py-4
                      "
                    >
                      <input
                        type="number"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                        className="
                          w-full
                          px-2 py-1
                          text-[#ffd700]
                          bg-black/20
                          border border-white/10 rounded-md
                        "
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Submit Button */}
          <div
            className="
              text-right
            "
          >
            <Button
              type="submit"
              disabled={creating || updating}
              className="
                px-6 py-2
                text-black font-semibold
                bg-gradient-to-r from-[#ffd700]/90 to-[#d4af37]/90
                rounded-lg
                hover:opacity-90 transition
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
