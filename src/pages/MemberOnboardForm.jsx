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
      "company_pan_no_doc", // add file here
      "company_gst_no_doc", // add file here
      "cancel_cheque_doc", // add file here
    ],
    3: [
      "director_name",
      "director_pan_no",
      "director_aadhar_no",
      "director_gender",
      "director_dob",
      "user_pan_doc", // add director files here if required
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

  const handleSchemeModal = () => {
    setShowSchemeModal(!showSchemeModal);
  };

  const handlePayoutModal = () => {
    setShowPayoutModal(!showPayoutModal);
    setActiveTab("payout");
  };

  const handlePayinModal = () => {
    setShowPayinModal(!showPayinModal);
    setActiveTab("payin");
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = () => {
    const requiredFields = stepRequiredFields[currentStep];
    const newErrors = {};

    if (currentStep === 3) {
      memberFormData.director_info.forEach((director, idx) => {
        requiredFields.forEach((field) => {
          if (!director[field] || director[field].trim() === "") {
            if (!newErrors.director) newErrors.director = [];
            newErrors.director[idx] = {
              ...newErrors.director[idx],
              [field]: "This field is required",
            };
          }
        });
      });
    } else {
      requiredFields.forEach((field) => {
        let value;

        value = memberFormData[field];

        if (!value || value === "") {
          newErrors[field] = `This field is required`;
        }
      });
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // true if no errors
  };

  const handleNext = () => {
    // if (validateStep()) {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
    // }
  };
  useEffect(() => {
    if (memberFormData.payin_at_onboard !== "Airpay") return; // only run for Airpay
    if (isLoading) return; // wait for API
    const credentialsData = midCredentials?.data || [];
    if (credentialsData.length > 0) {
      setAirpayMids(credentialsData);
      console.log("✅ credentials loaded:", credentialsData);
    } else {
      console.warn("⚠️ no credentials found yet");
      setAirpayMids([]);
    }
  }, [memberFormData.payin_at_onboard, midCredentials, isLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert credentials_id to integer
    const newValue =
      name === "credentials_id" ? parseInt(value, 10) || "" : value;

    if (name === "payin_at_onboard" && value === "Airpay") {
      refetchCredentials();
    }

    setMemberFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleDirectorChange = (index, e) => {
    const { name, value, files } = e.target;
    setMemberFormData((prev) => {
      const updatedDirectors = [...prev.director_info];
      updatedDirectors[index] = {
        ...updatedDirectors[index],
        [name]: files ? files[0] : value,
      };
      return { ...prev, director_info: updatedDirectors };
    });
    console.log(`Director ${index} ${name}:`, files ? files[0] : value);
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
    setMemberFormData((prev) => ({
      ...prev,
      [name]: files?.[0] || null, // only keep real file
    }));
    console.log(name, files?.[0]); // verify
  };

  const handleDirectorFileChange = (index, e) => {
    const { name, files } = e.target;
    setMemberFormData((prev) => {
      const updatedDirectors = [...prev.director_info];
      updatedDirectors[index][name] = files?.[0] || null;
      return { ...prev, director_info: updatedDirectors };
    });
    console.log(`Director ${index} ${name}`, files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    try {
      const formData = new FormData();

      console.log("===== Form Submission Start =====");

      // Append text fields (excluding files and directors)
      Object.keys(memberFormData).forEach((key) => {
        if (
          ![
            "director_info",
            "company_pan_no_doc",
            "company_gst_no_doc",
            "cancel_cheque_doc",
          ].includes(key)
        ) {
          formData.append(key, memberFormData[key]);
          console.log(`[Text] ${key}:`, memberFormData[key]);
        }
      });

      // Append company files
      ["company_pan_no_doc", "company_gst_no_doc", "cancel_cheque_doc"].forEach(
        (fileKey) => {
          if (memberFormData[fileKey] instanceof File) {
            formData.append(fileKey, memberFormData[fileKey]);
            console.log(`[File] ${fileKey}:`, memberFormData[fileKey].name);
          }
        }
      );

      // Append directors correctly
      memberFormData.director_info.forEach((director, idx) => {
        Object.keys(director).forEach((field) => {
          const value = director[field];
          if (value instanceof File) {
            formData.append(`director_info[${idx}][${field}]`, value);
            console.log(`[File] director_info[${idx}][${field}]:`, value.name);
          } else {
            formData.append(`director_info[${idx}][${field}]`, value);
            console.log(`[Text] director_info[${idx}][${field}]:`, value);
          }
        });
      });

      console.log("===== Form Submission End =====");

      await executeMember(formData);
      toast.success("Form submitted successfully!");
      navigate("/member-list");
    } catch (err) {
      const errors = err?.response?.data?.errors;
      const msg = errors
        ? Object.values(errors)[0][0]
        : err?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      {/* HEADER */}
      <div
        className="bg-gradient-to-r from-black via-[#111] to-black
                  border border-[#d4af37]/40
                  flex justify-between items-center
                  mb-4 p-4 rounded-lg
                  shadow-[0_0_20px_rgba(212,175,55,0.25)]"
      >
        <h4 className="font-semibold text-[#d4af37] text-lg">
          Add New Merchant Details
        </h4>
      </div>

      <Stepper currentStep={currentStep} />

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-black border border-[#d4af37]/30 rounded-xl p-6 mt-4"
      >
        {/* ---------------- STEP 1 ---------------- */}
        {currentStep === 1 && (
          <div className="grid gap-6 mb-6 md:grid-cols-2">
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
                  className={`block px-3 pb-2.5 pt-4 w-full text-sm
                          bg-black text-[#d4af37]
                          rounded-lg border appearance-none peer
                          ${errors?.[field.name]
                      ? "border-red-500"
                      : "border-[#d4af37]/40"
                    }`}
                  placeholder=""
                />
                <label
                  className="absolute text-sm text-[#d4af37]/70 duration-300
                              transform -translate-y-4 scale-75 top-2 z-10
                              bg-black px-2 peer-focus:text-[#d4af37]"
                >
                  {field.label} <span className="text-red-500">*</span>
                </label>
                {errors?.[field.name] && (
                  <span className="text-sm text-red-500">
                    {errors[field.name]}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ---------------- STEP 2 ---------------- */}
        {currentStep === 2 && (
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div className="relative">
              <input
                type="text"
                name="company_pan_no"
                value={memberFormData.company_pan_no}
                onChange={handleChange}
                className="block px-3 pb-2.5 pt-4 w-full text-sm
                       bg-black text-[#d4af37]
                       border border-[#d4af37]/40 rounded-lg peer"
              />
              <label className="absolute text-sm text-[#d4af37]/70 bg-black px-2 top-2">
                Company PAN <span className="text-red-500">*</span>
              </label>
            </div>

            <input
              type="file"
              name="company_pan_no_doc"
              onChange={handleCompanyFileChange}
              className="block w-full text-sm
                     bg-black text-[#d4af37]
                     border border-[#d4af37]/40 rounded-lg"
            />
          </div>
        )}

        {/* ---------------- STEP 3 ---------------- */}
        {currentStep === 3 &&
          memberFormData.director_info.map((director, index) => (
            <div
              key={index}
              className="grid gap-6 mb-6 md:grid-cols-2
                     border-b border-[#d4af37]/20 pb-4"
            >
              <input
                type="text"
                value={director.director_name}
                onChange={(e) => handleDirectorChange(index, e)}
                className="bg-black text-[#d4af37]
                       border border-[#d4af37]/40
                       rounded-lg p-3"
                placeholder="Director Name"
              />

              <Button
                type="button"
                onClick={() => removeDirector(index)}
                className="border border-red-500 text-red-500
                       hover:bg-red-600 hover:text-white
                       rounded-lg px-4 py-2"
              >
                Remove
              </Button>
            </div>
          ))}

        {/* ---------------- STEP 4 ---------------- */}
        {currentStep === 4 && (
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <select
              name="payin_at_onboard"
              value={memberFormData.payin_at_onboard}
              onChange={handleChange}
              className="bg-black text-[#d4af37]
                     border border-[#d4af37]/40
                     rounded-lg p-3"
            >
              <option value="">Select Payin Bank</option>
              {payinBanks?.data.map((b) => (
                <option key={b.id} value={b.onboard_payin_bank}>
                  {b.onboard_payin_bank}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ---------------- FOOTER ACTIONS ---------------- */}
        <div
          className="flex flex-wrap justify-between items-center gap-4
                    mt-6 border-t border-[#d4af37]/30 pt-4"
        >
          {/* LEFT */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`px-5 py-2.5 rounded-lg
            ${currentStep === 1
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-black border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                }`}
            >
              ← Prev
            </button>

            {currentStep < 4 && (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-lg
                       bg-gradient-to-r from-[#d4af37] to-[#b8962e]
                       text-black font-semibold"
              >
                Next →
              </button>
            )}

            {currentStep === 4 && (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg
                       bg-gradient-to-r from-[#d4af37] to-[#b8962e]
                       text-black font-semibold"
              >
                Submit
              </button>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex gap-3">
            {currentStep === 3 && (
              <Button
                type="button"
                onClick={addDirector}
                className="border border-[#d4af37]
                       text-[#d4af37]
                       hover:bg-[#d4af37] hover:text-black
                       rounded-lg px-4 py-2"
              >
                + Add Director
              </Button>
            )}

            {/* GO BACK */}
            <Button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="border border-red-500 text-red-500
                     hover:bg-red-600 hover:text-white
                     rounded-lg px-5 py-2.5"
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
