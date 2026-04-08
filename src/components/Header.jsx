import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiMenu, HiX } from "react-icons/hi";
import LangSwitcher from "./LangSwitcher";

export default function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/heritage", label: t("nav.heritage") },
    { to: "/projects", label: t("nav.projects") },
    { to: "/media", label: t("nav.media") },
    { to: "/events", label: t("nav.events") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const navClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
      isActive ? "text-accent-500" : "text-gray-600 hover:text-accent-500"
    } after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:rounded-full after:transition-all after:duration-300 ${
      isActive
        ? "after:w-full after:bg-accent-500"
        : "after:w-0 hover:after:w-full after:bg-accent-500"
    }`;

  return (
    <>
      {/* Milliy naqshli yuqori chiziq */}
      <div className="h-1.5 bg-gradient-to-r from-primary-700 via-accent-500 to-primary-700" />

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/60 backdrop-blur-2xl backdrop-saturate-150 shadow-lg shadow-primary-900/5 border-b border-white/60"
            : "bg-white/70 backdrop-blur-xl backdrop-saturate-125"
        }`}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Ziya Nuri"
                className="w-14 rounded-[10px] h-14 object-contain group-hover:scale-110 transition-transform duration-300"
              />
              <div className="hidden sm:block">
                <span className="font-bold text-primary-800 text-lg block leading-tight tracking-tight">
                  Ziya Nuri
                </span>
                <span className="text-[10px] text-accent-600 uppercase tracking-[0.2em] font-medium">
                  {t("home.hero_subtitle")}
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={navClass}
                  end={l.to === "/"}
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <LangSwitcher />
              <button
                className="lg:hidden p-2 text-gray-600 hover:text-accent-500 hover:bg-sand-100 rounded-xl transition-all duration-200"
                onClick={() => setOpen(!open)}
              >
                {open ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-400 ${
              open ? "max-h-[500px] pb-4" : "max-h-0"
            }`}
          >
            <nav className="border-t border-gray-100 pt-2 space-y-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary-50 to-sand-50 text-accent-600 border-l-3 border-accent-500"
                        : "text-gray-600 hover:bg-sand-50 hover:text-accent-600"
                    }`
                  }
                  onClick={() => setOpen(false)}
                  end={l.to === "/"}
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Naqshli pastki chiziq */}
        <div
          className={`ornament-line transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-40"}`}
        />
      </header>
    </>
  );
}
