import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiCheckCircle,
  HiMap,
} from "react-icons/hi";
import api from "../api";

export default function Contact() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api
      .get("/contact")
      .then((r) => {
        const map = {};
        r.data.forEach((c) => (map[c.key] = c.value));
        setContacts(map);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/feedback", {
        ...form,
        phone: form.phone ? "+998 " + form.phone : "",
      });
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      alert(t("common.error"));
    }
    setSending(false);
  };

  const infoCards = [
    {
      icon: HiLocationMarker,
      label: t("contact.address"),
      value:
        "Қарақалпақстан Республикасы Нөкис қаласы, Ислам Каримов гуззары 109 үй",
      gradient: "from-rose-500 to-red-500",
    },
    {
      icon: HiPhone,
      label: t("contact.phone"),
      value: "+998 (55) 104-13-21",
      gradient: "from-emerald-500 to-green-500",
    },
    {
      icon: HiMail,
      label: t("contact.email"),
      value: "kr_manaviyat@exat.uz",
      gradient: "from-blue-500 to-primary-500",
    },
  ];

  const inputClass =
    "w-full px-5 py-3.5 bg-sand-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 focus:bg-white outline-none transition-all duration-300 text-gray-700 placeholder:text-gray-400";

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-900 to-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 kk-pattern-main opacity-60" />
        <div className="absolute right-0 top-0 bottom-0 w-14 kk-border-vertical opacity-30" />
        <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-80 sm:h-80 bg-accent-500/10 rounded-full blur-[100px]" />

        <div className="container-main relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-1 bg-accent-500 rounded-full" />
            <span className="text-accent-400 text-sm font-medium uppercase tracking-[0.2em]">
              {t("contact.hero_label")}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-white/60 text-lg max-w-lg">
            {t("contact.hero_desc")}
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-8 -mt-14 relative z-10">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 stagger-children">
            {infoCards.map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-gray-100"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${c.gradient} rounded-xl flex items-center justify-center shrink-0 text-white shadow-lg`}
                >
                  <c.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">
                    {c.label}
                  </h3>
                  <p className="text-gray-600 mt-1 text-xs font-medium">
                    {c.value || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-sand-50">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Map */}
            <div>
              <h3 className="text-lg font-bold text-primary-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-1 bg-accent-500 rounded-full" />
                {t("contact.our_address")}
              </h3>
              <div className="rounded-2xl overflow-hidden h-[280px] sm:h-[350px] lg:h-[420px] shadow-lg border border-gray-200">
                <iframe
                  title="map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=42.459330,59.616738&z=15&output=embed`}
                />
              </div>
            </div>

            {/* Form */}
            <div>
              <h3 className="text-lg font-bold text-primary-800 mb-2 flex items-center gap-2">
                <span className="w-8 h-1 bg-accent-500 rounded-full" />
                {t("contact.send_message")}
              </h3>
              <p className="text-gray-500 mb-8 text-sm">
                {t("contact.form_desc")}
              </p>

              {sent ? (
                <div className="p-10 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl text-center animate-fade-in-up border border-emerald-100">
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
                    <HiCheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-700 mb-2">
                    {t("contact.success")}
                  </h3>
                  <p className="text-emerald-600/60 text-sm mb-4">
                    {t("contact.success_desc")}
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-accent-600 hover:text-accent-700 font-medium text-sm hover:underline"
                  >
                    {t("contact.send_again")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        {t("contact.name")}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t("contact.name_placeholder")}
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        {t("contact.email")}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="email@example.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      {t("contact.phone")}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                        +998
                      </span>
                      <input
                        type="tel"
                        placeholder="XX XXX XX XX"
                        value={form.phone}
                        onChange={(e) => {
                          const raw = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 9);
                          let formatted = "";
                          if (raw.length > 0) formatted = raw.slice(0, 2);
                          if (raw.length > 2)
                            formatted += " " + raw.slice(2, 5);
                          if (raw.length > 5)
                            formatted += " " + raw.slice(5, 7);
                          if (raw.length > 7)
                            formatted += " " + raw.slice(7, 9);
                          setForm({ ...form, phone: formatted });
                        }}
                        className={`${inputClass} pl-16`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      {t("contact.message")}
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder={t("contact.message_placeholder")}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-secondary w-full py-4 text-lg disabled:opacity-50 rounded-xl"
                  >
                    {sending ? t("common.loading") : t("contact.submit")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
