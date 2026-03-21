import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiArrowRight } from "react-icons/hi";
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

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pattern-bg" />
        <div className="container-main relative z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("projects.title")}</h1>
          <div className="w-20 h-1 bg-accent-500 rounded-full" />
        </div>
      </section>

      <section className="py-16">
        <div className="container-main">
          <div className="flex flex-wrap gap-3 mb-10">
            {[
              { val: "", label: t("home.view_all") },
              { val: "completed", label: t("projects.completed") },
              { val: "current", label: t("projects.current") },
            ].map((f) => (
              <button
                key={f.val}
                onClick={() => setFilter(f.val)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  filter === f.val ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
            {projects.map((p) => (
              <Link key={p._id} to={`/projects/${p.slug}`} className="card group">
                <div className="relative h-52 overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-6xl opacity-50">
                      📋
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`badge ${p.status === "completed" ? "badge-green" : "badge-blue"}`}>
                      {p.status === "completed" ? t("projects.completed") : t("projects.current")}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg group-hover:text-primary-500 transition-colors mb-2">
                    {tr(p).title || "—"}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {tr(p).description?.replace(/<[^>]*>/g, '') || ""}
                  </p>
                  <span className="inline-flex items-center gap-1 text-primary-500 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                    {t("home.read_more")} <HiArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
