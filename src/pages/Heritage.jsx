import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HiLocationMarker, HiArrowRight, HiOfficeBuilding,
  HiCube, HiSparkles, HiCake, HiCollection
} from "react-icons/hi";
import api from "../api";

export default function Heritage() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const lang = i18n.language;
  const tr = (item) => item.translations?.find((t) => t.lang === lang) || item.translations?.[0] || {};
  const catName = (slug) => {
    const cat = categories.find(c => c.slug === slug);
    const catTr = cat?.translations?.find(t => t.lang === lang) || cat?.translations?.[0];
    return catTr?.name || slug;
  };

  useEffect(() => {
    const params = filter ? { category: filter } : {};
    api.get("/heritage", { params }).then((r) => setItems(r.data)).catch(() => {});
  }, [filter]);

  useEffect(() => {
    api.get("/categories", { params: { type: "heritage" } }).then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const categoryIcons = {
    historical: HiOfficeBuilding,
    monument: HiCube,
    tradition: HiSparkles,
    cuisine: HiCake,
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-900 to-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 kk-pattern-main opacity-60" />
        <div className="absolute right-0 top-0 bottom-0 w-14 kk-border-vertical opacity-30" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-500/10 rounded-full blur-[100px]" />

        <div className="container-main relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-1 bg-accent-500 rounded-full" />
            <span className="text-accent-400 text-sm font-medium uppercase tracking-[0.2em]">
              {t("heritage.hero_label")}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("heritage.title")}</h1>
          <p className="text-white/60 text-lg max-w-lg">
            {t("heritage.hero_desc")}
          </p>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-sand-50 to-white">
        <div className="container-main">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => setFilter("")}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                !filter
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-accent-500/50"
              }`}
            >
              <HiCollection className="w-4 h-4" /> {t("home.view_all")}
            </button>
            {categories.map((c) => {
              const Icon = categoryIcons[c.slug] || HiCollection;
              return (
                <button
                  key={c._id}
                  onClick={() => setFilter(c.slug)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    filter === c.slug
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-accent-500/50"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {catName(c.slug)}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
            {items.map((item) => {
              const CatIcon = categoryIcons[item.category] || HiOfficeBuilding;
              return (
                <Link
                  key={item._id}
                  to={`/heritage/${item.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-gray-100"
                >
                  <div className="relative h-56 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full placeholder-img flex items-center justify-center">
                        <CatIcon className="w-16 h-16 text-white/15" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {item.lat && item.lng && (
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm">
                        <HiLocationMarker className="w-3.5 h-3.5 text-red-500" /> {t("heritage.on_map")}
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5">
                        <CatIcon className="w-3.5 h-3.5 text-primary-500" /> {catName(item.category)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg group-hover:text-primary-600 transition-colors mb-2 leading-snug">
                      {tr(item).title || "—"}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                      {tr(item).description?.replace(/<[^>]*>/g, '') || ""}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-accent-500 text-sm font-semibold mt-4 group-hover:gap-3 transition-all duration-300">
                      {t("heritage.details")} <HiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {items.length === 0 && (
            <div className="text-center py-24 text-gray-300">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <HiOfficeBuilding className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-lg">{t("common.loading")}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
