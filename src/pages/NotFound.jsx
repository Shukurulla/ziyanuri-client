import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiHome, HiArrowLeft } from "react-icons/hi";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 kk-pattern-main opacity-30" />
      <div className="relative z-10 text-center px-4">
        <div className="text-[150px] md:text-[200px] font-extrabold leading-none text-primary-100 select-none">
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary-800 -mt-8 mb-3">
          Sahifa topilmadi
        </h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <HiArrowLeft className="w-4 h-4" /> {t("common.back")}
          </button>
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/25">
            <HiHome className="w-4 h-4" /> {t("nav.home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
