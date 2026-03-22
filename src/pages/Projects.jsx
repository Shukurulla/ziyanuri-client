import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiArrowRight, HiClipboardList, HiCollection } from "react-icons/hi";
import api from "../api";

export default function Projects() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("");
  const lang = i18n.language;
  const tr = (item) => item.translations?.find((t) => t.lang === lang) || item.translations?.[0] || {};

  useEffect(() => {
    const params = filter ? { status: filter } : {};
    api.get("/projects", { params }).then((r) => setProjects(r.data)).catch(() => {});
  }, [filter]);

  const statusConfig = {
    completed: { label: t("projects.completed"), bg: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    current: { label: t("projects.current"), bg: "bg-blue-500", badge: "bg-blue-100 text-blue-700 border-blue-200" },
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-900 to-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 kk-pattern-main opacity-60" />
        <div className="absolute right-0 top-0 bottom-0 w-14 kk-border-vertical opacity-30" />
        <div className="absolute top-0 left-1/2 w-80 h-80 bg-accent-500/10 rounded-full blur-[100px]" />

        <div className="container-main relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-1 bg-accent-500 rounded-full" />
            <span className="text-accent-400 text-sm font-medium uppercase tracking-[0.2em]">
              {t("projects.hero_label")}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("projects.title")}</h1>
          <p className="text-white/60 text-lg max-w-lg">
            {t("projects.hero_desc")}
          </p>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-sand-50 to-white">
        <div className="container-main">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {[
              { val: "", label: t("home.view_all"), icon: HiCollection },
              { val: "current", label: t("projects.current"), icon: HiClipboardList },
              { val: "completed", label: t("projects.completed"), icon: HiClipboardList },
            ].map((f) => (
              <button
                key={f.val}
                onClick={() => setFilter(f.val)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  filter === f.val
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-accent-500/50"
                }`}
              >
                <f.icon className="w-4 h-4" /> {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
            {projects.map((p) => {
              const sc = statusConfig[p.status] || statusConfig.current;
              return (
                <Link
                  key={p._id}
                  to={`/projects/${p.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-gray-100"
                >
                  <div className="relative h-52 overflow-hidden">
                    {p.image ? (
                      <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full placeholder-img flex items-center justify-center">
                        <HiClipboardList className="w-16 h-16 text-white/15" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${sc.badge}`}>
                        <span className={`w-2 h-2 rounded-full ${sc.bg}`} />
                        {sc.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg group-hover:text-primary-600 transition-colors mb-2 leading-snug">
                      {tr(p).title || "—"}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                      {tr(p).description?.replace(/<[^>]*>/g, '') || ""}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-accent-500 text-sm font-semibold mt-4 group-hover:gap-3 transition-all duration-300">
                      {t("home.read_more")} <HiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-24 text-gray-300">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <HiClipboardList className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-lg">{t("common.loading")}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
