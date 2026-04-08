import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HiArrowRight,
  HiCalendar,
  HiChevronLeft,
  HiChevronRight,
  HiAcademicCap,
  HiBookOpen,
  HiUserGroup,
  HiGlobe,
  HiNewspaper,
  HiLightningBolt,
  HiStar,
  HiPlay,
} from "react-icons/hi";
import api from "../api";

/* ── Scroll-triggered visibility ── */
function useOnScreen(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return visible;
}

/* ── Counter with scroll trigger ── */
function StatCounter({ value, label, icon: Icon }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = Math.ceil(value / 40);
          const timer = setInterval(() => {
            start += step;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else setCount(start);
          }, 30);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center group">
      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-accent-400/20 to-accent-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-accent-500/20">
        <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-accent-600" />
      </div>
      <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold gradient-text mb-1 sm:mb-2 tabular-nums">
        {count}+
      </div>
      <div className="text-gray-500 font-medium text-sm">{label}</div>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ title, subtitle, action, actionTo, light }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
      <div>
        <h2
          className={`text-2xl md:text-3xl font-bold mb-2 ${light ? "text-white" : "text-primary-800"}`}
        >
          {title}
        </h2>
        <div className="flex items-center gap-3 mt-3">
          <div
            className={`w-12 h-1 rounded-full ${light ? "bg-accent-400" : "bg-accent-500"}`}
          />
          <div
            className={`w-3 h-3 rotate-45 rounded-sm ${light ? "bg-accent-400" : "bg-accent-500"}`}
          />
          <div
            className={`w-8 h-1 rounded-full ${light ? "bg-accent-400/50" : "bg-accent-500/50"}`}
          />
        </div>
        {subtitle && (
          <p className={`mt-4 ${light ? "text-white/60" : "text-gray-500"}`}>
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <Link
          to={actionTo}
          className={`${light ? "border-white/30 text-white hover:bg-white hover:text-primary-800" : "border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"} border-2 px-5 py-2 rounded-xl font-medium flex items-center gap-2 shrink-0 transition-all duration-300`}
        >
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

  const newsRef = useRef(null);
  const newsVisible = useOnScreen(newsRef);
  const featuresRef = useRef(null);
  const featuresVisible = useOnScreen(featuresRef);

  useEffect(() => {
    api
      .get("/banners")
      .then((r) => setBanners(r.data))
      .catch(() => {});
    api
      .get("/news?limit=6")
      .then((r) => setNews(r.data?.data || []))
      .catch(() => {});
    api
      .get("/stats")
      .then((r) => setStats(r.data))
      .catch(() => {});
    api
      .get("/projects?status=current")
      .then((r) => setProjects(r.data?.slice(0, 3) || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % banners.length),
      6000,
    );
    return () => clearInterval(timer);
  }, [banners.length]);

  const lang = i18n.language;
  const tr = (item) =>
    item.translations?.find((t) => t.lang === lang) ||
    item.translations?.[0] ||
    {};

  const statIcons = [HiAcademicCap, HiBookOpen, HiUserGroup, HiGlobe];

  const features = [
    {
      icon: HiAcademicCap,
      title: t("about.feature_education"),
      desc: t("about.feature_education_desc"),
      color: "from-blue-500 to-primary-600",
    },
    {
      icon: HiBookOpen,
      title: t("about.feature_heritage"),
      desc: t("about.feature_heritage_desc"),
      color: "from-accent-500 to-accent-700",
    },
    {
      icon: HiGlobe,
      title: t("about.feature_cooperation"),
      desc: t("about.feature_cooperation_desc"),
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: HiLightningBolt,
      title: t("about.feature_innovation"),
      desc: t("about.feature_innovation_desc"),
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div>
      {/* ═══ Hero Section ═══ */}
      <section className="relative h-[480px] sm:h-[600px] md:h-[680px] overflow-hidden">
        {banners.length > 0 ? (
          banners.map((b, i) => (
            <div
              key={b._id}
              className={`absolute inset-0 transition-all duration-1000 ${
                i === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
            >
              <img
                src={b.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-primary-900/20" />
              {/* Naqsh overlay */}
              <div className="absolute inset-0 kk-pattern-main opacity-40" />
              {/* Yon naqsh */}
              <div className="absolute right-0 top-0 bottom-0 w-12 kk-border-vertical opacity-30" />

              <div className="absolute inset-0 flex items-end pb-24 md:pb-32">
                <div className="container-main">
                  <div className="max-w-2xl animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-1 bg-accent-500 rounded-full" />
                      <span className="text-accent-400 text-sm font-medium uppercase tracking-[0.2em]">
                        {t("home.hero_subtitle")}
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-[1.15]">
                      {tr(b).title || t("home.hero_title")}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 mb-8 leading-relaxed">
                      {tr(b).subtitle || t("home.hero_subtitle")}
                    </p>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      <Link
                        to="/about"
                        className="btn-secondary inline-flex items-center gap-2 text-base sm:text-lg px-5 sm:px-8 py-3 sm:py-3.5"
                      >
                        {t("home.read_more")} <HiArrowRight />
                      </Link>
                      <Link
                        to="/media"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white border border-white/20 hover:border-white/40 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-medium transition-all duration-300 hover:bg-white/5"
                      >
                        <HiPlay className="w-5 h-5" /> {t("nav.media")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
            <div className="absolute inset-0 kk-pattern-main" />
            <div className="absolute left-0 top-0 bottom-0 w-16 kk-border-vertical opacity-40" />
            <div className="absolute right-0 top-0 bottom-0 w-16 kk-border-vertical opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div className="animate-fade-in-up">
                <div className="relative w-28 h-28 mx-auto mb-10">
                  <div className="absolute inset-0 bg-white/10 rounded-3xl rotate-45" />
                  <div className="absolute inset-2 border-2 border-accent-500/30 rounded-2xl rotate-45" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-extrabold text-white">
                      <img src="/logo.png" className="w-[100px]" />
                    </span>
                  </div>
                </div>
                <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold text-white mb-5 leading-[1.15] px-4">
                  {t("home.hero_title")}
                </h1>
                <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/60 mb-10 px-4">
                  {t("home.hero_subtitle")}
                </p>
                <Link
                  to="/about"
                  className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-3.5"
                >
                  {t("home.read_more")} <HiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Slider controls */}
        {banners.length > 1 && (
          <>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === currentSlide
                      ? "bg-accent-500 w-10"
                      : "bg-white/30 w-2 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentSlide(
                  (p) => (p - 1 + banners.length) % banners.length,
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-accent-500 transition-all duration-300 border border-white/10"
            >
              <HiChevronLeft size={24} />
            </button>
            <button
              onClick={() => setCurrentSlide((p) => (p + 1) % banners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-accent-500 transition-all duration-300 border border-white/10"
            >
              <HiChevronRight size={24} />
            </button>
          </>
        )}

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-auto">
            <path
              fill="#ffffff"
              d="M0,60 L0,30 Q360,0 720,30 Q1080,60 1440,30 L1440,60Z"
            />
          </svg>
        </div>
      </section>

      {/* ═══ Features strip ═══ */}
      <section ref={featuresRef} className="py-10 -mt-6 relative z-10">
        <div className="container-main">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 ${featuresVisible ? "stagger-children" : ""}`}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 sm:p-5 group shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex items-start gap-3 sm:gap-4"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <f.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-800 text-sm mb-0.5">
                    {f.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Stats Section ═══ */}
      {stats.length > 0 && (
        <section className="py-20 bg-white relative">
          <div className="absolute inset-0 kk-pattern-horn opacity-50" />
          <div className="absolute left-0 top-0 bottom-0 w-10 kk-border-vertical opacity-20" />
          <div className="absolute right-0 top-0 bottom-0 w-10 kk-border-vertical opacity-20" />
          <div className="container-main relative z-10">
            <div className="text-center mb-14">
              <h2 className="section-title">{t("home.stats_title")}</h2>
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="w-12 h-1 bg-accent-500 rounded-full" />
                <div className="w-3 h-3 rotate-45 bg-accent-500 rounded-sm" />
                <div className="w-12 h-1 bg-accent-500 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 md:gap-12 stagger-children">
              {stats.map((s, i) => (
                <StatCounter
                  key={s._id}
                  value={s.value}
                  label={tr(s).label || s.key}
                  icon={statIcons[i % statIcons.length]}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Ornament divider ═══ */}
      <div className="section-divider" />

      {/* ═══ Latest News ═══ */}
      <section
        ref={newsRef}
        className="py-20 bg-gradient-to-b from-sand-50 to-white"
      >
        <div className="container-main">
          <SectionHeader
            title={t("home.latest_news")}
            action={t("home.view_all")}
            actionTo="/news"
          />

          {news.length > 0 ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 ${newsVisible ? "stagger-children" : ""}`}
            >
              {news.map((n) => (
                <Link
                  key={n._id}
                  to={`/news/${n.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-gray-100/80"
                >
                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    {n.image ? (
                      <img
                        src={n.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full placeholder-img flex items-center justify-center">
                        <HiNewspaper className="w-16 h-16 text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {n.publishedAt && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm">
                          <HiCalendar className="w-3.5 h-3.5 text-accent-500" />
                          {new Date(n.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                      {tr(n).title || "—"}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                      {tr(n).summary || ""}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-accent-500 text-sm font-semibold mt-4 group-hover:gap-3 transition-all duration-300">
                      {t("home.read_more")}{" "}
                      <HiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-300">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <HiNewspaper className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-lg">{t("common.loading")}</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ Projects Preview ═══ */}
      {projects.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 kk-pattern-main opacity-60" />
          <div className="absolute left-0 top-0 bottom-0 w-14 kk-border-vertical opacity-30" />
          <div className="absolute right-0 top-0 bottom-0 w-14 kk-border-vertical opacity-30" />
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-accent-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-36 h-36 sm:w-72 sm:h-72 bg-primary-400/10 rounded-full blur-[80px]" />

          <div className="container-main relative z-10">
            <SectionHeader
              title={t("home.our_projects")}
              action={t("home.view_all")}
              actionTo="/projects"
              light
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7 stagger-children">
              {projects.map((p) => (
                <Link
                  key={p._id}
                  to={`/projects/${p.slug}`}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-accent-500/30 hover:bg-white/10 transition-all duration-500"
                >
                  {p.image ? (
                    <div className="h-44 sm:h-52 overflow-hidden">
                      <img
                        src={p.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-44 sm:h-52 placeholder-img flex items-center justify-center">
                      <HiStar className="w-16 h-16 text-white/10" />
                    </div>
                  )}
                  <div className="p-4 sm:p-6 relative">
                    <span className="badge bg-accent-500/20 text-accent-400 border border-accent-500/30 mb-3">
                      {p.status === "completed"
                        ? t("projects.completed")
                        : t("projects.current")}
                    </span>
                    <h3 className="font-bold text-lg mt-2 group-hover:text-accent-400 transition-colors leading-snug">
                      {tr(p).title || "—"}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-accent-400/70 text-sm font-medium mt-4 group-hover:gap-3 group-hover:text-accent-400 transition-all duration-300">
                      {t("home.read_more")}{" "}
                      <HiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA Section ═══ */}
      <section className="py-24 bg-gradient-to-br from-sand-50 via-white to-sand-50 relative overflow-hidden">
        <div className="absolute inset-0 kk-pattern-horn opacity-30" />
        <div className="absolute top-10 left-1/4 w-40 h-40 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl" />

        <div className="container-main text-center relative z-10">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-1 bg-accent-500 rounded-full" />
              <div className="w-2.5 h-2.5 rotate-45 bg-accent-500 rounded-sm" />
              <div className="w-8 h-1 bg-accent-500 rounded-full" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              {t("contact.send_message")}
            </h2>
            <p className="text-gray-500 mb-10 leading-relaxed">
              {t("contact.hero_desc")}
            </p>
            <Link
              to="/contact"
              className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4 rounded-2xl"
            >
              {t("contact.title")} <HiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
