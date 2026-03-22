import { useState, useRef, useEffect } from "react";
import { HiLocationMarker, HiX } from "react-icons/hi";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapPicker({ lat, lng, onSave }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ lat: lat || "42.4619", lng: lng || "59.6166" });
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const handleOpen = () => {
    setPos({ lat: lat || "42.4619", lng: lng || "59.6166" });
    setOpen(true);
  };

  const handleSave = () => { onSave(pos.lat, pos.lng); setOpen(false); };

  // Initialize map when modal opens
  useEffect(() => {
    if (!open || !mapRef.current) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const numLat = Number(pos.lat) || 42.46;
      const numLng = Number(pos.lng) || 59.61;

      const map = L.map(mapRef.current).setView([numLat, numLng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);

      const marker = L.marker([numLat, numLng], { icon: markerIcon }).addTo(map);
      markerRef.current = marker;
      mapInstanceRef.current = map;

      map.on("click", (e) => {
        const newLat = e.latlng.lat.toFixed(6);
        const newLng = e.latlng.lng.toFixed(6);
        marker.setLatLng([e.latlng.lat, e.latlng.lng]);
        setPos({ lat: newLat, lng: newLng });
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [open]);

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Geolokatsiya</label>
        <button type="button" onClick={handleOpen}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-left">
          <HiLocationMarker className={`w-5 h-5 shrink-0 ${lat && lng ? "text-red-500" : "text-gray-400"}`} />
          <div>
            {lat && lng ? (
              <><p className="text-sm font-medium text-gray-700">Belgilangan</p><p className="text-xs text-gray-400">{lat}, {lng}</p></>
            ) : (
              <p className="text-sm text-gray-400">Kartadan joyni belgilang</p>
            )}
          </div>
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b">
                <h3 className="font-semibold text-gray-900">Kartaga bosib joyni tanlang</h3>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><HiX className="w-5 h-5" /></button>
              </div>

              <div className="px-5 py-3 bg-gray-50 border-b flex items-center gap-4 text-xs text-gray-500">
                <span>Lat: <strong className="text-gray-800">{pos.lat}</strong></span>
                <span>Lng: <strong className="text-gray-800">{pos.lng}</strong></span>
                <span className="text-gray-400">— kartaga bosing</span>
              </div>

              <div ref={mapRef} className="h-[400px]" />

              <div className="flex gap-3 p-4 border-t">
                <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800">Saqlash</button>
                <button type="button" onClick={() => { onSave("", ""); setOpen(false); }} className="px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl">O'chirish</button>
                <button onClick={() => setOpen(false)} className="px-4 py-2.5 border border-gray-200 text-sm rounded-xl hover:bg-gray-50">Bekor</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
