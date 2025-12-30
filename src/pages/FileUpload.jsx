import React, { useState } from "react";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";

const FileUpload = () => {
  const toast = useToast();
  const { execute: uploadFile } = usePost("/upload");
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return toast.error("Select a file first");

    try {
      const formData = new FormData();
      formData.append("file", file); // must match API key

      const response = await uploadFile(formData); // no Content-Type manually
      console.log("Upload response:", response);
      toast.success("File uploaded!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    }
  };

  return (
    <div className="w-full min-h-screen p-6 space-y-6 bg-black relative">
      {/* Gradient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-red-600 via-orange-500 to-yellow-400 blur-[120px] opacity-20 -z-10 rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-yellow-400 via-orange-500 to-red-600 blur-[150px] opacity-10 -z-10 rounded-full" />

      {/* Upload Card */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-8 max-w-md mx-auto flex flex-col gap-6">
        <h2 className="text-[#ffd700] text-2xl font-bold text-center">Upload File</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-white/20 file:bg-black/40 file:text-white file:hover:bg-[#ffd700]/20 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#ffd700] transition"
        />

        <button
          onClick={handleUpload}
          className="w-full py-3 bg-[#ffd700] text-black font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-yellow-400 transition"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
