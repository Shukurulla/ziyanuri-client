import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiArrowRight, HiCalendar } from "react-icons/hi";
import api from "../api";

/* ── Counter with scroll trigger ── */
function StatCounter({ value, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(value / 50);
        const timer = setInterval(() => {
          start += step;
          if (start >= value) { setCount(value); clearInterval(timer); }
          else setCount(start);
        }, 25);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center group">
      <div className="text-5xl md:text-6xl font-extrabold gradient-text mb-2 group-hover:scale-110 transition-transform">
        {count}+
      </div>
      <div className="text-gray-500 font-medium">{label}</div>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ title, subtitle, action, actionTo }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action && (
        <Link to={actionTo} className="btn-outline flex items-center gap-2 shrink-0">
          {action} <HiArrowRight />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [banners, setBanners] = useState([]);
  const [news, setNews] = useState([]);
  const [stats, setStats] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    api.get("/banners").then((r) => setBanners(r.data)).catch(() => {});
    api.get("/news?limit=6").then((r) => setNews(r.data?.data || [])).catch(() => {});
    api.get("/stats").then((r) => setStats(r.data)).catch(() => {});
    api.get("/projects?status=current").then((r) => setProjects(r.data?.slice(0, 3) || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const lang = i18n.language;
  const tr = (item) => item.translations?.find((t) => t.lang === lang) || item.translations?.[0] || {};

  return (
    <div>
      {/* ═══ Hero Section ═══ */}
      <section className="relative h-[550px] md:h-[620px] overflow-hidden">
        {banners.length > 0 ? (
          banners.map((b, i) => (
            <div
              key={b._id}
              className={`absolute inset-0 transition-all duration-1000 ${
                i === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            >
              <img src={b.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-end pb-20 md:pb-28">
                <div className="container-main">
                  <div className="max-w-2xl animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
                      {tr(b).title || t("home.hero_title")}
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 mb-8">
                      {tr(b).subtitle || t("home.hero_subtitle")}
                    </p>
                    <Link to="/about" className="btn-secondary inline-flex items-center gap-2 text-lg">
                      {t("home.read_more")} <HiArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 pattern-bg">
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div className="animate-fade-in-up">
                <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
                  <span className="text-5xl font-extrabold text-white">ZN</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4">{t("home.hero_title")}</h1>
                <p className="text-xl md:text-2xl text-white/70 mb-8">{t("home.hero_subtitle")}</p>
                <Link to="/about" className="btn-secondary inline-flex items-center gap-2 text-lg">
                  {t("home.read_more")} <HiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Slider dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "bg-white w-8" : "bg-white/40 w-2"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ═══ Stats Section ═══ */}
      {stats.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
          <div className="container-main">
            <div className="text-center mb-12">
              <h2 className="section-title">{t("home.stats_title")}</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto mt-3 rounded-full" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 stagger-children">
              {stats.map((s) => (
                <StatCounter
                  key={s._id}
                  value={s.value}
                  label={tr(s).label || s.key}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Latest News ═══ */}
      <section className="py-20">
        <div className="container-main">
          <SectionHeader
            title={t("home.latest_news")}
            action={t("home.view_all")}
            actionTo="/news"
          />

          {news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
              {news.map((n) => (
                <Link key={n._id} to={`/news/${n.slug}`} className="card group">
                  <div className="relative h-52 overflow-hidden">
                    {n.image ? (
                      <img
                        src={n.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <span className="text-6xl opacity-30">📰</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      {n.publishedAt && (
                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <HiCalendar size={12} />
                          {new Date(n.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
                      {tr(n).title || "—"}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {tr(n).summary || ""}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary-500 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                      {t("home.read_more")} <HiArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-300">
              <div className="text-7xl mb-4">📰</div>
              <p className="text-lg">{t("common.loading")}</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ Projects Preview ═══ */}
      {projects.length > 0 && (
        <section className="py-20 bg-primary-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pattern-bg" />
          <div className="container-main relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">{t("home.our_projects")}</h2>
              <div className="w-16 h-1 bg-accent-500 mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 stagger-children">
              {projects.map((p) => (
                <Link key={p._id} to={`/projects/${p.slug}`} className="group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300">
                  {p.image && (
                    <div className="h-48 overflow-hidden">
                      <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="badge bg-accent-500/20 text-accent-500 mb-3">
                      {p.status === "completed" ? t("projects.completed") : t("projects.current")}
                    </span>
                    <h3 className="font-bold text-lg mt-2 group-hover:text-accent-500 transition-colors">
                      {tr(p).title || "—"}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/projects" className="btn-secondary inline-flex items-center gap-2">
                {t("home.view_all")} <HiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA Section ═══ */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="container-main text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            {t("contact.send_message")}
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto mb-8">
            Biz bilan bog'laning — savollaringizga javob beramiz
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-3">
            {t("contact.title")} <HiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
