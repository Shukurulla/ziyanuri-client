import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiPhotograph, HiFilm, HiMusicNote, HiBookOpen, HiDownload } from "react-icons/hi";
import api from "../api";

const types = [
  { key: "photo", icon: HiPhotograph, emoji: "📸" },
  { key: "video", icon: HiFilm, emoji: "🎬" },
  { key: "audio", icon: HiMusicNote, emoji: "🎵" },
  { key: "book", icon: HiBookOpen, emoji: "📚" },
];

export default function MediaLibrary() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("photo");
  const [lightbox, setLightbox] = useState(null);
  const lang = i18n.language;
  const tr = (item) => item.translations?.find((t) => t.lang === lang) || item.translations?.[0] || {};

  useEffect(() => {
    api.get("/media", { params: { type: filter } }).then((r) => setItems(r.data)).catch(() => {});
  }, [filter]);

  const typeLabels = { photo: t("media.photos"), video: t("media.videos"), audio: t("media.audio"), book: t("media.books") };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pattern-bg" />
        <div className="container-main relative z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("media.title")}</h1>
          <div className="w-20 h-1 bg-accent-500 rounded-full" />
        </div>
      </section>

      <section className="py-16">
        <div className="container-main">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            {types.map((tp) => (
              <button
                key={tp.key}
                onClick={() => setFilter(tp.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  filter === tp.key ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <tp.icon size={18} /> {typeLabels[tp.key]}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          {filter === "photo" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
              {items.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setLightbox(item.url)}
                  className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer shadow-sm hover:shadow-xl transition-all"
                >
                  <img src={item.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                    <HiPhotograph className="text-white opacity-0 group-hover:opacity-100 transition" size={32} />
                  </div>
                  {tr(item).title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition">
                      <p className="text-white text-sm font-medium truncate">{tr(item).title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Video Grid */}
          {filter === "video" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
              {items.map((item) => (
                <div key={item._id} className="card-flat p-5">
                  <video src={item.url} controls className="w-full rounded-xl" />
                  <p className="mt-3 font-medium">{tr(item).title || ""}</p>
                </div>
              ))}
            </div>
          )}

          {/* Audio */}
          {filter === "audio" && (
            <div className="space-y-4 max-w-3xl stagger-children">
              {items.map((item) => (
                <div key={item._id} className="card-flat p-5 flex items-center gap-5">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-500 shrink-0">
                    <HiMusicNote size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-2 truncate">{tr(item).title || "Audio"}</p>
                    <audio src={item.url} controls className="w-full h-8" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Books */}
          {filter === "book" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {items.map((item) => (
                <a key={item._id} href={item.url} download className="card p-6 flex items-center gap-4 group">
                  <div className="w-16 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center text-3xl shrink-0">
                    📖
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate group-hover:text-primary-500 transition">{tr(item).title || "Kitob"}</h3>
                    <span className="text-sm text-primary-500 flex items-center gap-1 mt-2">
                      <HiDownload size={14} /> Yuklab olish
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {items.length === 0 && (
            <div className="text-center py-20 text-gray-300">
              <div className="text-7xl mb-4">{types.find((t) => t.key === filter)?.emoji}</div>
              <p className="text-lg">{t("common.loading")}</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-w-full max-h-[90vh] rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
