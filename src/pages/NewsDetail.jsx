import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiArrowLeft, HiCalendar, HiArrowRight, HiNewspaper } from "react-icons/hi";
import api from "../api";

export default function NewsDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState(null);
  const [related, setRelated] = useState([]);
  const lang = i18n.language;
  const tr = (item) => item.translations?.find((t) => t.lang === lang) || item.translations?.[0] || {};

  useEffect(() => {
    api.get(`/news/${slug}`).then((r) => setNews(r.data)).catch(() => {});
    api.get("/news?limit=4").then((r) => {
      const all = r.data?.data || r.data || [];
      setRelated(all.filter((n) => n.slug !== slug).slice(0, 3));
    }).catch(() => {});
  }, [slug]);

  if (!news) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HiNewspaper className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-gray-400">{t("common.loading")}</p>
      </div>
    </div>
  );

  const current = tr(news);
  const date = news.publishedAt ? new Date(news.publishedAt) : null;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-900 to-black text-white py-20 overflow-hidden">
        <div className="absolute inset-0 kk-pattern-main opacity-60" />
        <div className="container-main relative z-10">
          <Link to="/news" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <HiArrowLeft className="w-4 h-4" /> {t("common.back")}
          </Link>
          {date && (
            <div className="flex items-center gap-2 text-accent-400 text-sm mb-4">
              <HiCalendar className="w-4 h-4" />
              {date.toLocaleDateString()}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight max-w-3xl">
            {current?.title || "—"}
          </h1>
        </div>
      </section>

      {/* Content + Related sidebar */}
      <section className="py-16">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2">
              {news.image && (
                <img src={news.image} alt="" className="w-full rounded-2xl mb-10 max-h-[480px] object-cover shadow-lg" />
              )}
              <div
                className="prose prose-lg max-w-none prose-headings:text-primary-800 prose-a:text-accent-600 prose-p:text-gray-600 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: current?.content || "" }}
              />
            </div>

            {/* Related sidebar */}
            {related.length > 0 && (
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-6 h-1 bg-accent-500 rounded-full" />
                    <h2 className="text-sm font-bold text-primary-800 uppercase tracking-wider">{t("home.latest_news")}</h2>
                  </div>
                  <div className="space-y-4">
                    {related.map((n) => (
                      <Link
                        key={n._id}
                        to={`/news/${n.slug}`}
                        className="group flex gap-4 p-3 rounded-xl hover:bg-sand-50 transition-colors"
                      >
                        {n.image ? (
                          <img src={n.image} alt="" className="w-20 h-16 rounded-lg object-cover shrink-0 border border-gray-100" />
                        ) : (
                          <div className="w-20 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <HiNewspaper className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                            {tr(n).title || "—"}
                          </h3>
                          {n.publishedAt && (
                            <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-1.5">
                              <HiCalendar className="w-3 h-3 text-accent-500" />
                              {new Date(n.publishedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
