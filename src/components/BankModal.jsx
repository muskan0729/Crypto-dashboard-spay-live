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
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          onClick={() => handleModal(false)}
        >
          <div
            className="bg-black border border-[#d4af37]/60 rounded-lg shadow-lg max-w-3xl w-full mx-2 p-6 transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex justify-between items-center px-5 py-3 rounded-t-lg 
                   bg-gradient-to-r from-[#d4af37] via-[#b8962e] to-[#d4af37] text-black font-semibold"
            >
              <h4 className="text-lg font-bold">
                {activeTab === "payin" ? "Add Payin Bank" : "Add Payout Bank"}
              </h4>
              <Button
                onClick={() => handleModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-[#d4af37] font-bold text-lg shadow-md hover:bg-[#d4af37] hover:text-black transition"
              >
                <i className="fa-solid fa-xmark fa-lg"></i>
              </Button>
            </div>

            {/* Form */}
            <form className="p-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-1 gap-6 px-4">
                {/* Bank Name */}
                <div className="relative z-0 w-full mb-5 group">
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
                    className={`block py-2.5 px-0 w-full text-sm text-[#d4af37] bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer ${
                      error?.error
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#d4af37]/50 focus:border-[#d4af37]"
                    }`}
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="floating_bank"
                    className={`absolute text-sm text-[#d4af37]/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#d4af37] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}
                  >
                    Bank Name
                  </label>
                  {error?.error && (
                    <p className="mt-1 text-sm text-red-500">{error.error}</p>
                  )}
                </div>

                {/* Bank Type */}
                <div className="relative z-0 w-full mb-5 group">
                  <label className="block text-sm font-medium text-[#d4af37]/70 mb-1">
                    Bank Type
                  </label>
                  <div className="w-full border border-[#d4af37]/50 rounded-md p-2 text-sm bg-black text-[#d4af37]">
                    {activeTab === "payin" ? "Payin" : "Payout"}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className={`cursor-pointer text-black bg-gradient-to-r from-[#d4af37] via-[#b8962e] to-[#d4af37] hover:from-[#b8962e] hover:to-[#d4af37] font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
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
