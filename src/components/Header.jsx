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
    `relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "text-primary-500"
        : "text-gray-600 hover:text-primary-500"
    } after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:bg-primary-500 after:transition-all after:duration-300 ${
      isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl rotate-0 group-hover:rotate-6 transition-transform duration-300" />
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                ZN
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-primary-700 text-lg block leading-tight">
                Ziya Nuri
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                {t("home.hero_subtitle")}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass} end={l.to === "/"}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-primary-500 hover:bg-gray-100 rounded-lg transition"
              onClick={() => setOpen(!open)}
            >
              {open ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-96 pb-4" : "max-h-0"
          }`}
        >
          <nav className="border-t pt-2 space-y-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-600 hover:bg-gray-50"
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
    </header>
  );
}
