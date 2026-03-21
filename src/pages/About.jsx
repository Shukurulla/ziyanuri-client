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
    { icon: HiAcademicCap, title: "Ma'rifat", desc: "Xalqqa bilim va ma'naviyat ulashish" },
    { icon: HiGlobe, title: "Meros", desc: "Milliy merosni saqlash va targ'ib qilish" },
    { icon: HiUserGroup, title: "Hamkorlik", desc: "Xalqaro hamkorlar bilan ishlash" },
    { icon: HiLightBulb, title: "Innovatsiya", desc: "Zamonaviy yondashuvlar va texnologiyalar" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pattern-bg" />
        <div className="container-main relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("about.title")}</h1>
            <div className="w-20 h-1 bg-accent-500 rounded-full mb-6" />
            <p className="text-lg text-white/70">
              Qoraqalpog'iston Respublikasining ruhiy-ma'rifiy markazi
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 -mt-10 relative z-10">
        <div className="container-main">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
            {features.map((f, i) => (
              <div key={i} className="card p-6 text-center group">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500 group-hover:text-white text-primary-500 transition-all duration-300">
                  <f.icon size={28} />
                </div>
                <h3 className="font-bold mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Page Content */}
      {page && tr(page)?.content && (
        <section className="py-16">
          <div className="container-main max-w-4xl">
            <div
              className="prose prose-lg max-w-none prose-headings:text-primary-700 prose-a:text-primary-500"
              dangerouslySetInnerHTML={{ __html: tr(page).content }}
            />
          </div>
        </section>
      )}

      {/* Leadership */}
      {leaders.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container-main">
            <div className="text-center mb-12">
              <h2 className="section-title">{t("about.leadership")}</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto mt-3 rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
              {leaders.map((l) => (
                <div key={l._id} className="card p-8 text-center group">
                  <div className="relative w-36 h-36 mx-auto mb-5">
                    {l.photo ? (
                      <img
                        src={l.photo}
                        alt=""
                        className="w-full h-full rounded-full object-cover ring-4 ring-primary-100 group-hover:ring-primary-300 transition-all"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-400">
                        <HiUserGroup size={48} />
                      </div>
                    )}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs px-4 py-1 rounded-full font-medium whitespace-nowrap">
                      {tr(l).role || ""}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-primary-700 mt-2">
                    {tr(l).fullName || "—"}
                  </h3>
                  {tr(l).bio && (
                    <p className="text-gray-500 text-sm mt-3 line-clamp-3">{tr(l).bio}</p>
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
