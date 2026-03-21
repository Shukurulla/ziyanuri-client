import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiCalendar, HiArrowRight } from "react-icons/hi";
import api from "../api";

export default function News() {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState([]);
  const lang = i18n.language;
  const tr = (item) => item.translations?.find((t) => t.lang === lang) || item.translations?.[0] || {};

  useEffect(() => {
    api.get("/news").then((r) => setNews(r.data.data || r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pattern-bg" />
        <div className="container-main relative z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("nav.news")}</h1>
          <div className="w-20 h-1 bg-accent-500 rounded-full" />
        </div>
      </section>

      <section className="py-16">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
            {news.map((n) => (
              <Link key={n._id} to={`/news/${n.slug}`} className="card group">
                <div className="relative h-52 overflow-hidden">
                  {n.image ? (
                    <img src={n.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-6xl opacity-50">
                      📰
                    </div>
                  )}
                  {n.publishedAt && (
                    <div className="absolute top-3 right-3 bg-white rounded-xl p-2 text-center min-w-[56px] shadow-lg">
                      <div className="text-xs text-primary-500 font-bold uppercase">
                        {new Date(n.publishedAt).toLocaleString("default", { month: "short" })}
                      </div>
                      <div className="text-xl font-extrabold text-gray-800 leading-none">
                        {new Date(n.publishedAt).getDate()}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  {n.publishedAt && (
                    <span className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                      <HiCalendar size={12} />
                      {new Date(n.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                  <h3 className="font-bold text-lg group-hover:text-primary-500 transition-colors mb-2">
                    {tr(n).title || "—"}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {tr(n).summary || tr(n).content?.replace(/<[^>]*>/g, '') || ""}
                  </p>
                  <span className="inline-flex items-center gap-1 text-primary-500 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                    {t("home.read_more")} <HiArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {news.length === 0 && (
            <div className="text-center py-20 text-gray-300">
              <div className="text-7xl mb-4">📰</div>
              <p className="text-lg">{t("common.loading")}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
