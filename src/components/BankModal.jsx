import Button from "./Button";
import { usePost } from "../hooks/usePost";
import { useEffect, useState } from "react";

export const BankModal = ({
  showModal,
  handleModal,
  activeTab,
  refreshTable,
}) => {
  const apiEndPoint =
    activeTab === "payin" ? "/onboard-payinbank" : "/onboard-payoutbank";
  const [bankName, setBankName] = useState("");
  const {
    error,
    execute: onBoardBank,
    loading,
    setError,
  } = usePost(apiEndPoint);

  useEffect(() => {
    if (showModal) {
      setBankName("");
      setError(null);
    }
  }, [showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload =
      activeTab === "payin"
        ? { onboard_payin_bank: bankName }
        : { onboard_payout_bank: bankName };

    try {
      const response = await onBoardBank(payload);
      if (response) {
        handleModal(false);
        setBankName(" ");
        if (refreshTable) refreshTable();
      }
    } catch (err) {
      console.log("Login failed:", err);
    }
  };

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => handleModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
      relative w-full max-w-3xl mx-4
      bg-white/5 backdrop-blur-xl
      border border-white/10
      rounded-2xl shadow-2xl
      overflow-hidden transition-all
    "
          >
            {/* Header */}
            <div className="relative flex justify-between items-center px-6 py-4">
              {/* Gradient Glow */}
              <div className="absolute inset-0 " />

              <h4 className="relative text-lg font-bold text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.35)]">
                {activeTab === "payin" ? "Add Payin Bank" : "Add Payout Bank"}
              </h4>

              <Button
                onClick={() => handleModal(false)}
                className="
          relative w-9 h-9 flex items-center justify-center
          rounded-full bg-black/30 border border-white/10
          text-white transition-all duration-200
          hover:bg-red-500 hover:text-black hover:scale-105
          active:scale-95 shadow-sm
        "
              >
                <i className="fa-solid fa-xmark fa-lg" />
              </Button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            {/* Form Body */}
            <form className="p-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-1 gap-6">
                {/* Bank Name */}
                <div className="relative w-full group">
                  <input
                    type="text"
                    name={
                      activeTab === "payin"
                        ? "onboard_payin_bank"
                        : "onboard_payout_bank"
                    }
                    id="floating_bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder=" "
                    required
                    className={`
              block w-full py-2.5 px-0 text-sm text-[#FFD700]
              bg-black/20 border-0 border-b-2 rounded-md
              appearance-none focus:outline-none focus:ring-0
              peer transition-colors
              ${
                error?.error
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#FFD700]/50 focus:border-[#FFD700]"
              }
            `}
                  />
                  <label
                    htmlFor="floating_bank"
                    className="
              absolute text-sm text-[#FFD700]/70 duration-300
              transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]
              peer-focus:scale-75 peer-focus:-translate-y-6
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
              peer-focus:text-[#FFD700]
            "
                  >
                    Bank Name
                  </label>
                  {error?.error && (
                    <p className="mt-1 text-sm text-red-500">{error.error}</p>
                  )}
                </div>

                {/* Bank Type */}
                <div className="relative w-full">
                  <label className="block text-sm font-medium text-[#FFD700]/70 mb-1">
                    Bank Type
                  </label>
                  <div className="w-full border border-[#FFD700]/50 rounded-md p-2 text-sm bg-black/20 text-[#FFD700]">
                    {activeTab === "payin" ? "Payin" : "Payout"}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className={`
            w-full sm:w-auto px-5 py-2.5 text-sm font-medium
            rounded-2xl
            bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400
            text-black shadow-md
            transition-all duration-200
            hover:opacity-90 hover:shadow-lg
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
          `}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
