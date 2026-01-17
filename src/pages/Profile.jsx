import { useEffect, useState } from "react";
import { useGet } from "../hooks/useGet";
import Button from "../components/Button";
import { useLocation } from "react-router-dom";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";
import ProfileSkeleton from "../components/ProfileSkeleton";

export const Profile = () => {
  const role = atob(localStorage.getItem("role"));
  const toast = useToast();
  const [userData, setUserData] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [passwordFormData, setPasswordFormData] = useState({
    old_password: "",
    new_password: "",
  });

  const location = useLocation();
  const { id } = location.state || {};

  const apiEndpoint =
    role === "admin" ? `/show-merchant/${id}` : "/show-merchant";
  const { data: merchantData, loading } = useGet(apiEndpoint);

  const initialMerchantData = merchantData?.data;

  useEffect(() => {
    if (!initialMerchantData) return;

    const formattedData = () => ({
      id: initialMerchantData?.id,
      name: initialMerchantData?.name,
      email: initialMerchantData?.email,
      mobile_no: initialMerchantData?.mobile_no,
      company_type: initialMerchantData?.company_type,
      company_pan_no: initialMerchantData?.company_pan_no,
      company_gst_no: initialMerchantData?.company_gst_no,
      cin_llpin: initialMerchantData?.cin_llpin,
      date_of_incorporation: initialMerchantData?.date_of_incorporation
        ? initialMerchantData.date_of_incorporation.split("T")[0]
        : "",
      account_holder_name: initialMerchantData?.account_holder_name,
      bank_account_no: initialMerchantData?.bank_account_no,
      ifsc_code: initialMerchantData?.ifsc_code,
      address: initialMerchantData?.address,
      city: initialMerchantData?.city,
      district: initialMerchantData?.district,
      state: initialMerchantData?.state,
      pin_code: initialMerchantData?.pin_code,
      director_info: initialMerchantData?.director_info || [],
      website_url: initialMerchantData?.website_url,
    });

    setUserData(formattedData() || []);
  }, [initialMerchantData]);

  const { execute: changePassword, loading: passwordLoading } =
    usePost("/change-password");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await changePassword(passwordFormData);
      if (res) {
        toast.success("Password Changed Successfully!");
        setPasswordFormData({ old_password: "", new_password: "" });
      }
    } catch (err) {
      toast.error(err?.message);
    }
  };

  const { execute: updateProfile, loading: profileLoading } = usePost(
    `/update-merchant/${userData?.id}`
  );

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleDirectorChange = (index, e) => {
    const { name, value, files } = e.target;
    setUserData((prev) => {
      const updated = [...prev.director_info];
      updated[index] = { ...updated[index], [name]: files ? files[0] : value };
      return { ...prev, director_info: updated };
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(userData);
      if (res) toast.success("Profile Updated Successfully!");
    } catch (err) {
      toast.error(err?.message);
    }
  };

  const tabClass = (tab) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition
     ${
       activeTab === tab
         ? "bg-white/10 text-[#ffd700] border border-white/20"
         : "text-white/60 hover:text-white hover:bg-white/5"
     }`;

  const cardClass =
    "relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 space-y-4";

  const inputClass =
    "block w-full bg-black/40 border border-white/10 rounded-lg px-3 pt-4 pb-2 text-sm text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#ffd700]";

  const labelClass =
    "absolute left-3 top-2 text-xs text-[#ffd700] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-white/40 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#ffd700]";

  return (
   <div className="min-h-screen bg-black p-4 md:p-6 md:flex gap-6">
  {/* Sidebar */}
  <div className="w-full md:w-64 space-y-2">
    <div
      className={tabClass("profile")}
      onClick={() => setActiveTab("profile")}
    >
      <i className="fa-solid fa-user" /> Profile Info
    </div>
    <div
      className={tabClass("director")}
      onClick={() => setActiveTab("director")}
    >
      <i className="fa-solid fa-people-roof" /> Directors Info
    </div>
    <div
      className={tabClass("company")}
      onClick={() => setActiveTab("company")}
    >
      <i className="fa-solid fa-building" /> Company Info
    </div>
    <div
      className={tabClass("account")}
      onClick={() => setActiveTab("account")}
    >
      <i className="fa-solid fa-folder-closed" /> Account Details
    </div>
  </div>

  {/* Content */}
  <div className="flex-1">
    {loading ? (
      <ProfileSkeleton />
    ) : (
      <>
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[#ffd700] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
              Profile Information
            </h2>

            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-radial from-[#ffd700]/30 via-[#ff6b00]/20 to-transparent blur-3xl pointer-events-none" />

              {[
                ["name", "Name"],
                ["email", "Email"],
                ["mobile_no", "Phone Number"],
                ["address", "Address"],
                ["city", "City"],
                ["district", "District"],
                ["state", "State"],
                ["pin_code", "Pin Code"],
              ].map(([field, label]) => (
                <div key={field} className="flex flex-col gap-1">
                  <span className="text-xs text-white/60">{label}</span>
                  <span className="text-sm text-white font-medium">
                    {userData?.[field] || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIRECTOR TAB */}
        {activeTab === "director" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[#ffd700] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
              Director Information
            </h2>

            <div className="space-y-4">
              {userData?.director_info?.map((d, index) => (
                <div
                  key={index}
                  className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-radial from-[#ffd700]/30 via-[#ff6b00]/20 to-transparent blur-3xl pointer-events-none" />

                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-white/60">Director Name</span>
                    <span className="text-sm text-white font-medium">
                      {d.director_name || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-white/60">Gender</span>
                    <span className="text-sm text-white font-medium">
                      {d.director_gender || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-white/60">PAN Number</span>
                    <span className="text-sm text-white font-medium">
                      {d.director_pan_no || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-white/60">Date of Birth</span>
                    <span className="text-sm text-white font-medium">
                      {d.director_dob || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <span className="text-xs text-white/60">Aadhar Number</span>
                    <span className="text-sm text-white font-medium">
                      {d.director_aadhar_no || "-"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPANY TAB */}
        {activeTab === "company" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[#ffd700] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
              Company Information
            </h2>

            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-radial from-[#ffd700]/30 via-[#ff6b00]/20 to-transparent blur-3xl pointer-events-none" />

              {[
                ["company_type", "Company Type"],
                ["company_pan_no", "Company PAN No"],
                ["company_gst_no", "Company GST No"],
                ["cin_llpin", "CIN LLPIN"],
                ["date_of_incorporation", "Date of Incorporation"],
                ["website_url", "Website URL"],
              ].map(([key, label]) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className="text-xs text-white/60">{label}</span>
                  <span className="text-sm text-white font-medium">
                    {userData?.[key] || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACCOUNT TAB */}
        {activeTab === "account" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[#ffd700] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
              Account Information
            </h2>

            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-radial from-[#ffd700]/30 via-[#ff6b00]/20 to-transparent blur-3xl pointer-events-none" />

              {[
                ["account_holder_name", "Account Holder Name"],
                ["bank_account_no", "Bank Account No"],
                ["ifsc_code", "IFSC Code"],
              ].map(([key, label]) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className="text-xs text-white/60">{label}</span>
                  <span className="text-sm text-white font-medium">
                    {userData?.[key] || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PASSWORD TAB */}
      
      </>
    )}
  </div>
</div>

  );
};
