import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiCalendar, HiArrowRight } from "react-icons/hi";
import api from "../api";

export default function Events() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const lang = i18n.language;
  const tr = (item) => item.translations?.find((t) => t.lang === lang) || item.translations?.[0] || {};

  useEffect(() => {
    api.get("/events").then((r) => setEvents(r.data)).catch(() => {});
  }, []);

  const typeColors = { seminar: "badge-blue", conference: "badge-purple", competition: "badge-green" };
  const typeLabels = { seminar: "Seminar", conference: "Konferensiya", competition: "Konkurs" };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pattern-bg" />
        <div className="container-main relative z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("nav.events")}</h1>
          <div className="w-20 h-1 bg-accent-500 rounded-full" />
        </div>
      </section>

      <section className="py-16">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
            {events.map((e) => (
              <Link key={e._id} to={`/events/${e.slug}`} className="card group">
                <div className="relative h-52 overflow-hidden">
                  {e.image ? (
                    <img src={e.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-6xl opacity-50">
                      🎤
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={typeColors[e.type] || "badge-blue"}>
                      {typeLabels[e.type] || e.type}
                    </span>
                  </div>
                  {e.date && (
                    <div className="absolute top-3 right-3 bg-white rounded-xl p-2 text-center min-w-[56px] shadow-lg">
                      <div className="text-xs text-primary-500 font-bold uppercase">
                        {new Date(e.date).toLocaleString("default", { month: "short" })}
                      </div>
                      <div className="text-xl font-extrabold text-gray-800 leading-none">
                        {new Date(e.date).getDate()}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  {e.date && (
                    <span className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                      <HiCalendar size={12} />
                      {new Date(e.date).toLocaleDateString()}
                    </span>
                  )}
                  <h3 className="font-bold text-lg group-hover:text-primary-500 transition-colors mb-2">
                    {tr(e).title || "—"}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {tr(e).description?.replace(/<[^>]*>/g, '') || ""}
                  </p>
                  <span className="inline-flex items-center gap-1 text-primary-500 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                    {t("home.read_more")} <HiArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-20 text-gray-300">
              <div className="text-7xl mb-4">🎤</div>
              <p className="text-lg">{t("common.loading")}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
