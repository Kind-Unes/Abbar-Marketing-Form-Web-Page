import React, { useState, useEffect, useCallback } from "react";

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // Replace with your Google Apps Script Web App URL
  GOOGLE_SCRIPT_URL:
    "https://script.google.com/macros/s/AKfycbxJ5YRI1nwPuqog1ZEVU6Lc_N5FeJlgAQTlD7OwMPDEEXjBimdNqM9XMvATv0grRH5ZZg/exec",

  // Social Media Links - Updated to your specific links
  social: {
    instagram: "https://www.instagram.com/abbar_tec/",
    facebook: "https://www.facebook.com/abbartec",
    youtube: "https://www.youtube.com/@abbartec",
    tiktok: "https://www.tiktok.com/@abbar__tec?_t=8n3fQvSsQVi&_r=1",
  },

  logo: "https://play-lh.googleusercontent.com/ACrvrBnlHR6OYEA4lxGXKtjAd61yJlyj3Q-fsY99BXnl9_7X42p2EouYNgPrQyOk_Fg",
};

// ============================================
// TRANSLATIONS
// ============================================
const translations = {
  ar: {
    dir: "rtl",
    lang: "ar",
    hero: {
      title: "شركة آبار التقنية العالمية",
      subtitle:
        "احفر بئرًا في الدول الفقيرة بآسيا وأفريقيا باسمك أو باسم من تحب",
      description: "واصنع أثرًا يمتد صداها للأبد",
    },
    form: {
      title: "سجّل الآن",
      subtitle: "ساهم بحفر بئر باسمك أو باسم من تحب",
      name: "الاسم الكامل",
      namePlaceholder: "أدخل اسمك الكامل",
      phone: "رقم الجوال",
      phonePlaceholder: "05xxxxxxxx",
      submit: "إرسال",
      submitting: "جارٍ الإرسال...",
      errors: {
        nameRequired: "الاسم مطلوب",
        phoneRequired: "رقم الجوال مطلوب",
        phoneInvalid: "رقم الجوال غير صحيح",
      },
    },
    thanks: {
      title: "شكراً لك!",
      subtitle: "تم استلام طلبك بنجاح",
      message: "سيتواصل معك فريقنا في أقرب وقت ممكن",
      back: "العودة للرئيسية",
    },
    footer: {
      company: "شركة آبار التقنية العالمية للمقاولات",
      companyEn: "Abar International Technology Contracting Company",
      rights: "جميع الحقوق محفوظة",
      followUs: "تابعنا",
    },
    nav: {
      switchLang: "English",
    },
  },
  en: {
    dir: "ltr", // English logic usually LTR, but we will force inputs to RTL per request
    lang: "en",
    hero: {
      title: "Create a Miracle That Echoes Forever",
      subtitle: "An Impact That Lasts",
      description: "Your ongoing charity is now within reach",
    },
    form: {
      title: "Register Now",
      subtitle: "Get a Free Consultation",
      name: "Full Name",
      namePlaceholder: "Enter your full name",
      phone: "Phone Number",
      phonePlaceholder: "+966 5xxxxxxxx",
      submit: "Submit",
      submitting: "Submitting...",
      errors: {
        nameRequired: "Name is required",
        phoneRequired: "Phone number is required",
        phoneInvalid: "Invalid phone number",
      },
    },
    thanks: {
      title: "Thank You!",
      subtitle: "Your request has been received",
      message: "Our team will contact you as soon as possible",
      back: "Back to Home",
    },
    footer: {
      company: "Abar International Technology Contracting Company",
      companyEn: "شركة آبار التقنية العالمية للمقاولات",
      rights: "All Rights Reserved",
      followUs: "Follow Us",
    },
    nav: {
      switchLang: "العربية",
    },
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const getCountryFromTimezone = () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const country = timezone.split("/")[0];
    return { timezone, country };
  } catch {
    return { timezone: "Unknown", country: "Unknown" };
  }
};

const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  return {
    userAgent: ua,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    isMobile,
  };
};

const formatDate = () => {
  const now = new Date();
  return {
    date: now.toLocaleDateString("en-GB"),
    time: now.toLocaleTimeString("en-GB"),
    timestamp: now.toISOString(),
  };
};

