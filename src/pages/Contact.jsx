import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiLocationMarker, HiPhone, HiMail, HiCheckCircle } from "react-icons/hi";
import api from "../api";

export default function Contact() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get("/contact").then((r) => {
      const map = {};
      r.data.forEach((c) => (map[c.key] = c.value));
      setContacts(map);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/feedback", form);
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      alert(t("common.error"));
    }
    setSending(false);
  };

  const infoCards = [
    { icon: HiLocationMarker, label: t("contact.address"), value: contacts.address, color: "text-red-500 bg-red-50" },
    { icon: HiPhone, label: t("contact.phone"), value: contacts.phone, color: "text-green-500 bg-green-50" },
    { icon: HiMail, label: t("contact.email"), value: contacts.email, color: "text-blue-500 bg-blue-50" },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pattern-bg" />
        <div className="container-main relative z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("contact.title")}</h1>
          <div className="w-20 h-1 bg-accent-500 rounded-full" />
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-10 -mt-10 relative z-10">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
            {infoCards.map((c, i) => (
              <div key={i} className="card p-6 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
                  <c.icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{c.label}</h3>
                  <p className="text-gray-500 mt-1">{c.value || "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div>
              {contacts.lat && contacts.lng ? (
                <div className="rounded-2xl overflow-hidden h-[400px] shadow-lg">
                  <iframe
                    title="map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${contacts.lat},${contacts.lng}&z=15&output=embed`}
                  />
                </div>
              ) : (
                <div className="rounded-2xl h-[400px] bg-gray-100 flex items-center justify-center text-gray-300 text-7xl">
                  🗺️
                </div>
              )}
            </div>

            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-primary-700 mb-2">{t("contact.send_message")}</h2>
              <p className="text-gray-500 mb-6">Bizga xabar qoldiring, tez orada javob beramiz</p>

              {sent ? (
                <div className="p-8 bg-emerald-50 rounded-2xl text-center animate-fade-in-up">
                  <HiCheckCircle size={56} className="text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-emerald-700 mb-2">{t("contact.success")}</h3>
                  <button onClick={() => setSent(false)} className="text-primary-500 hover:underline mt-2">
                    Yana xabar yuborish
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder={t("contact.name")}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    />
                    <input
                      type="email"
                      required
                      placeholder={t("contact.email")}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder={t("contact.phone")}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  />
                  <textarea
                    required
                    rows={5}
                    placeholder={t("contact.message")}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none transition"
                  />
                  <button type="submit" disabled={sending} className="btn-primary w-full py-3.5 text-lg disabled:opacity-50">
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
