import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import { usePost } from "../hooks/usePost";
import { useGet } from "../hooks/useGet";
import { useToast } from "../contexts/ToastContext";
import { TableSkeleton } from "../components/TableSkeleton";

const Payoutrequest = () => {
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("IMPS");
  const [isLoading, setIsLoading] = useState(false);

  const [amountError, setAmountError] = useState("");
  const [beneEmailError, setbeneEmailError] = useState("");
  const [benephoneError, setbenephoneError] = useState("");

  const [AddACcont, setAddAccount] = useState("");
  const [AddIfsc, setAddIfsc] = useState("");
  const [AddUpi, setAddUpi] = useState("");
  const [AddBeneName, setAddBeneName] = useState("");
  const [beneMobile, setBeneMobile] = useState("");
  const [AddBeneEmail, setBeneEmail] = useState("");
  const [AddBank, setAddBank] = useState("");
  const [AddAddress, setAddAddress] = useState("");

  const [beneficiary, setbeneficiary] = useState([]);
  const toast = useToast();

  const { data, loading, error, refetch } = useGet("/beneficiary-List");

  useEffect(() => {
    if (data?.data) {
      setbeneficiary(data.data);
    }
  }, [data]);

  const { execute: payoutsend } = usePost("/dashboard-payou/request");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!selectedUser) return;
    try {
      const payload = {
        orderid: "DASH" + Date.now(),
        email: selectedUser.beneficiary_email_id,
        mobile: selectedUser.beneficiary_mobile_no,
        amount,
        account: selectedUser.account_no,
        ifsc: selectedUser.ifsc_code,
        name: selectedUser.beneficiary_name,
        mode: paymentMode,
      };

      const response = await payoutsend(payload);

      if (response?.status?.toLowerCase() === "success") {
        toast.success("✅ Payout Completed");
        resetForm();
        setShowModal(false);
      } else if (response?.status?.toLowerCase() === "pending") {
        toast.info("⏳ Payout Initiated (Pending Confirmation)");
        setShowModal(false);
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
    setAddAddress("");
    setAddBank("");
    setBeneEmail("");
    setBeneMobile("");
    setAddBeneName("");
    setAddIfsc("");
    setAddAccount("");
  };

  const { execute: addbeneficiary } = usePost("/store-beneficiary-detail");

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        bank_name: AddBank,
        account_no: AddACcont,
        ifsc_code: AddIfsc,
        upi_number: AddUpi,
        beneficiary_name: AddBeneName,
        beneficiary_mobile_no: beneMobile,
        beneficiary_email_id: AddBeneEmail,
        beneficiary_address: AddAddress,
      };
      await addbeneficiary(payload);
      setShowFormModal(false);
      toast.success("Form submitted successfully!");
      resetForm();
    } catch (err) {
      toast.error("Error adding Beneficiary");
    } finally {
      setIsLoading(false);
    }
  };

  const membercolumn = [
    { header: "Sr No", accessor: "sqno" },
    { header: "Beneficiary Id", accessor: "beneficiaryid" },
    { header: "Bank Details", accessor: "bankdetails" },
    { header: "Beneficiary Details", accessor: "beneficiarydetails" },
    { header: "Action", accessor: "action" },
  ];

  const tableDataWithActions = beneficiary.map((row, index) => ({
    id: row.id,
    sqno: index + 1,
    beneficiaryid: row.id,
    bankdetails: (
      <div className="flex flex-col text-left text-white">
        <span>
          Bank Name : <b>{row.bank_name}</b>
        </span>
        <span>
          Account No : <b>{row.account_no}</b>
        </span>
        <span>
          IFSC Code : <b>{row.ifsc_code}</b>
        </span>
      </div>
    ),
    beneficiarydetails: (
      <div className="flex flex-col text-left text-white">
        <span>
          Beneficiary Name : <b>{row.beneficiary_name || "N/A"}</b>
        </span>
        <span>
          Mobile No : <b>{row.beneficiary_mobile_no || "N/A"}</b>
        </span>
        <span>
          Email Id : <b>{row.beneficiary_email_id || "N/A"}</b>
        </span>
        <span>
          Address : <b>{row.beneficiary_address || "N/A"}</b>
        </span>
      </div>
    ),
    action: (
      <Button
        onClick={() => {
          setSelectedUser(row);
          setShowModal(true);
        }}
        className="text-white bg-yellow-600 hover:bg-yellow-500 px-4 py-1 rounded-lg text-sm cursor-pointer shadow-md transition"
      >
        Send
      </Button>
    ),
  }));

  return (
    <div className="p-4 space-y-6 bg-black min-h-screen">
                {/* Fixed Background Gradient */}
          {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff4d4d]/40 via-[#ffb84d]/20 to-[#b33c00] bg-fixed"></div> */}

          {/* Ambient Glow */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2  bg-gradient-to-r from-[#ff4d4d]/30 to-[#ffb84d]/30 blur-3xl rounded-full"></div>

      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex justify-between items-center p-4">
        <h4 className="text-[#ffd700] font-bold text-xl">Beneficiary List</h4>
        <Button
          onClick={() => setShowFormModal(true)}
          className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-black font-semibold px-4 py-2 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          + Add New Beneficiary
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4 overflow-x-auto">
        {loading ? (
          <TableSkeleton />
        ) : (
          <Table
            columns={membercolumn}
            data={tableDataWithActions}
            showExport={false}
            showStatusFilter={false}
            endPoint="/delete-Beneficiary"
            refreshTable={refetch}
            className="min-w-full"
          />
        )}
      </div>

      {/* Payout Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#ffd700] font-semibold text-lg">
                Payout to Beneficiary
              </h3>
              <Button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                &times;
              </Button>
            </div>

            {/* Beneficiary Info Table */}
            <div className="overflow-x-auto mb-4">
              {selectedUser && (
                <table className="w-full text-sm text-left text-white border-collapse">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="p-2">NAME</th>
                      <th className="p-2">ACCOUNT</th>
                      <th className="p-2">IFSC</th>
                      <th className="p-2">BANK</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white/10">
                      <td className="p-2">{selectedUser.beneficiary_name}</td>
                      <td className="p-2">{selectedUser.account_no}</td>
                      <td className="p-2">{selectedUser.ifsc_code}</td>
                      <td className="p-2">{selectedUser.bank_name}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium">
                    Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option>IMPS</option>
                    <option>NEFT</option>
                    <option>UPI</option>
                    <option>RTGS</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-white bg-gray-600 rounded-lg hover:bg-red-400 transition"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`${
                    isLoading
                      ? "bg-yellow-700 cursor-not-allowed opacity-80"
                      : "bg-yellow-600 hover:bg-yellow-500"
                  } text-black font-medium rounded-lg px-5 py-2.5`}
                >
                  {isLoading ? "Processing..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Beneficiary Modal */}
      {showFormModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl max-w-3xl w-full mx-2 p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[#ffd700] font-bold text-lg">
                Add Beneficiary Details
              </h4>
              <Button
                onClick={() => setShowFormModal(false)}
                className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                &times;
              </Button>
            </div>
            <form onSubmit={handleAddBeneficiary} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Account No."
                  value={AddACcont}
                  onChange={(e) => setAddAccount(e.target.value)}
                  className="w-full rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Bank Name"
                  value={AddBank}
                  onChange={(e) => setAddBank(e.target.value)}
                  className="w-full rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="IFSC Code"
                  value={AddIfsc}
                  onChange={(e) => setAddIfsc(e.target.value)}
                  className="w-full rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Beneficiary Mobile"
                  value={beneMobile}
                  onChange={(e) => setBeneMobile(e.target.value)}
                  className="w-full rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {benephoneError && (
                  <p className="text-red-600 text-sm">{benephoneError}</p>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Beneficiary Name"
                  value={AddBeneName}
                  onChange={(e) => setAddBeneName(e.target.value)}
                  className="w-full rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Beneficiary Address"
                  value={AddAddress}
                  onChange={(e) => setAddAddress(e.target.value)}
                  className="w-full rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Beneficiary Email"
                  value={AddBeneEmail}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBeneEmail(value);
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(value)) {
                      setbeneEmailError("Enter a valid email address");
                    } else {
                      setbeneEmailError("");
                    }
                  }}
                  className="w-full rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {beneEmailError && (
                  <p className="text-red-600 text-sm">{beneEmailError}</p>
                )}
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`${
                    isLoading
                      ? "bg-yellow-700 cursor-not-allowed opacity-80"
                      : "bg-yellow-600 hover:bg-yellow-500"
                  } text-black font-medium rounded-lg px-5 py-2.5`}
                >
                  {isLoading ? "Processing..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payoutrequest;
