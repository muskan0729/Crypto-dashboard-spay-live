// MemberOnboardForm.jsx
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
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [showPayinModal, setShowPayinModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState("payin");
  const [airpayMids, setAirpayMids] = useState([]);

  const toast = useToast();
  const navigate = useNavigate();

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
    credentials_id: "",
  });

  // Validation setup (unchanged from previous working version)
  const stepRequiredFields = {
    1: ["name", "mobile_no", "email", "business_mcc", "city", "district", "state", "pin_code", "address"],
    2: [
      "company_pan_no", "company_gst_no", "cin_llpin", "account_holder_name",
      "bank_account_no", "ifsc_code", "website_url", "company_type",
      "date_of_incorporation", "company_pan_no_doc", "company_gst_no_doc", "cancel_cheque_doc"
    ],
    3: [
      "director_name", "director_pan_no", "director_aadhar_no", "director_gender", 
      "director_dob", "user_pan_doc", "user_addhar_doc"
    ],
    4: ["payin_at_onboard", "payout_at_onboard", "scheme_id"],
  };

  const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
  const nameRegex = /^[A-Za-z ]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const textRegex = /^[A-Za-z ]+$/;
  const textNumberRegex = /^[A-Za-z0-9]+$/;
  const numberRegex = /^[0-9]{4}$/;
  const pinnumberRegex = /^[0-9]{6}$/;
  const aadharRegex = /^[0-9]{12}$/;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  const validationRules = {
    name: { required: true, pattern: nameRegex, message: "Name is not valid" },
    mobile_no: { required: true, pattern: phoneRegex, message: "Mobile number is not valid" },
    email: { required: true, pattern: emailRegex, message: "Email is not valid" },
    business_mcc: { required: true, pattern: numberRegex, message: "Business MCC must be 4 digits" },
    city: { required: true, pattern: textRegex, message: "City name is not valid" },
    state: { required: true, pattern: textRegex, message: "State name is not valid" },
    district: { required: true, pattern: textRegex, message: "District name is not valid" },
    pin_code: { required: true, pattern: pinnumberRegex, message: "Pin code must be 6 digits" },
    account_holder_name: { required: true, pattern: nameRegex, message: "Account holder name is not valid" },
    bank_account_no: { required: true, pattern: textNumberRegex, message: "Bank account number is not valid" },
    cin_llpin: { required: true, pattern: textNumberRegex, message: "CIN / LLPIN is not valid" },
    company_pan_no: { required: true, pattern: panRegex, message: "Company PAN number is not valid" },
    company_gst_no: { required: true, pattern: textNumberRegex, message: "Company GST number is not valid" },
    company_pan_no_doc: {
      required: true,
      allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
      maxSize: 2 * 1024 * 1024,
      message: "PAN document is required (PDF/JPG/PNG, max 2MB)",
    },
    company_gst_no_doc: {
      required: true,
      allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
      maxSize: 2 * 1024 * 1024,
      message: "GST document is required (PDF/JPG/PNG, max 2MB)",
    },
    cancel_cheque_doc: {
      required: true,
      allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
      maxSize: 2 * 1024 * 1024,
      message: "Cancelled cheque document is required (PDF/JPG/PNG, max 2MB)",
    },
    director_name: { required: true, pattern: nameRegex, message: "Director name is not valid" },
    director_pan_no: { required: true, pattern: panRegex, message: "Director PAN number is not valid" },
    director_aadhar_no: { required: true, pattern: aadharRegex, message: "Aadhaar number must be 12 digits" },
    user_pan_doc: {
      required: true,
      allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
      maxSize: 2 * 1024 * 1024,
      message: "Director PAN document is required (PDF/JPG/PNG, max 2MB)",
    },
    user_addhar_doc: {
      required: true,
      allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
      maxSize: 2 * 1024 * 1024,
      message: "Director Aadhaar document is required (PDF/JPG/PNG, max 2MB)",
    },
  };

  const validateFileValue = (file, rules) => {
    if (rules?.required && !file) return rules.message || "File is required";
    if (file && rules?.allowedTypes && !rules.allowedTypes.includes(file.type)) return "Invalid file type";
    if (file && rules?.maxSize && file.size > rules.maxSize) return "File size exceeds limit";
    return null;
  };

  const validateValue = (value, field) => {
    const rules = validationRules[field];
    if (value instanceof File || rules?.allowedTypes || rules?.maxSize) {
      return validateFileValue(value, rules);
    }
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return "This field is required.";
    }
    if (rules?.pattern && typeof value === "string" && !rules.pattern.test(value.trim())) {
      return rules.message || "Invalid format";
    }
    return null;
  };

  const validateStep = () => {
    const requiredFields = stepRequiredFields[currentStep];
    const newErrors = {};

    if (currentStep === 3) {
      memberFormData.director_info.forEach((director, idx) => {
        requiredFields.forEach((field) => {
          const error = validateValue(director[field], field);
          if (error) {
            if (!newErrors.director) newErrors.director = [];
            newErrors.director[idx] = { ...newErrors.director[idx], [field]: error };
          }
        });
      });
    } else {
      requiredFields.forEach((field) => {
        const error = validateValue(memberFormData[field], field);
        if (error) newErrors[field] = error;
      });
    }

    // Conditional validation for credentials_id in step 4
    if (currentStep === 4 && memberFormData.payin_at_onboard === "Airpay") {
      const credError = validateValue(memberFormData.credentials_id, "credentials_id");
      if (credError) newErrors.credentials_id = credError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { data: payoutBanks, refetch: refetchPayout } = useGet("/payoutbanks-List?status=1");
  const { data: midCredentials, refetch: refetchCredentials, isLoading } = useGet("/credentials");
  const { data: payinBanks, refetch: refetchPayin } = useGet("/payinbanks-List?status=1");
  const { data: schemes, refetch: refetchScheme } = useGet("/get-scheme");
  const { execute: executeMember } = usePost("/onboard-merchant");

  useEffect(() => {
    if (memberFormData.payin_at_onboard !== "Airpay") return;
    if (isLoading) return;
    const credentialsData = midCredentials?.data || [];
    setAirpayMids(credentialsData);
  }, [memberFormData.payin_at_onboard, midCredentials, isLoading]);

  const handleSchemeModal = () => setShowSchemeModal(!showSchemeModal);
  const handlePayoutModal = () => {
    setShowPayoutModal(!showPayoutModal);
    setActiveTab("payout");
  };
  const handlePayinModal = () => {
    setShowPayinModal(!showPayinModal);
    setActiveTab("payin");
  };
  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  const handleNext = () => {
    setIsSubmitted(true);
    const isValid = validateStep();
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setErrors({});
      setIsSubmitted(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "credentials_id" ? (value ? Number(value) : "") : value;

    if (name === "payin_at_onboard" && value === "Airpay") {
      refetchCredentials();
    }

    setMemberFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCompanyFileChange = (e) => {
    const { name, files } = e.target;
    setMemberFormData((prev) => ({ ...prev, [name]: files?.[0] || null }));
  };

  const handleDirectorChange = (index, e) => {
    const { name, value, files } = e.target;
    setMemberFormData((prev) => {
      const updated = [...prev.director_info];
      updated[index] = {
        ...updated[index],
        [name]: files ? files[0] : value,
      };
      return { ...prev, director_info: updated };
    });
  };

  const handleDirectorFileChange = (index, e) => {
    const { name, files } = e.target;
    setMemberFormData((prev) => {
      const updated = [...prev.director_info];
      updated[index] = { ...updated[index], [name]: files?.[0] || null };
      return { ...prev, director_info: updated };
    });
  };

  const addDirector = () => {
    setMemberFormData((prev) => ({
      ...prev,
      director_info: [
        ...prev.director_info,
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
    }));
  };

  const removeDirector = (index) => {
    setMemberFormData((prev) => ({
      ...prev,
      director_info: prev.director_info.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!validateStep()) return;

    try {
      const formData = new FormData();

      Object.keys(memberFormData).forEach((key) => {
        if (!["director_info", "company_pan_no_doc", "company_gst_no_doc", "cancel_cheque_doc"].includes(key)) {
          formData.append(key, memberFormData[key] ?? "");
        }
      });

      ["company_pan_no_doc", "company_gst_no_doc", "cancel_cheque_doc"].forEach((fileKey) => {
        if (memberFormData[fileKey] instanceof File) {
          formData.append(fileKey, memberFormData[fileKey]);
        }
      });

      memberFormData.director_info.forEach((director, idx) => {
        Object.keys(director).forEach((field) => {
          const value = director[field];
          if (value instanceof File) {
            formData.append(`director_info[${idx}][${field}]`, value);
          } else {
            formData.append(`director_info[${idx}][${field}]`, value ?? "");
          }
        });
      });

      await executeMember(formData);
      toast.success("Form submitted successfully!");
      navigate("/member-list");
    } catch (err) {
      const serverErrors = err?.response?.data?.errors;
      const msg = serverErrors
        ? Object.values(serverErrors)[0][0]
        : err?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  };

  // ──────────────────────────────────────────────
  //                   STYLES
  // ──────────────────────────────────────────────

  const glassCard = "backdrop-blur-xl bg-black/40 border border-cyan-900/50 rounded-2xl shadow-2xl shadow-cyan-950/50 relative overflow-hidden";

  const inputBase = "bg-black border border-cyan-900/70 rounded-xl px-4 py-3.5 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 peer w-full cursor-pointer";

  const labelBase = "absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-4 left-4 bg-black px-1 peer-focus:text-cyan-400 peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:left-4 origin-[0] z-10 pointer-events-none";

  const selectBase = "bg-black border border-cyan-900/70 rounded-xl px-4 py-3.5 text-gray-100 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 appearance-none w-full cursor-pointer";

  const fileInputBase = "block w-full text-sm text-gray-300 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-900/50 file:text-cyan-200 hover:file:bg-cyan-800/60 file:transition-all file:duration-200 cursor-pointer border border-cyan-900/70 rounded-xl px-3 py-3 bg-black/40";

  const btnPrimary = "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-medium rounded-xl px-8 py-3 shadow-lg shadow-cyan-900/50 hover:shadow-cyan-600/70 transform hover:scale-[1.04] transition-all duration-300";

  const btnSecondary = "bg-white/10 hover:bg-white/15 border border-cyan-900/50 text-gray-200 font-medium rounded-xl px-8 py-3 transition-all duration-300 hover:shadow-md hover:shadow-cyan-900/40 hover:scale-[1.03]";

  const errorText = "text-red-400 text-xs mt-1 block";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f22] via-[#000814] to-black py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className={`${glassCard} p-8 text-center`}>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wider text-white drop-shadow-lg">
            Add New Merchant
          </h1>
          <p className="mt-3 text-gray-400 tracking-wide">
            Secure • Fast • Cyber-Finance Dashboard
          </p>
        </div>

        {/* Stepper */}
        <div className={glassCard}>
          <div className="p-6">
            <Stepper currentStep={currentStep} />
          </div>
        </div>

        {/* Main Form */}
        <div className={glassCard}>
          <div className="p-6 md:p-10">

            <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-cyan-300 tracking-wide text-center">
              Step {currentStep}:{" "}
              {currentStep === 1 && "Merchant Information"}
              {currentStep === 2 && "Company Information"}
              {currentStep === 3 && "Director Information"}
              {currentStep === 4 && "Scheme & Banking Selection"}
            </h2>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-10">

              {currentStep === 1 && (
                <div className="grid gap-7 md:grid-cols-2">
                  {[
                    { id: "name", label: "Business Name", type: "text" },
                    { id: "mobile_no", label: "Business Mobile", type: "tel" },
                    { id: "email", label: "Business Email", type: "email" },
                    { id: "business_mcc", label: "Business MCC", type: "text" },
                    { id: "city", label: "City", type: "text" },
                    { id: "state", label: "State", type: "text" },
                    { id: "district", label: "District", type: "text" },
                    { id: "pin_code", label: "Pincode", type: "text" },
                  ].map((field) => (
                    <div key={field.id} className="relative">
                      <input
                        type={field.type}
                        name={field.id}
                        id={field.id}
                        className={`${inputBase} ${isSubmitted && errors[field.id] ? "border-red-600" : ""}`}
                        placeholder=" "
                        value={memberFormData[field.id] ?? ""}
                        onChange={handleChange}
                      />
                      <label htmlFor={field.id} className={labelBase}>
                        {field.label} <span className="text-red-400">*</span>
                      </label>
                      {isSubmitted && errors[field.id] && <span className={errorText}>{errors[field.id]}</span>}
                    </div>
                  ))}

                  <div className="md:col-span-2 relative">
                    <textarea
                      name="address"
                      id="address"
                      rows={4}
                      className={`${inputBase} resize-none ${isSubmitted && errors.address ? "border-red-600" : ""}`}
                      placeholder=" "
                      value={memberFormData.address}
                      onChange={handleChange}
                    />
                    <label htmlFor="address" className={labelBase}>
                      Full Address <span className="text-red-400">*</span>
                    </label>
                    {isSubmitted && errors.address && <span className={errorText}>{errors.address}</span>}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid gap-7 md:grid-cols-2">
                  {[
                    { id: "company_pan_no", label: "Company PAN Number", type: "text" },
                    { id: "company_gst_no", label: "GST Number", type: "text" },
                    { id: "cin_llpin", label: "CIN / LLPIN", type: "text" },
                    { id: "account_holder_name", label: "Account Holder Name", type: "text" },
                    { id: "bank_account_no", label: "Bank Account Number", type: "text" },
                    { id: "ifsc_code", label: "IFSC Code", type: "text" },
                    { id: "website_url", label: "Website URL", type: "url" },
                  ].map((field) => (
                    <div key={field.id} className="relative">
                      <input
                        type={field.type}
                        name={field.id}
                        id={field.id}
                        className={`${inputBase} ${isSubmitted && errors[field.id] ? "border-red-600" : ""}`}
                        placeholder=" "
                        value={memberFormData[field.id] ?? ""}
                        onChange={handleChange}
                      />
                      <label htmlFor={field.id} className={labelBase}>
                        {field.label} <span className="text-red-400">*</span>
                      </label>
                      {isSubmitted && errors[field.id] && <span className={errorText}>{errors[field.id]}</span>}
                    </div>
                  ))}

                  <div className="relative">
                    <select
                      name="company_type"
                      id="company_type"
                      className={`${selectBase} ${isSubmitted && errors.company_type ? "border-red-600" : ""}`}
                      value={memberFormData.company_type}
                      onChange={handleChange}
                    >
                      <option value="">Select Company Type</option>
                      <option value="proprietary">Proprietary</option>
                      <option value="partnership">Partnership</option>
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                      <option value="llp">LLP</option>
                      <option value="society">Society</option>
                      <option value="trust">Trust</option>
                      <option value="government">Government</option>
                      <option value="huf">HUF</option>
                      <option value="boi">BOI</option>
                      <option value="aop">AOP</option>
                      <option value="ajp">AJP</option>
                    </select>
                    <label htmlFor="company_type" className={labelBase}>
                      Company Type <span className="text-red-400">*</span>
                    </label>
                    {isSubmitted && errors.company_type && <span className={errorText}>{errors.company_type}</span>}
                  </div>

                 <div 
  className="relative group cursor-pointer"
  onClick={() => {
    // Find the real input and trigger it
    const input = document.getElementById("date_of_incorporation");
    if (input) {
      input.focus();
      // Some browsers need this extra nudge to open the picker
      input.showPicker?.();   // modern browsers (Chrome 114+, Edge, etc.)
    }
  }}
>
  <input
    type="date"
    name="date_of_incorporation"
    id="date_of_incorporation"
    className={`
      ${inputBase} 
      ${isSubmitted && errors.date_of_incorporation ? "border-red-600" : ""} 
      w-full h-12 
      appearance-none
      cursor-pointer
      peer
    `}
    value={memberFormData.date_of_incorporation}
    onChange={handleChange}
  />

  <label 
    htmlFor="date_of_incorporation" 
    className={`
      ${labelBase}
      peer-focus:text-blue-500
      peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
      peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-focus:px-1
      transition-all duration-200
    `}
  >
    Date of Incorporation <span className="text-red-400">*</span>
  </label>

  {isSubmitted && errors.date_of_incorporation && (
    <span className={errorText}>{errors.date_of_incorporation}</span>
  )}
</div>

                  {[
                    { name: "company_pan_no_doc", label: "PAN Document" },
                    { name: "company_gst_no_doc", label: "GST Document" },
                    { name: "cancel_cheque_doc", label: "Cancelled Cheque Document" },
                  ].map((field) => (
                    <div key={field.name} className="relative">
                      <input
                        type="file"
                        name={field.name}
                        id={field.name}
                        className={fileInputBase}
                        onChange={handleCompanyFileChange}
                        accept="image/jpeg,image/png,application/pdf"
                      />
                      <label htmlFor={field.name} className={labelBase}>
                        {field.label} <span className="text-red-400">*</span>
                      </label>
                      {isSubmitted && errors[field.name] && (
                        <span className={errorText}>{errors[field.name]}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <>
                  {memberFormData.director_info.map((director, index) => (
                    <div key={index} className={`p-6 ${glassCard} border border-cyan-900/30 rounded-2xl mb-6`}>
                      <div className="grid gap-7 md:grid-cols-2">
                        {[
                          { name: "director_name", label: `Director ${index + 1} Name`, type: "text" },
                          { name: "director_pan_no", label: "PAN Number", type: "text" },
                          { name: "director_aadhar_no", label: "Aadhaar Number", type: "text" },
                          { name: "director_dob", label: "Date of Birth", type: "date" },
                        ].map((field) => (
                         <div 
  key={field.name} 
  className="relative cursor-pointer group"
  onClick={() => {
    const input = document.getElementById(`${field.name}-${index}`);
    if (input) {
      input.focus();
      // Open native date picker (works in modern Chrome/Edge/Safari)
      input.showPicker?.();
    }
  }}
>
  {field.type === "date" ? (
    <input
      type="date"
      name={field.name}
      id={`${field.name}-${index}`}
      className={`
        ${inputBase} 
        ${isSubmitted && errors.director?.[index]?.[field.name] ? "border-red-600" : ""} 
        cursor-pointer 
        w-full 
        h-12 
        appearance-none
        peer
        text-slate-200
        focus:text-slate-50
      `}
      value={director[field.name] ?? ""}
      onChange={(e) => handleDirectorChange(index, e)}
    />
  ) : (
    <input
      type={field.type}
      name={field.name}
      id={`${field.name}-${index}`}
      className={`${inputBase} ${isSubmitted && errors.director?.[index]?.[field.name] ? "border-red-600" : ""}`}
      value={director[field.name] ?? ""}
      onChange={(e) => handleDirectorChange(index, e)}
      placeholder=" "
    />
  )}

  <label 
    htmlFor={`${field.name}-${index}`} 
    className={`
      ${labelBase}
      peer-focus:text-blue-400
      peer-placeholder-shown:scale-100 
      peer-placeholder-shown:translate-y-0
      peer-focus:scale-75 
      peer-focus:-translate-y-3 
      peer-focus:bg-[#0f172a] 
      peer-focus:px-1
      transition-all duration-200
      pointer-events-none
    `}
  >
    {field.label} <span className="text-red-400">*</span>
  </label>

  {isSubmitted && errors.director?.[index]?.[field.name] && (
    <span className={errorText}>{errors.director[index][field.name]}</span>
  )}
</div>
                        ))}

                        <div className="relative">
                          <select
                            name="director_gender"
                            id={`director_gender-${index}`}
                            className={`${selectBase} ${isSubmitted && errors.director?.[index]?.director_gender ? "border-red-600" : ""}`}
                            value={director.director_gender}
                            onChange={(e) => handleDirectorChange(index, e)}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                          <label htmlFor={`director_gender-${index}`} className={labelBase}>
                            Gender <span className="text-red-400">*</span>
                          </label>
                          {isSubmitted && errors.director?.[index]?.director_gender && (
                            <span className={errorText}>{errors.director[index].director_gender}</span>
                          )}
                        </div>

                        {[
                          { name: "user_pan_doc", label: "Director PAN Document" },
                          { name: "user_addhar_doc", label: "Director Aadhaar Document" },
                        ].map((field) => (
                          <div key={field.name} className="relative">
                            <input
                              type="file"
                              name={field.name}
                              id={`${field.name}-${index}`}
                              className={fileInputBase}
                              onChange={(e) => handleDirectorFileChange(index, e)}
                              accept="image/jpeg,image/png,application/pdf"
                            />
                            <label htmlFor={`${field.name}-${index}`} className={labelBase}>
                              {field.label} <span className="text-red-400">*</span>
                            </label>
                            {isSubmitted && errors.director?.[index]?.[field.name] && (
                              <span className={errorText}>{errors.director[index][field.name]}</span>
                            )}
                          </div>
                        ))}

                        <div className="flex items-center md:col-span-2">
                          <button
                            type="button"
                            onClick={() => removeDirector(index)}
                            className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-3 font-medium"
                          >
                            <i className="fa-solid fa-trash-can text-lg"></i>
                            Remove Director {index + 1}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={addDirector}
                      className={`px-8 py-3.5 ${btnSecondary} text-lg`}
                    >
                      + Add Another Director
                    </button>
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <div className="grid gap-7 md:grid-cols-2">
                  <div className="relative">
                    <select
                      name="payin_at_onboard"
                      id="payin_at_onboard"
                      className={`${selectBase} ${isSubmitted && errors.payin_at_onboard ? "border-red-600" : ""}`}
                      value={memberFormData.payin_at_onboard}
                      onChange={handleChange}
                    >
                      <option value="">Select Payin Bank</option>
                      {payinBanks?.data?.map((item) => (
                        <option key={item.id} value={item.onboard_payin_bank}>
                          {item.onboard_payin_bank}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="payin_at_onboard" className={labelBase}>
                      Payin at Onboard <span className="text-red-400">*</span>
                    </label>
                    {isSubmitted && errors.payin_at_onboard && <span className={errorText}>{errors.payin_at_onboard}</span>}
                  </div>

                  {memberFormData.payin_at_onboard === "Airpay" && (
                    <div className="relative">
                      <select
                        name="credentials_id"
                        id="airpay_mid"
                        className={`${selectBase} ${isSubmitted && errors.credentials_id ? "border-red-600" : ""}`}
                        value={memberFormData.credentials_id}
                        onChange={handleChange}
                      >
                        <option value="">Select Airpay MID</option>
                        {airpayMids.map((mid) => (
                          <option key={mid.id} value={mid.id}>
                            {mid.name}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="airpay_mid" className={labelBase}>Airpay MID</label>
                      {isSubmitted && errors.credentials_id && <span className={errorText}>{errors.credentials_id}</span>}
                    </div>
                  )}

                  <div className="relative">
                    <select
                      name="payout_at_onboard"
                      id="payout_at_onboard"
                      className={`${selectBase} ${isSubmitted && errors.payout_at_onboard ? "border-red-600" : ""}`}
                      value={memberFormData.payout_at_onboard}
                      onChange={handleChange}
                    >
                      <option value="">Select Payout Bank</option>
                      {payoutBanks?.data?.map((item) => (
                        <option key={item.id} value={item.onboard_payout_bank}>
                          {item.onboard_payout_bank}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="payout_at_onboard" className={labelBase}>
                      Payout at Onboard <span className="text-red-400">*</span>
                    </label>
                    {isSubmitted && errors.payout_at_onboard && <span className={errorText}>{errors.payout_at_onboard}</span>}
                  </div>

                  <div className="relative">
                    <select
                      name="scheme_id"
                      id="scheme_id"
                      className={`${selectBase} ${isSubmitted && errors.scheme_id ? "border-red-600" : ""}`}
                      value={memberFormData.scheme_id}
                      onChange={handleChange}
                    >
                      <option value="">Select Scheme</option>
                      {schemes?.data?.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="scheme_id" className={labelBase}>
                      Scheme <span className="text-red-400">*</span>
                    </label>
                    {isSubmitted && errors.scheme_id && <span className={errorText}>{errors.scheme_id}</span>}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 border-t border-cyan-900/40">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`px-10 py-3.5 rounded-xl font-medium transition-all duration-300 w-full sm:w-auto ${
                    currentStep === 1
                      ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                      : `${btnSecondary} hover:scale-[1.03]`
                  }`}
                >
                  ← Previous Step
                </button>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  {currentStep === 4 ? (
                    <button
                      type="submit"
                      className={`w-full sm:w-auto ${btnPrimary} text-lg font-bold tracking-wider`}
                    >
                      SUBMIT MERCHANT APPLICATION
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className={`w-full sm:w-auto ${btnPrimary}`}
                    >
                      Next Step →
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(true)}
                    className={`w-full sm:w-auto px-10 py-3.5 ${btnSecondary}`}
                  >
                    Cancel & Exit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SchemeModal showModal={showSchemeModal} handleModal={handleSchemeModal} refreshTable={refetchScheme} />

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
        heading="Confirm Exit"
        body="All entered data will be lost if you leave this page. Are you sure?"
        handleConfirmModal={setShowConfirmModal}
        action={() => navigate("/member-list")}
      />
    </div>
  );
}; 