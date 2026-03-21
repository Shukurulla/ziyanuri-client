import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiLocationMarker } from "react-icons/hi";
import api from "../api";

const categories = ["historical", "monument", "tradition", "cuisine"];

export default function Heritage() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const lang = i18n.language;
  const tr = (item) => item.translations?.find((t) => t.lang === lang) || item.translations?.[0] || {};

  useEffect(() => {
    const params = filter ? { category: filter } : {};
    api.get("/heritage", { params }).then((r) => setItems(r.data)).catch(() => {});
  }, [filter]);

  const categoryLabels = {
    historical: t("heritage.historical"),
    monument: t("heritage.monuments"),
    tradition: t("heritage.traditions"),
    cuisine: t("heritage.cuisine"),
  };

  const categoryIcons = { historical: "🏛️", monument: "🗿", tradition: "🎭", cuisine: "🍽️" };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pattern-bg" />
        <div className="container-main relative z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("heritage.title")}</h1>
          <div className="w-20 h-1 bg-accent-500 rounded-full" />
        </div>
      </section>

      <section className="py-16">
        <div className="container-main">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            <button
              onClick={() => setFilter("")}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                !filter ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("home.view_all")}
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  filter === c ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{categoryIcons[c]}</span> {categoryLabels[c]}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
            {items.map((item) => (
              <Link key={item._id} to={`/heritage/${item.slug}`} className="card group">
                <div className="relative h-56 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-6xl">
                      {categoryIcons[item.category] || "🏛️"}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {item.lat && item.lng && (
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <HiLocationMarker size={12} className="text-red-500" /> Xaritada
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span className="badge bg-white/90 backdrop-blur-sm text-gray-700">
                      {categoryIcons[item.category]} {categoryLabels[item.category]}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg group-hover:text-primary-500 transition-colors mb-2">
                    {tr(item).title || "—"}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {tr(item).description?.replace(/<[^>]*>/g, '') || ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-20 text-gray-300">
              <div className="text-7xl mb-4">🏛️</div>
              <p className="text-lg">{t("common.loading")}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
