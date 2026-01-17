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

  const companyFields = [
    { name: "company_pan_no", label: "Company PAN" },
    {
      name: "company_pan_no_doc",
      label: "PAN Image",
      type: "file",
      file: true,
    },

    { name: "company_gst_no", label: "GST Number" },
    {
      name: "company_gst_no_doc",
      label: "GST Document",
      type: "file",
      file: true,
    },

    { name: "cin_llpin", label: "CIN / LLPIN" },

    {
      name: "company_type",
      label: "Company Type",
      type: "select",
      options: [
        "Proprietorship",
        "Partnership",
        "Private Limited",
        "Public Limited",
        "BOI",
        "LLP",
        "AOP",
        "AJP",
        "HUF",
        "Society",
        "Government",
        "Trust",
      ],
    },

    {
      name: "date_of_incorporation",
      label: "Date of Incorporation",
      type: "date",
    },

    { name: "account_holder_name", label: "Account Holder Name" },
    { name: "bank_account_no", label: "Account Number", type: "number" },
    { name: "ifsc_code", label: "IFSC Code" },

    {
      name: "cancel_cheque_doc",
      label: "Cancelled Cheque Image",
      type: "file",
      file: true,
    },

    { name: "website_url", label: "Website URL", type: "url" },
  ];

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

    try {
      const formData = new FormData();

      // Append normal fields
      Object.entries(memberFormData).forEach(([key, value]) => {
        if (key === "director_info") return; // handle separately

        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value ?? "");
        }
      });

      // Append directors
      memberFormData.director_info.forEach((director, index) => {
        Object.entries(director).forEach(([key, value]) => {
          if (value instanceof File) {
            formData.append(`director_info[${index}][${key}]`, value);
          } else {
            formData.append(`director_info[${index}][${key}]`, value ?? "");
          }
        });
      });

      // 🔥 PRINT SUBMITTED DATA
      console.group("Submitted Member Onboard Data");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      console.groupEnd();

      // API call
      console.log("===== Form Submission End =====");

      await executeMember(formData);
      toast.success("Form submitted successfully!");
      navigate("/member-list");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // const companyFields = [
  //   { name: "company_pan_no", label: "Company PAN" },
  //   {
  //     name: "company_pan_no_doc",
  //     label: "PAN Image",
  //     type: "file",
  //     file: true,
  //   },

  //   { name: "gst_no", label: "GST Number" },
  //   { name: "gst_no_doc", label: "GST Document", type: "file", file: true },

  //   { name: "cin_no", label: "CIN Number" },

  //   {
  //     name: "company_type",
  //     label: "Company Type",
  //     type: "select",
  //     options: [
  //       "Proprietorship",
  //       "Partnership",
  //       "Private Limited",
  //       "Public Limited",
  //       "BOI",
  //       "LLP",
  //       "AOP",
  //       "AJP",
  //       "HUF",
  //       "Society",
  //       "Government",
  //       "Trust",
  //     ],
  //   },

  //   {
  //     name: "date_of_incorporation",
  //     label: "Date of Incorporation",
  //     type: "date",
  //   },

  //   { name: "account_holder_name", label: "Account Holder Name" },
  //   { name: "account_number", label: "Account Number", type: "number" },
  //   { name: "ifsc_code", label: "IFSC Code" },

  //   {
  //     name: "cancel_cheque_img",
  //     label: "Cancelled Cheque Image",
  //     type: "file",
  //     file: true,
  //   },

  //   { name: "website_url", label: "Website URL", type: "url" },
  // ];

  return (
    <div
      className="
        min-h-screen
        p-6
        bg-black
        relative
      "
    >
      {/* Radial warm glow behind form */}
      <div
        className="
          bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15),transparent)]
          absolute inset-0 blur-3xl -z-10
        "
      ></div>

      {/* Header */}
      <div
        className="
          flex
          mb-6 p-4
          bg-white/5
          border border-white/10 rounded-2xl
          shadow-xl
          backdrop-blur-xl justify-between items-center
        "
      >
        <h4
          className="
            font-semibold text-[#FFD700] text-lg
          "
        >
          Add New Merchant Details
        </h4>
      </div>

      <Stepper currentStep={currentStep} />

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="
          p-6 mt-4 space-y-6
          bg-white/5
          border border-white/10 rounded-2xl
          shadow-xl
          backdrop-blur-xl
        "
      >
        {/* STEP 1 */}
        {currentStep === 1 && (
          <div
            className="
              grid
              gap-6
              md:grid-cols-2
            "
          >
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
              <div
                key={field.name}
                className="
                  relative
                "
              >
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={memberFormData[field.name]}
                  onChange={handleChange}
                  placeholder=" "
                  className={`
                    w-full
                    px-4 pt-5 pb-2
                    text-[#FFD700] text-sm
                    bg-black/20
                    rounded-2xl border
                    peer backdrop-blur-md
                    ${
                      errors?.[field.name]
                        ? "border-red-500"
                        : "border-white/10"
                    }
                  `}
                />
                <label
                  className="
                    px-2
                    text-sm text-[#FFD700]/70
                    bg-black/20
                    absolute left-4 top-1.5 rounded peer-focus:text-[#FFD700]
                  "
                >
                  {field.label}{" "}
                  <span
                    className="
                      text-red-500
                    "
                  >
                    *
                  </span>
                </label>
                {errors?.[field.name] && (
                  <span
                    className="
                      text-xs text-red-500
                    "
                  >
                    {errors[field.name]}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div
            className="
              grid
              gap-6
              md:grid-cols-2
            "
          >
            {companyFields.map((field) => (
              <div
                key={field.name}
                className="
                  relative
                "
              >
                {/* FILE INPUT */}
                {field.file ? (
                  <input
                    type="file"
                    name={field.name}
                    onChange={handleCompanyFileChange}
                    className={`
                      w-full
                      px-4 py-2
                      text-[#FFD700] text-sm
                      bg-black/20
                      rounded-2xl border
                      backdrop-blur-md
                      ${
                        errors?.[field.name]
                          ? "border-red-500"
                          : "border-white/10"
                      }
                    `}
                  />
                ) : field.type === "select" ? (
                  /* SELECT INPUT */
                  <select
                    name={field.name}
                    value={memberFormData[field.name]}
                    onChange={handleChange}
                    className={`
                      w-full
                      px-4 pt-5 pb-2
                      text-[#FFD700] text-sm
                      bg-black/20
                      rounded-2xl border
                      peer backdrop-blur-md
                      ${
                        errors?.[field.name]
                          ? "border-red-500"
                          : "border-white/10"
                      }
                    `}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  /* NORMAL INPUT */
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={memberFormData[field.name]}
                    onChange={handleChange}
                    placeholder=" "
                    className={`
                      w-full
                      px-4 pt-5 pb-2
                      text-[#FFD700] text-sm
                      bg-black/20
                      rounded-2xl border
                      peer backdrop-blur-md
                      ${
                        errors?.[field.name]
                          ? "border-red-500"
                          : "border-white/10"
                      }
                    `}
                  />
                )}

                {/* LABEL (hide for file input) */}
                {!field.file && (
                  <label
                    className="
                      px-2
                      text-sm text-[#FFD700]/70
                      bg-black/20
                      absolute left-4 top-1.5 rounded peer-focus:text-[#FFD700]
                    "
                  >
                    {field.label}{" "}
                    <span
                      className="
                        text-red-500
                      "
                    >
                      *
                    </span>
                  </label>
                )}

                {/* ERROR */}
                {errors?.[field.name] && (
                  <span
                    className="
                      text-xs text-red-500
                    "
                  >
                    {errors[field.name]}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 &&
          memberFormData.director_info.map((director, index) => (
            <div
              key={index}
              className="
                grid
                pb-6
                border-b border-white/10
                gap-6
                md:grid-cols-2
              "
            >
              {/* Director Name */}
              <input
                type="text"
                name="director_name"
                value={director.director_name}
                onChange={(e) => handleDirectorChange(index, e)}
                placeholder="Director Name"
                className="
                  p-3
                  text-[#FFD700]
                  bg-black/20
                  border border-white/10 rounded-2xl
                  backdrop-blur-md
                "
              />

              {/* Gender */}
              <select
                name="director_gender"
                value={director.director_gender}
                onChange={(e) => handleDirectorChange(index, e)}
                className="
                  p-3
                  text-[#FFD700]
                  bg-black/20
                  border border-white/10 rounded-2xl
                  backdrop-blur-md
                "
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              {/* PAN Number */}
              <input
                type="text"
                name="director_pan_no"
                value={director.director_pan_no}
                onChange={(e) => handleDirectorChange(index, e)}
                placeholder="PAN Number"
                className="
                  p-3
                  text-[#FFD700]
                  bg-black/20
                  border border-white/10 rounded-2xl
                  backdrop-blur-md
                "
              />

              {/* PAN Document */}
              <input
                type="file"
                name="user_pan_doc"
                onChange={(e) => handleDirectorFileChange(index, e)}
                className="
                  p-3
                  text-[#FFD700]
                  bg-black/20
                  border border-white/10 rounded-2xl
                  backdrop-blur-md
                "
              />

              {/* Aadhaar Number */}
              <input
                type="text"
                name="director_aadhar_no"
                value={director.director_aadhar_no}
                onChange={(e) => handleDirectorChange(index, e)}
                placeholder="Aadhaar Number"
                className="
                  p-3
                  text-[#FFD700]
                  bg-black/20
                  border border-white/10 rounded-2xl
                  backdrop-blur-md
                "
              />

              {/* Aadhaar Document */}
              <input
                type="file"
                name="user_addhar_doc"
                onChange={(e) => handleDirectorFileChange(index, e)}
                className="
                  p-3
                  text-[#FFD700]
                  bg-black/20
                  border border-white/10 rounded-2xl
                  backdrop-blur-md
                "
              />

              {/* Date of Birth */}
              <input
                type="date"
                name="director_dob"
                value={director.director_dob}
                onChange={(e) => handleDirectorChange(index, e)}
                className="
                  p-3
                  text-[#FFD700]
                  bg-black/20
                  border border-white/10 rounded-2xl
                  backdrop-blur-md
                "
              />

              {/* Delete Button */}
              {memberFormData.director_info.length === 1 ? (
                <span></span>
              ) : (
                <Button
                  type="button"
                  onClick={() => removeDirector(index)}
                  className="
                  px-4 py-2
                  text-red-500
                  border border-red-500 rounded-2xl
                  hover:bg-red-600 hover:text-white
                  md:col-span-2
                "
                >
                  Delete Director
                </Button>
              )}
            </div>
          ))}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pay-in at Onboard */}
            <select
              name="payin_at_onboard"
              value={memberFormData.payin_at_onboard}
              onChange={handleChange}
              className="w-full px-4 py-3 text-[#FFD700] text-sm bg-black/40 border border-white/10 rounded-2xl appearance-none backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700]/40 focus:border-[#FFD700]/40 hover:border-white/20 transition"
            >
              <option value="" className="text-gray-400 bg-black">
                Select Pay-in Bank
              </option>
              {payinBanks?.data.map((b) => (
                <option
                  key={b.id}
                  value={b.onboard_payin_bank}
                  className="text-white bg-black"
                >
                  {b.onboard_payin_bank}
                </option>
              ))}
            </select>

            {/* Pay-out at Onboard */}
            <select
              name="payout_at_onboard"
              value={memberFormData.payout_at_onboard}
              onChange={handleChange}
              className="w-full px-4 py-3 text-[#FFD700] text-sm bg-black/40 border border-white/10 rounded-2xl appearance-none backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700]/40 focus:border-[#FFD700]/40 hover:border-white/20 transition"
            >
              <option value="" className="text-gray-400 bg-black">
                Select Pay-out Bank
              </option>
              {payoutBanks?.data.map((b) => (
                <option
                  key={b.id}
                  value={b.onboard_payout_bank}
                  className="text-white bg-black"
                >
                  {b.onboard_payout_bank}
                </option>
              ))}
            </select>

            {/* Scheme */}
            <select
              name="scheme_id"
              value={memberFormData.scheme_id}
              onChange={handleChange}
              className="w-full px-4 py-3 text-[#FFD700] text-sm bg-black/40 border border-white/10 rounded-2xl appearance-none backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700]/40 focus:border-[#FFD700]/40 hover:border-white/20 transition md:col-span-2"
            >
              <option value="" className="text-gray-400 bg-black">
                Select Scheme
              </option>
              {schemes?.data.map((s) => (
                <option key={s.id} value={s.id} className="text-white bg-black">
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div
          className="
            flex flex-wrap
            mt-6 pt-4
            border-t border-white/10
            justify-between items-center gap-4
          "
        >
          <div
            className="
              flex
              gap-3
            "
          >
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`
                px-5 py-2.5
                rounded-2xl
                ${
                  currentStep === 1
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-black/20 border border-white/10 text-[#FFD700] hover:bg-[#FFD700] hover:text-black"
                }
              `}
            >
              ← Prev
            </button>

            {currentStep < 4 && (
              <button
                type="button"
                onClick={handleNext}
                className="
                  px-5 py-2.5
                  text-black font-semibold
                  bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400
                  rounded-2xl
                "
              >
                Next →
              </button>
            )}

            {currentStep === 4 && (
              <button
                type="submit"
                className="
                  px-6 py-2.5
                  text-black font-semibold
                  bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400
                  rounded-2xl
                "
              >
                Submit
              </button>
            )}
          </div>

          <div
            className="
              flex
              gap-3
            "
          >
            {currentStep === 3 && (
              <Button
                type="button"
                onClick={addDirector}
                className="
                  px-4 py-2
                  text-[#FFD700]
                  border border-[#FFD700] rounded-2xl
                  hover:bg-[#FFD700] hover:text-black
                "
              >
                + Add Director
              </Button>
            )}

            <Button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="
                px-5 py-2.5
                text-red-500
                border border-red-500 rounded-2xl
                hover:bg-red-600 hover:text-white
              "
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
