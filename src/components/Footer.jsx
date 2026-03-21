import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaTelegram, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden">
      {/* Ornament overlay */}
      <div className="absolute inset-0 opacity-5 pattern-bg" />

      <div className="container-main py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Logo & Description */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                ZN
              </div>
              <div>
                <span className="font-bold text-xl block">Ziya Nuri</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  {t("home.hero_subtitle")}
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Qoraqalpog'iston Respublikasining ruhiy-ma'rifiy markazi. Milliy qadriyatlarni saqlash va targ'ib qilish.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-6">
              {[FaTelegram, FaInstagram, FaFacebook, FaYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-accent-500 hover:scale-110 transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="font-semibold mb-5 text-accent-500 uppercase text-sm tracking-wider">
              Sahifalar
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
                  <Link to={l.to} className="hover:text-white hover:pl-1 transition-all duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="md:col-span-4">
            <h3 className="font-semibold mb-5 text-accent-500 uppercase text-sm tracking-wider">
              {t("contact.title")}
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>Nukus, Qoraqalpog'iston Respublikasi</li>
              <li>+998 61 222-22-22</li>
              <li>info@ziyanuri.uz</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400">
            &copy; {year} Ziya Nuri. {t("footer.rights")}.
          </p>
          <p className="text-xs text-gray-500">ziyanuri.uz</p>
        </div>
      </div>
    </footer>
  );
}
