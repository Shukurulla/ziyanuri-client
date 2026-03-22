import { useState, useRef } from "react";
import { HiPhotograph, HiX, HiCloudUpload } from "react-icons/hi";
import api from "../../api";

export default function ImageUpload({ value, onChange, label = "Rasm" }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
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
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <img src={value} alt="" className="w-full h-40 object-cover" onError={(e) => { e.target.src = ""; e.target.className = "hidden"; }} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100">
              Almashtirish
            </button>
            <button type="button" onClick={() => onChange("")} className="p-1.5 bg-red-500 rounded-lg text-white hover:bg-red-600">
              <HiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragOver ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <HiCloudUpload className={`w-8 h-8 mx-auto mb-2 ${dragOver ? "text-primary-500" : "text-gray-300"}`} />
          <p className="text-sm text-gray-500">
            {uploading ? "Yuklanmoqda..." : "Rasm yuklash yoki shu yerga tashlang"}
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" />
    </div>
  );
}
