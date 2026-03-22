import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  HiPhotograph, HiFilm, HiMusicNote, HiBookOpen,
  HiDownload, HiX, HiSearch
} from "react-icons/hi";
import api from "../api";

const types = [
  { key: "photo", icon: HiPhotograph },
  { key: "video", icon: HiFilm },
  { key: "audio", icon: HiMusicNote },
  { key: "book", icon: HiBookOpen },
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
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-900 to-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 kk-pattern-main opacity-60" />
        <div className="absolute left-0 top-0 bottom-0 w-14 kk-border-vertical opacity-30" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-[100px]" />

        <div className="container-main relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-1 bg-accent-500 rounded-full" />
            <span className="text-accent-400 text-sm font-medium uppercase tracking-[0.2em]">
              {t("media.hero_label")}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("media.title")}</h1>
          <p className="text-white/60 text-lg max-w-lg">
            {t("media.hero_desc")}
          </p>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-sand-50 to-white">
        <div className="container-main">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {types.map((tp) => (
              <button
                key={tp.key}
                onClick={() => setFilter(tp.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  filter === tp.key
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-accent-500/50"
                }`}
              >
                <tp.icon className="w-4 h-4" /> {typeLabels[tp.key]}
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
                  className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <img src={item.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                    <div>
                      <HiSearch className="w-5 h-5 text-white mb-1" />
                      {tr(item).title && (
                        <p className="text-white text-sm font-medium truncate">{tr(item).title}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Video Grid */}
          {filter === "video" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
              {items.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <video src={item.url} controls className="w-full" />
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white shrink-0">
                      <HiFilm className="w-5 h-5" />
                    </div>
                    <p className="font-medium text-gray-800">{tr(item).title || ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Audio */}
          {filter === "audio" && (
            <div className="space-y-4 max-w-3xl stagger-children">
              {items.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl p-5 flex items-center gap-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-500/30">
                    <HiMusicNote className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-2 truncate text-gray-800">{tr(item).title || "Audio"}</p>
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
                <a
                  key={item._id}
                  href={item.url}
                  download
                  className="bg-white rounded-2xl p-6 flex items-center gap-5 group shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="w-16 h-20 bg-gradient-to-br from-accent-400/20 to-accent-500/10 rounded-xl flex items-center justify-center shrink-0 border border-accent-500/20 group-hover:scale-105 transition-transform">
                    <HiBookOpen className="w-8 h-8 text-accent-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate group-hover:text-primary-600 transition">{tr(item).title || t("media.books")}</h3>
                    <span className="text-sm text-accent-500 flex items-center gap-1.5 mt-2 font-medium">
                      <HiDownload className="w-3.5 h-3.5" /> {t("media.download")}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {items.length === 0 && (
            <div className="text-center py-24 text-gray-300">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                {filter === "photo" && <HiPhotograph className="w-10 h-10 text-gray-300" />}
                {filter === "video" && <HiFilm className="w-10 h-10 text-gray-300" />}
                {filter === "audio" && <HiMusicNote className="w-10 h-10 text-gray-300" />}
                {filter === "book" && <HiBookOpen className="w-10 h-10 text-gray-300" />}
              </div>
              <p className="text-lg">{t("common.loading")}</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in-up"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
            onClick={() => setLightbox(null)}
          >
            <HiX className="w-6 h-6" />
          </button>
          <img
            src={lightbox}
            alt=""
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
