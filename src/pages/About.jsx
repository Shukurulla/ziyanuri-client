import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiAcademicCap, HiGlobe, HiUserGroup, HiLightBulb } from "react-icons/hi";
import api from "../api";

export default function About() {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const lang = i18n.language;
  const tr = (item) => item.translations?.find((t) => t.lang === lang) || item.translations?.[0] || {};

  useEffect(() => {
    api.get("/pages/about").then((r) => setPage(r.data)).catch(() => {});
    api.get("/leaders").then((r) => setLeaders(r.data)).catch(() => {});
  }, []);

  const features = [
    { icon: HiAcademicCap, title: t("about.feature_education"), desc: t("about.feature_education_desc"), color: "from-blue-500 to-primary-600" },
    { icon: HiGlobe, title: t("about.feature_heritage"), desc: t("about.feature_heritage_desc"), color: "from-accent-500 to-accent-600" },
    { icon: HiUserGroup, title: t("about.feature_cooperation"), desc: t("about.feature_cooperation_desc"), color: "from-emerald-500 to-emerald-600" },
    { icon: HiLightBulb, title: t("about.feature_innovation"), desc: t("about.feature_innovation_desc"), color: "from-purple-500 to-purple-600" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-900 to-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 kk-pattern-main opacity-60" />
        <div className="absolute left-0 top-0 bottom-0 w-14 kk-border-vertical opacity-30" />
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-accent-500/10 rounded-full blur-[120px]" />

        <div className="container-main relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-1 bg-accent-500 rounded-full" />
              <span className="text-accent-400 text-sm font-medium uppercase tracking-[0.2em]">
                {t("about.hero_label")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">{t("about.title")}</h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              {t("about.hero_desc")}
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-8 -mt-16 relative z-10">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 stagger-children">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 sm:p-6 text-center group shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-gray-100">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <f.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-bold text-primary-800 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Page Content */}
      {page && tr(page)?.content && (
        <section className="py-20">
          <div className="container-main max-w-4xl">
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1.5 rounded-full bg-gradient-to-b from-accent-500 via-primary-500 to-accent-500 opacity-30" />
              <div
                className="prose prose-lg max-w-none prose-headings:text-primary-800 prose-a:text-accent-600 prose-p:text-gray-600 prose-p:leading-relaxed pl-6"
                dangerouslySetInnerHTML={{ __html: tr(page).content }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Ornament divider */}
      <div className="section-divider" />

      {/* Leadership */}
      {leaders.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-sand-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 kk-pattern-horn opacity-40" />
          <div className="absolute right-0 top-0 bottom-0 w-10 kk-border-vertical opacity-20" />
          <div className="container-main relative z-10">
            <div className="text-center mb-14">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-800">{t("about.leadership")}</h2>
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="w-12 h-1 bg-accent-500 rounded-full" />
                <div className="w-3 h-3 rotate-45 bg-accent-500 rounded-sm" />
                <div className="w-12 h-1 bg-accent-500 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
              {leaders.map((l) => (
                <div key={l._id} className="bg-white rounded-2xl p-8 text-center group shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100">
                  <div className="relative w-36 h-36 mx-auto mb-6">
                    <div className="absolute -inset-2 rounded-full border-2 border-dashed border-accent-500/30 group-hover:rotate-12 transition-transform duration-700" />
                    {l.photo ? (
                      <img
                        src={l.photo}
                        alt=""
                        className="w-full h-full rounded-full object-cover ring-4 ring-white shadow-lg group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-100 to-sand-200 flex items-center justify-center text-primary-400 ring-4 ring-white shadow-lg">
                        <HiUserGroup className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs px-4 py-1.5 rounded-full font-medium whitespace-nowrap shadow-lg shadow-accent-500/30">
                        {tr(l).role || ""}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-primary-800 mt-3">
                    {tr(l).fullName || "—"}
                  </h3>
                  {tr(l).bio && (
                    <p className="text-gray-500 text-sm mt-3 line-clamp-3 leading-relaxed">{tr(l).bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
