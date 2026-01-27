import { useEffect, useState } from "react";
import { usePost } from "../hooks/usePost";
import Button from "../components/Button";
import { useGet } from "../hooks/useGet";
import { useToast } from "../contexts/ToastContext";

const Payoutrequest = () => {
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [payerMobile, setPayerMobile] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [payerWalletAddress, setWalletAddress] = useState("");
  //const [payerOrderId, setPayerOrderId] = useState("");
  //const [orderId, setOrderId] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [token, setToken] = useState("");
  //const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  //const intervalRef = useRef(null);

  //const [showModal, setShowModal] = useState(false);
  //const [showFormModal, setShowFormModal] = useState(false);
    
  
  const [isLoading, setIsLoading] = useState(false);

  
  const toast = useToast();

  const { execute: executePayout } = usePost("/GLIDE/create-glide-payout-widget");
  //const { execute: payoutsend } = usePost("/dashboard-payou/request");

  // useEffect(() => {
  //   const uniqueOrderId = `DSB${Date.now()}${Math.floor(Math.random() * 1000)}`;
  //   setPayerOrderId(uniqueOrderId);
  // }, []);

  const handleSubmit = async (e) => {
    if (Number(amount) < 0) {
      setAmountError("Amount must be at least ₹1");
      return;
    }
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        orderid: "DASH" + `${Date.now()}${Math.floor(Math.random() * 1000)}`,
        buyer_email: payerEmail,
        buyer_phone: payerMobile,
        amount,
        token: token
      };

      const response = await executePayout(payload);

      if (response?.status?.toLowerCase() === "success") {
        toast.success("✅ Payout Completed");
        resetForm();
        //setShowModal(false);
      } else if (response?.status?.toLowerCase() === "pending") {
        toast.info("⏳ Payout Initiated (Pending Confirmation)");
        //setShowModal(false);
      } else {
        toast.error(response?.message || "❌ Payout Failed");
      }
    } catch (err) {
      console.error("payout error", err);
      toast.error("Payout Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setPayerMobile("");
    setPayerEmail("");
    setToken("");
  };


  return (
    <div className="bg-black min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl px-6 py-4">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 blur-2xl" />
        <h4 className="relative text-[#ffd700] font-bold text-2xl">
          Payout Request
        </h4>
      </div>

      {/* Form */}
      {(
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: "Amount", value: amount, set: setAmount, type: "number" },
              { label: "Mobile Number", value: payerMobile, set: setPayerMobile, type: "tel" },
              { label: "Email", value: payerEmail, set: setPayerEmail, type: "email" },
              { label: "Token", value: token, set: setToken, type: "text" },
            ].map((field, i) => (
              <div key={i} className="relative">
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => {
                    field.set(e.target.value);
                    if (field.label === "Amount") {
                      setAmountError(
                        Number(e.target.value) < 0 ? "Amount must be at least ₹1" : ""
                      );
                    }
                  }}
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-white/30 text-white py-2 focus:outline-none focus:border-yellow-400"
                />
                <label
                  className={`absolute left-0 text-sm transition-all ${
                    field.value
                      ? "-top-3 text-yellow-400"
                      : "top-2 text-white/50"
                  } peer-focus:-top-3 peer-focus:text-yellow-400`}
                >
                  {field.label}
                </label>
                {field.label === "Amount" && amountError && (
                  <p className="text-red-400 text-sm mt-1">{amountError}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handlePayinSubmit}
              className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-black font-semibold px-8 py-2 rounded-xl shadow-lg hover:opacity-90 transition"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      )}

      {/* Success */}
      {/* {showSuccess && (
        <div className="flex justify-center">
          <div className="bg-green-500/10 backdrop-blur-xl border border-green-400/20 rounded-full w-72 h-72 shadow-xl flex items-center justify-center">
            <h2 className="text-green-400 font-bold text-xl">
              Payment Successful!
            </h2>
          </div>
        </div>
      )} */}

      {/* Failed */}
      {showFailed && (
        <div className="flex justify-center">
          <div className="bg-red-500/10 backdrop-blur-xl border border-red-400/20 rounded-full w-72 h-72 shadow-xl flex flex-col items-center justify-center">
            <h2 className="text-red-400 font-bold text-xl">Payment Failed</h2>
            <p className="text-red-300 text-sm mt-1">Please try again</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payoutrequest;
