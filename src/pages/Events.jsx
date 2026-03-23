import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiCalendar, HiArrowRight, HiSpeakerphone } from "react-icons/hi";
import api from "../api";

export default function Events() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const lang = i18n.language;
  const tr = (item) => item.translations?.find((t) => t.lang === lang) || item.translations?.[0] || {};

  useEffect(() => {
    api.get("/events").then((r) => setEvents(r.data)).catch(() => {});
  }, []);

  const typeConfig = {
    seminar: { label: t("events.seminar"), bg: "bg-blue-100 text-blue-700 border-blue-200" },
    conference: { label: t("events.conference"), bg: "bg-purple-100 text-purple-700 border-purple-200" },
    competition: { label: t("events.competition"), bg: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-900 to-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 kk-pattern-horn opacity-60" />
        <div className="absolute left-0 top-0 bottom-0 w-14 kk-border-vertical opacity-30" />
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-[120px]" />

        <div className="container-main relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-1 bg-accent-500 rounded-full" />
            <span className="text-accent-400 text-sm font-medium uppercase tracking-[0.2em]">
              {t("events.hero_label")}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("nav.events")}</h1>
          <p className="text-white/60 text-lg max-w-lg">
            {t("events.hero_desc")}
          </p>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-sand-50 to-white">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 stagger-children">
            {events.map((e) => {
              const tc = typeConfig[e.type] || typeConfig.seminar;
              const date = e.date ? new Date(e.date) : null;
              return (
                <Link
                  key={e._id}
                  to={`/events/${e.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-gray-100"
                >
                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    {e.image ? (
                      <img src={e.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full placeholder-img flex items-center justify-center">
                        <HiSpeakerphone className="w-16 h-16 text-white/15" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${tc.bg}`}>
                        {tc.label}
                      </span>
                    </div>

                    {date && (
                      <div className="absolute top-3 right-3 bg-white rounded-xl overflow-hidden min-w-[56px] shadow-lg text-center">
                        <div className="bg-accent-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 tracking-wider">
                          {date.toLocaleString("default", { month: "short" })}
                        </div>
                        <div className="text-2xl font-extrabold text-gray-800 py-1 leading-none">
                          {date.getDate()}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5">
                    {date && (
                      <span className="text-xs text-gray-400 flex items-center gap-1.5 mb-2">
                        <HiCalendar className="w-3.5 h-3.5 text-accent-500" />
                        {date.toLocaleDateString()}
                      </span>
                    )}
                    <h3 className="font-bold text-lg group-hover:text-primary-600 transition-colors mb-2 leading-snug">
                      {tr(e).title || "—"}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                      {tr(e).description?.replace(/<[^>]*>/g, '') || ""}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-accent-500 text-sm font-semibold mt-4 group-hover:gap-3 transition-all duration-300">
                      {t("home.read_more")} <HiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {events.length === 0 && (
            <div className="text-center py-24 text-gray-300">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <HiSpeakerphone className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-lg">{t("common.loading")}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