// ============================================
// ICONS COMPONENTS
// ============================================
const Icons = {
  Facebook: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  YouTube: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  TikTok: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  Check: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className="w-16 h-16"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  Water: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 opacity-20">
      <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z" />
    </svg>
  ),
};

// ============================================
// ANIMATED WATER BACKGROUND (OPTIMIZED FOR MOBILE)
// ============================================
const WaterBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {/* Background Image */}
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
      style={{ backgroundImage: "url(/bg.jpeg)" }}
    />

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#0a4d68]/70 via-[#088395]/70 to-[#05bfdb]/70" />

    {/* Simplified animated ripple - only one for performance */}
    <div className="absolute inset-0">
      <div className="absolute bottom-0 left-0 right-0 h-96 opacity-20">
        <div className="absolute inset-0 animate-ripple-1">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-full rounded-[50%] border border-white/10" />
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// FORM COMPONENT
// ============================================
const LeadForm = ({ t, lang, onSuccess }) => {
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t.form.errors.nameRequired;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t.form.errors.phoneRequired;
    } else if (!/^[\d\s+()-]{8,}$/.test(formData.phone)) {
      newErrors.phone = t.form.errors.phoneInvalid;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const { timezone, country } = getCountryFromTimezone();
    const deviceInfo = getDeviceInfo();
    const dateInfo = formatDate();

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      language: lang,
      date: dateInfo.date,
      time: dateInfo.time,
      timestamp: dateInfo.timestamp,
      timezone,
      country,
      platform: deviceInfo.platform,
      screenSize: `${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`,
      isMobile: deviceInfo.isMobile,
      userAgent: deviceInfo.userAgent,
      browserLanguage: deviceInfo.language,
      referrer: document.referrer || "direct",
      pageUrl: window.location.href,
    };

    try {
      // Send to Google Sheets
      if (CONFIG.GOOGLE_SCRIPT_URL !== "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
        await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Demo mode - log to console
        console.log("Form submission (Demo Mode):", payload);
      }

      onSuccess();
    } catch (error) {
      console.error("Submission error:", error);
      // Still redirect on error (data might have been saved)
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name Field - RTL ALIGNED RIGHT */}
      <div className="group text-right">
        <label className="block text-sm font-medium text-white/90 mb-2">
          {t.form.name}
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={t.form.namePlaceholder}
          // Added text-right and dir="rtl" to force right alignment
          className={`
            w-full px-5 py-4 rounded-2xl
            bg-white/15
            border-2 text-right
            text-white placeholder-white/40
            focus:outline-none focus:bg-white/20
            transition-colors duration-200
            ${
              errors.name
                ? "border-red-400/60 focus:border-red-400"
                : "border-white/20 focus:border-white/50 hover:border-white/30"
            }
          `}
          dir="rtl"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-300 animate-shake">
            {errors.name}
          </p>
        )}
      </div>

      {/* Phone Field - RTL ALIGNED RIGHT */}
      <div className="group text-right">
        <label className="block text-sm font-medium text-white/90 mb-2">
          {t.form.phone}
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder={t.form.phonePlaceholder}
          // Added text-right and dir="rtl" to force right alignment
          className={`
            w-full px-5 py-4 rounded-2xl
            bg-white/15
            border-2 text-right
            text-white placeholder-white/40
            focus:outline-none focus:bg-white/20
            transition-colors duration-200
            ${
              errors.phone
                ? "border-red-400/60 focus:border-red-400"
                : "border-white/20 focus:border-white/50 hover:border-white/30"
            }
          `}
          dir="rtl"
        />
        {errors.phone && (
          <p className="mt-2 text-sm text-red-300 animate-shake">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full py-4 px-8 rounded-2xl
          font-bold text-lg
          transition-transform duration-200
          ${
            isSubmitting
              ? "bg-white/30 cursor-not-allowed"
              : "bg-gradient-to-r from-[#7cfc00] to-[#00fa9a] hover:scale-[1.02] active:scale-[0.98]"
          }
          text-[#0a4d68]
        `}
      >
        <span className="flex items-center justify-center gap-3">
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-[#0a4d68]/30 border-t-[#0a4d68] rounded-full animate-spin" />
              {t.form.submitting}
            </>
          ) : (
            t.form.submit
          )}
        </span>
      </button>
    </form>
  );
};

// ============================================
// SOCIAL LINKS COMPONENT
// ============================================
const SocialLinks = () => {
  // Filtered to only show specific social media
  const socials = [
    {
      icon: Icons.Instagram,
      href: CONFIG.social.instagram,
      label: "Instagram",
    },
    { icon: Icons.Facebook, href: CONFIG.social.facebook, label: "Facebook" },
    { icon: Icons.YouTube, href: CONFIG.social.youtube, label: "YouTube" },
    { icon: Icons.TikTok, href: CONFIG.social.tiktok, label: "TikTok" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {socials.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="
            w-11 h-11 rounded-full
            bg-white/10
            flex items-center justify-center
            text-white/70 hover:text-white
            hover:bg-white/20
            transition-colors duration-200
          "
        >
          <Icon />
        </a>
      ))}
    </div>
  );
};

// ============================================
// FOOTER COMPONENT
// ============================================
const Footer = ({ t }) => (
  <footer className="relative z-10 py-8 px-4 border-t border-white/10 ">
    <div className="max-w-4xl mx-auto">
      <div className="text-center space-y-6">
        <p className="text-white/60 text-sm">{t.footer.followUs}</p>
        <SocialLinks />
        <div className="pt-6 space-y-2">
          <p className="text-white/80 font-medium">{t.footer.company}</p>
          <p className="text-white/50 text-sm">{t.footer.companyEn}</p>
          <p className="text-white/40 text-xs pt-2">
            © {new Date().getFullYear()} {t.footer.rights}
          </p>
        </div>
      </div>
    </div>
  </footer>
);

// ============================================
// LANDING PAGE
// ============================================
const LandingPage = ({ lang, onNavigate }) => {
  const t = translations[lang];

  const handleSuccess = () => {
    onNavigate(`/${lang}/thanks`);
  };

  return (
    <div className="min-h-screen flex flex-col" dir={t.dir}>
      <WaterBackground />

      {/* Header */}
      <header className="relative z-10 py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img
            src={CONFIG.logo}
            alt="Abar Logo"
            className="h-14 md:h-16 rounded-xl shadow-lg transition-transform hover:scale-105 duration-300"
          />
          <button
            onClick={() => onNavigate(`/${lang === "ar" ? "en" : "ar"}/form`)}
            className="
              px-4 py-2 rounded-full
              bg-white/10
              text-white/90 text-sm font-medium
              hover:bg-white/20 transition-colors duration-200
              border border-white/20
            "
          >
            {t.nav.switchLang}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Hero Text */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-[#7cfc00] font-semibold mb-2">
              {t.hero.subtitle}
            </p>
            <p className="text-white/70">{t.hero.description}</p>
          </div>

          {/* Form Card */}
          <div
            className="
            bg-white/10
            rounded-3xl p-6 md:p-8
            border border-white/10
            shadow-2xl shadow-black/20
            animate-slide-up
          "
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">
                {t.form.title}
              </h2>
              <p className="text-white/60 text-sm">{t.form.subtitle}</p>
            </div>

            <LeadForm t={t} lang={lang} onSuccess={handleSuccess} />
          </div>
        </div>
      </main>

      <Footer t={t} />
    </div>
  );
};

// ============================================
// THANKS PAGE
// ============================================
const ThanksPage = ({ lang, onNavigate }) => {
  const t = translations[lang];

  return (
    <div className="min-h-screen flex flex-col" dir={t.dir}>
      <WaterBackground />

      {/* Header */}
      <header className="relative z-10 py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img
            src={CONFIG.logo}
            alt="Abar Logo"
            className="h-14 md:h-16 rounded-xl shadow-lg"
          />
          <button
            onClick={() => onNavigate(`/${lang === "ar" ? "en" : "ar"}/thanks`)}
            className="
              px-4 py-2 rounded-full
              bg-white/10
              text-white/90 text-sm font-medium
              hover:bg-white/20 transition-colors duration-200
              border border-white/20
            "
          >
            {t.nav.switchLang}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="text-center animate-fade-in">
          {/* Success Icon */}
          <div
            className="
            w-28 h-28 mx-auto mb-8
            rounded-full
            bg-gradient-to-br from-[#7cfc00] to-[#00fa9a]
            flex items-center justify-center
            shadow-2xl shadow-green-500/30
            animate-bounce-in
          "
          >
            <Icons.Check />
          </div>

          {/* Text */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {t.thanks.title}
          </h1>
          <p className="text-xl text-[#7cfc00] font-semibold mb-2">
            {t.thanks.subtitle}
          </p>
          <p className="text-white/70 mb-10 max-w-md mx-auto">
            {t.thanks.message}
          </p>

          {/* Back Button */}
          <button
            onClick={() => onNavigate(`/${lang}/form`)}
            className="
              px-8 py-4 rounded-2xl
              bg-white/10
              border border-white/20
              text-white font-medium
              hover:bg-white/20
              transition-colors duration-200
            "
          >
            {t.thanks.back}
          </button>
        </div>
      </main>

      <Footer t={t} />
    </div>
  );
};

// ============================================
// ROUTER / APP COMPONENT
// ============================================
const App = () => {
  const [route, setRoute] = useState(() => {
    const path = window.location.pathname;

    // Default routing logic
    if (path.startsWith("/en/thanks")) return { lang: "en", page: "thanks" };
    if (path.startsWith("/en")) return { lang: "en", page: "form" };
    if (path.startsWith("/ar/thanks")) return { lang: "ar", page: "thanks" };
    if (path.startsWith("/ar")) return { lang: "ar", page: "form" };

    // Default to Arabic
    return { lang: "ar", page: "form" };
  });

  const navigate = useCallback((path) => {
    window.history.pushState({}, "", path);

    if (path.includes("/en/thanks")) setRoute({ lang: "en", page: "thanks" });
    else if (path.includes("/en")) setRoute({ lang: "en", page: "form" });
    else if (path.includes("/ar/thanks"))
      setRoute({ lang: "ar", page: "thanks" });
    else setRoute({ lang: "ar", page: "form" });
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes("/en/thanks")) setRoute({ lang: "en", page: "thanks" });
      else if (path.includes("/en")) setRoute({ lang: "en", page: "form" });
      else if (path.includes("/ar/thanks"))
        setRoute({ lang: "ar", page: "thanks" });
      else setRoute({ lang: "ar", page: "form" });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update document direction and language
  useEffect(() => {
    document.documentElement.dir = translations[route.lang].dir;
    document.documentElement.lang = translations[route.lang].lang;
  }, [route.lang]);

  return route.page === "thanks" ? (
    <ThanksPage lang={route.lang} onNavigate={navigate} />
  ) : (
    <LandingPage lang={route.lang} onNavigate={navigate} />
  );
};

// ============================================
// STYLES (Tailwind + Custom Animations)
// ============================================
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
}

body {
  font-family: 'Cairo', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(to bottom right, #0a4d68, #088395, #05bfdb);
  background-attachment: fixed;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom Animations */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
  50% { transform: translateY(-20px) rotate(10deg); opacity: 0.1; }
}

@keyframes ripple-1 {
  0% { transform: scale(0.8); opacity: 0.3; }
  100% { transform: scale(1.5); opacity: 0; }
}

@keyframes ripple-2 {
  0% { transform: scale(0.6); opacity: 0.3; }
  100% { transform: scale(1.3); opacity: 0; }
}

@keyframes ripple-3 {
  0% { transform: scale(0.4); opacity: 0.3; }
  100% { transform: scale(1.1); opacity: 0; }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.animate-ripple-1 {
  animation: ripple-1 4s ease-out infinite;
}

.animate-ripple-2 {
  animation: ripple-2 4s ease-out infinite;
  animation-delay: 0.5s;
}

.animate-ripple-3 {
  animation: ripple-3 4s ease-out infinite;
  animation-delay: 1s;
}

/* Focus visible for accessibility */
:focus-visible {
  outline: 2px solid rgba(124, 252, 0, 0.5);
  outline-offset: 2px;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Selection color */
::selection {
  background: rgba(124, 252, 0, 0.3);
  color: white;
}
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default App;
