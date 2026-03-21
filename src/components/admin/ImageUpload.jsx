import { useState, useRef } from "react";
import { HiUpload, HiLink, HiX } from "react-icons/hi";
import api from "../../api";

export default function ImageUpload({ value, onChange, label = "Rasm" }) {
  const [mode, setMode] = useState("file"); // "file" or "url"
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
    } catch {
      alert("Fayl yuklanmadi");
    }
    setUploading(false);
    e.target.value = "";
  };

  const clear = () => {
    onChange("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      {/* Mode toggle */}
      <div className="flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => setMode("file")}
          className={`flex items-center gap-1 px-3 py-1 rounded text-xs ${
            mode === "file" ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          <HiUpload size={14} /> Fayl yuklash
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1 px-3 py-1 rounded text-xs ${
            mode === "url" ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          <HiLink size={14} /> URL kiritish
        </button>
      </div>

      {/* Input */}
      {mode === "file" ? (
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 disabled:opacity-50"
          />
          {uploading && <span className="text-xs text-gray-400">Yuklanmoqda...</span>}
        </div>
      ) : (
        <input
          type="text"
          placeholder="https://... yoki /uploads/..."
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      )}

      {/* Preview */}
      {value && (
        <div className="mt-2 relative inline-block">
          <img
            src={value}
            alt="preview"
            className="h-24 rounded-lg object-cover border"
            onError={(e) => (e.target.style.display = "none")}
          />
          <button
            type="button"
            onClick={clear}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
          >
            <HiX size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
