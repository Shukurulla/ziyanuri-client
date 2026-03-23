import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaTelegram, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Asosiy qism */}
      <div className="bg-gradient-to-b from-primary-900 via-primary-900 to-black relative">
        {/* Milliy naqsh overlay */}
        <div className="absolute inset-0 kk-pattern-yurt" />

        {/* Dekorativ doiralar */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-accent-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-primary-400/5 rounded-full blur-3xl" />

        <div className="container-main py-16 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 sm:gap-8 md:gap-10">
            {/* Logo & Description */}
            <div className="sm:col-span-2 md:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl shadow-lg shadow-accent-500/30" />
                  <div className="absolute inset-[3px] border border-white/20 rounded-lg" />
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-white">
                    ZN
                  </div>
                </div>
                <div>
                  <span className="font-bold text-xl block text-white">Ziya Nuri</span>
                  <span className="text-xs text-accent-400 uppercase tracking-[0.2em]">
                    {t("home.hero_subtitle")}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
                {t("footer.description")}
              </p>

              {/* Social */}
              <div className="flex gap-3">
                {[
                  { Icon: FaTelegram, color: "hover:bg-[#0088cc]" },
                  { Icon: FaInstagram, color: "hover:bg-gradient-to-br hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045]" },
                  { Icon: FaFacebook, color: "hover:bg-[#1877f2]" },
                  { Icon: FaYoutube, color: "hover:bg-[#ff0000]" },
                ].map(({ Icon, color }, i) => (
                  <a
                    key={i}
                    href="#"
                    className={`w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/70
                      hover:scale-110 hover:text-white transition-all duration-300 ${color}`}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3">
              <h3 className="font-semibold mb-6 text-accent-500 uppercase text-sm tracking-[0.15em] flex items-center gap-2">
                <span className="w-6 h-px bg-accent-500" />
                {t("footer.pages")}
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                {[
                  { to: "/about", label: t("nav.about") },
                  { to: "/heritage", label: t("nav.heritage") },
                  { to: "/projects", label: t("nav.projects") },
                  { to: "/media", label: t("nav.media") },
                  { to: "/events", label: t("nav.events") },
                ].map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="hover:text-accent-400 hover:pl-2 transition-all duration-300 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-accent-500/50 rounded-full" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact info */}
            <div className="md:col-span-4">
              <h3 className="font-semibold mb-6 text-accent-500 uppercase text-sm tracking-[0.15em] flex items-center gap-2">
                <span className="w-6 h-px bg-accent-500" />
                {t("contact.title")}
              </h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="w-8 h-8 bg-accent-500/15 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-accent-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </span>
                  {t("footer.address_value")}
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-accent-500/15 rounded-lg flex items-center justify-center shrink-0 text-accent-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </span>
                  +998 61 222-22-22
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-accent-500/15 rounded-lg flex items-center justify-center shrink-0 text-accent-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </span>
                  info@ziyanuri.uz
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-400">
              &copy; {year} Ziya Nuri. {t("footer.rights")}.
            </p>
            <p className="text-xs text-gray-400 font-medium tracking-wider">ziyanuri.uz</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
