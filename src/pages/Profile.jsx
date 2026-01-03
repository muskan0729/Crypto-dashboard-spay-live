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
        <div
          className={tabClass("password")}
          onClick={() => setActiveTab("password")}
        >
          <i className="fa-solid fa-rotate" /> Change Password
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {loading ? (
          <ProfileSkeleton />
        ) : (
          <>
            {/* PROFILE */}
            {activeTab === "profile" && (
              <div className={cardClass}>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 blur-2xl" />
                <h3 className="relative text-xl font-bold text-[#ffd700]">
                  Profile Information
                </h3>

                <form className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div key={field} className="relative">
                      <input
                        name={field}
                        value={userData?.[field] || ""}
                        onChange={
                          role === "admin" ? handleInputChange : undefined
                        }
                        disabled={role !== "admin"}
                        className={`${inputClass} peer ${
                          role !== "admin" ? "opacity-70" : ""
                        }`}
                        placeholder=" "
                      />
                      <label className={labelClass}>{label}</label>
                    </div>
                  ))}
                </form>

                {role === "admin" && (
                  <Button
                    onClick={handleUpdate}
                    className="mt-4 bg-[#ffd700] hover:bg-yellow-400 text-black font-semibold px-6 py-2 rounded-lg"
                  >
                    {profileLoading ? "Updating..." : "Update"}
                  </Button>
                )}
              </div>
            )}

            {activeTab === "director" && (
              <div className={cardClass}>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-red-500/10 blur-2xl" />
                <h3 className="relative text-xl font-bold text-[#ffd700] capitalize">
                  {activeTab.replace("_", " ")}
                </h3>
                {/* Existing JSX preserved */}
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
                    <div key={field} className="relative">
                      <input
                        name={field}
                        value={userData?.[field] || ""}
                        onChange={
                          role === "admin" ? handleInputChange : undefined
                        }
                        disabled={role !== "admin"}
                        className={`${inputClass} peer ${
                          role !== "admin" ? "opacity-70" : ""
                        }`}
                        placeholder=" "
                      />
                      <label className={labelClass}>{label}</label>
                    </div>
                  ))}
              </div>
            )}

            {
              activeTab === "company" && <div>
                
              </div>
            }

            {/* DIRECTOR / COMPANY / ACCOUNT / PASSWORD */}
            {// activeTab === "director" ||
            (
              activeTab === "account" ||
              activeTab === "password") && (
              <div className={cardClass}>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-red-500/10 blur-2xl" />
                <h3 className="relative text-xl font-bold text-[#ffd700] capitalize">
                  {activeTab.replace("_", " ")}
                </h3>

                {/* Existing JSX preserved */}
                {activeTab === "password" && (
                  <form
                    onSubmit={handleChangePassword}
                    className="relative grid md:grid-cols-2 gap-4"
                  >
                    {["old_password", "new_password"].map((field) => (
                      <div key={field} className="relative">
                        <input
                          type="password"
                          name={field}
                          value={passwordFormData[field]}
                          onChange={(e) =>
                            setPasswordFormData({
                              ...passwordFormData,
                              [e.target.name]: e.target.value,
                            })
                          }
                          className={`${inputClass} peer`}
                          placeholder=" "
                        />
                        <label className={labelClass}>
                          {field === "old_password"
                            ? "Old Password"
                            : "New Password"}
                        </label>
                      </div>
                    ))}
                    <Button
                      type="submit"
                      className="md:col-span-2 bg-[#ffd700] hover:bg-yellow-400 text-black font-semibold px-6 py-2 rounded-lg"
                    >
                      {passwordLoading ? "Changing..." : "Change Password"}
                    </Button>
                  </form>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
