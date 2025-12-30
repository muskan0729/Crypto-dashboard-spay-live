import React, { useEffect, useState } from "react";
import { Stepper } from "../components/Stepper";
import { SchemeModal } from "../components/SchemeModal";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { BankModal } from "../components/BankModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";

export const MemberOnboardForm = () => {
  const [errors, setErrors] = useState();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [showPayinModal, setShowPayinModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState("payin");
  const toast = useToast();
  const [airpayMids, setAirpayMids] = useState([]);

  const [memberFormData, setMemberFormData] = useState({
    name: "",
    mobile_no: "",
    email: "",
    business_mcc: "",
    city: "",
    district: "",
    state: "",
    pin_code: "",
    address: "",
    company_pan_no: "",
    company_gst_no: "",
    cin_llpin: "",
    account_holder_name: "",
    bank_account_no: "",
    ifsc_code: "",
    website_url: "",
    company_type: "",
    date_of_incorporation: "",
    cancel_cheque_doc: null,
    company_pan_no_doc: null,
    company_gst_no_doc: null,
    director_info: [
      {
        director_name: "",
        director_pan_no: "",
        director_aadhar_no: "",
        director_gender: "",
        director_dob: "",
        user_pan_doc: null,
        user_addhar_doc: null,
      },
    ],
    payin_at_onboard: "",
    payout_at_onboard: "",
    scheme_id: "",
  });

  const stepRequiredFields = {
    1: [
      "name",
      "mobile_no",
      "email",
      "business_mcc",
      "city",
      "district",
      "state",
      "pin_code",
      "address",
    ],
    2: [
      "company_pan_no",
      "company_gst_no",
      "cin_llpin",
      "account_holder_name",
      "bank_account_no",
      "ifsc_code",
      "website_url",
      "company_type",
      "date_of_incorporation",
      "company_pan_no_doc",
      "company_gst_no_doc",
      "cancel_cheque_doc",
    ],
    3: [
      "director_name",
      "director_pan_no",
      "director_aadhar_no",
      "director_gender",
      "director_dob",
      "user_pan_doc",
      "user_addhar_doc",
    ],
    4: ["payin_at_onboard", "payout_at_onboard", "scheme_id"],
  };

  const navigate = useNavigate();
  const { data: payoutBanks, refetch: refetchPayout } = useGet(
    "/payoutbanks-List?status=1"
  );
  const {
    data: midCredentials,
    refetch: refetchCredentials,
    isLoading,
  } = useGet("/credentials");

  const { data: payinBanks, refetch: refetchPayin } = useGet(
    "/payinbanks-List?status=1"
  );
  const { data: schemes, refetch: refetchScheme } = useGet("/get-scheme");

  const { execute: executeMember } = usePost("/onboard-merchant");

  const handleSchemeModal = () => setShowSchemeModal(!showSchemeModal);
  const handlePayoutModal = () => {
    setShowPayoutModal(!showPayoutModal);
    setActiveTab("payout");
  };
  const handlePayinModal = () => {
    setShowPayinModal(!showPayinModal);
    setActiveTab("payin");
  };
  const handlePrev = () => currentStep > 1 && setCurrentStep(currentStep - 1);
  const handleNext = () => currentStep < 4 && setCurrentStep(currentStep + 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "credentials_id" ? parseInt(value, 10) || "" : value;
    if (name === "payin_at_onboard" && value === "Airpay") refetchCredentials();
    setMemberFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleDirectorChange = (index, e) => {
    const { name, value, files } = e.target;
    setMemberFormData((prev) => {
      const updatedDirectors = [...prev.director_info];
      updatedDirectors[index][name] = files ? files[0] : value;
      return { ...prev, director_info: updatedDirectors };
    });
  };

  const addDirector = () => {
    setMemberFormData((prev) => ({
      ...prev,
      director_info: [
        ...prev.director_info,
        {
          director_name: "",
          director_gender: "",
          director_pan_no: "",
          director_aadhar_no: "",
          user_pan_doc: null,
          user_addhar_doc: null,
          director_dob: "",
        },
      ],
    }));
  };

  const removeDirector = (index) => {
    setMemberFormData((prev) => ({
      ...prev,
      director_info: prev.director_info.filter((_, i) => i !== index),
    }));
  };

  const handleCompanyFileChange = (e) => {
    const { name, files } = e.target;
    setMemberFormData((prev) => ({ ...prev, [name]: files?.[0] || null }));
  };

  const handleDirectorFileChange = (index, e) => {
    const { name, files } = e.target;
    setMemberFormData((prev) => {
      const updatedDirectors = [...prev.director_info];
      updatedDirectors[index][name] = files?.[0] || null;
      return { ...prev, director_info: updatedDirectors };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation omitted for brevity
    try {
      const formData = new FormData();
      // append form fields
      await executeMember(formData);
      toast.success("Form submitted successfully!");
      navigate("/member-list");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 relative">
      {/* Radial warm glow behind form */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15),transparent)] blur-3xl -z-10"></div>

      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex justify-between items-center mb-6 p-4">
        <h4 className="font-semibold text-[#FFD700] text-lg">
          Add New Merchant Details
        </h4>
      </div>

      <Stepper currentStep={currentStep} />

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 mt-4 space-y-6"
      >
        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { name: "name", label: "Business Name" },
              { name: "mobile_no", label: "Business Mobile", type: "number" },
              { name: "email", label: "Business Email", type: "email" },
              { name: "business_mcc", label: "Business MCC", type: "number" },
              { name: "city", label: "City" },
              { name: "state", label: "State" },
              { name: "district", label: "District" },
              { name: "pin_code", label: "Pincode", type: "number" },
              { name: "address", label: "Address" },
            ].map((field) => (
              <div key={field.name} className="relative">
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={memberFormData[field.name]}
                  onChange={handleChange}
                  className={`peer w-full rounded-2xl bg-black/20 backdrop-blur-md text-[#FFD700] border ${
                    errors?.[field.name] ? "border-red-500" : "border-white/10"
                  } px-4 pt-5 pb-2 text-sm`}
                  placeholder=" "
                />
                <label className="absolute left-4 top-1.5 text-sm text-[#FFD700]/70 bg-black/20 px-2 rounded peer-focus:text-[#FFD700]">
                  {field.label} <span className="text-red-500">*</span>
                </label>
                {errors?.[field.name] && (
                  <span className="text-xs text-red-500">
                    {errors[field.name]}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative">
              <input
                type="text"
                name="company_pan_no"
                value={memberFormData.company_pan_no}
                onChange={handleChange}
                className="peer w-full rounded-2xl bg-black/20 backdrop-blur-md text-[#FFD700] border border-white/10 px-4 pt-5 pb-2 text-sm"
                placeholder=" "
              />
              <label className="absolute left-4 top-1.5 text-sm text-[#FFD700]/70 bg-black/20 px-2 rounded">
                Company PAN <span className="text-red-500">*</span>
              </label>
            </div>

            <input
              type="file"
              name="company_pan_no_doc"
              onChange={handleCompanyFileChange}
              className="w-full rounded-2xl bg-black/20 backdrop-blur-md text-[#FFD700] border border-white/10 px-4 py-2 text-sm"
            />
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 &&
          memberFormData.director_info.map((director, index) => (
            <div
              key={index}
              className="grid gap-6 md:grid-cols-2 border-b border-white/10 pb-4"
            >
              <input
                type="text"
                name="director_name"
                value={director.director_name}
                onChange={(e) => handleDirectorChange(index, e)}
                className="bg-black/20 backdrop-blur-md text-[#FFD700] border border-white/10 rounded-2xl p-3"
                placeholder="Director Name"
              />

              <Button
                type="button"
                onClick={() => removeDirector(index)}
                className="border border-red-500 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl px-4 py-2"
              >
                Remove
              </Button>
            </div>
          ))}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <div className="grid gap-6 md:grid-cols-2">
            <select
              name="payin_at_onboard"
              value={memberFormData.payin_at_onboard}
              onChange={handleChange}
              className="
    w-full
    appearance-none
    bg-black/40
    backdrop-blur-xl
    text-[#FFD700]
    border border-white/10
    rounded-2xl
    px-4 py-3
    text-sm
    focus:outline-none
    focus:ring-2
    focus:ring-[#FFD700]/40
    focus:border-[#FFD700]/40
    hover:border-white/20
    transition
  "
            >
              <option value="" className="bg-black text-gray-400">
                Select Payin Bank
              </option>

              {payinBanks?.data.map((b) => (
                <option
                  key={b.id}
                  value={b.onboard_payin_bank}
                  className="bg-black text-white"
                >
                  {b.onboard_payin_bank}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="flex flex-wrap justify-between items-center gap-4 mt-6 border-t border-white/10 pt-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`px-5 py-2.5 rounded-2xl ${
                currentStep === 1
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-black/20 border border-white/10 text-[#FFD700] hover:bg-[#FFD700] hover:text-black"
              }`}
            >
              ← Prev
            </button>

            {currentStep < 4 && (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 text-black font-semibold"
              >
                Next →
              </button>
            )}

            {currentStep === 4 && (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 text-black font-semibold"
              >
                Submit
              </button>
            )}
          </div>

          <div className="flex gap-3">
            {currentStep === 3 && (
              <Button
                type="button"
                onClick={addDirector}
                className="border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black rounded-2xl px-4 py-2"
              >
                + Add Director
              </Button>
            )}

            <Button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="border border-red-500 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl px-5 py-2.5"
            >
              Go Back
            </Button>
          </div>
        </div>
      </form>

      {/* MODALS */}
      <SchemeModal
        showModal={showSchemeModal}
        handleModal={handleSchemeModal}
        refreshTable={refetchScheme}
      />

      {activeTab === "payin" ? (
        <BankModal
          showModal={showPayinModal}
          handleModal={handlePayinModal}
          activeTab={activeTab}
          refreshTable={refetchPayin}
        />
      ) : (
        <BankModal
          showModal={showPayoutModal}
          handleModal={handlePayoutModal}
          activeTab={activeTab}
          refreshTable={refetchPayout}
        />
      )}

      <ConfirmModal
        showConfirmModal={showConfirmModal}
        heading="Are you sure you want to go back?"
        body="If you go back, your filled data will be lost."
        handleConfirmModal={setShowConfirmModal}
        action={() => navigate("/member-list")}
      />
    </div>
  );
};
