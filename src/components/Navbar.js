import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useLanguage } from '../context/LanguageContext';

function Navbar() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const languages = [
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ];

  const handleLogout = () => {
    logout();
  };

  const changeLanguage = (languageCode) => {
    setLanguage(languageCode);
    setShowLanguageDropdown(false);
  };

  const currentLangInfo = languages.find(l => l.code === language) || languages[0];

  // stil comun pentru butoane
  const baseBtn = 'flex-1 inline-flex items-center justify-center px-2 py-2.5 text-xs font-semibold rounded-lg shadow-md transition-all text-center';
  const rowClass = 'flex w-full gap-1.5';

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg sticky top-0 z-50">
      {/* Banda goală pentru status bar-ul telefonului */}
      <div className="h-10 bg-white"></div>
      <div className="w-full max-w-sm mx-auto px-2 py-2">
        {/* Rând 1: Căutare Mașină + Închirieri */}
        <div className={`${rowClass} mb-1.5`}>
          <Link to="/vanzari" className={`${baseBtn} bg-white text-blue-600 hover:bg-blue-50`}>
            🔍 {t('searchPreferredCar')}
          </Link>
          <Link to="/inchirieri" className={`${baseBtn} bg-green-500 text-white hover:bg-green-600`}>
            🔑 {t('rentals')}
          </Link>
        </div>

        {/* Rând 2: Adaugă Anunț */}
        <div className={`${rowClass} mb-1.5`}>
          <Link to="/add-listing" className={`${baseBtn} bg-yellow-500 text-white hover:bg-yellow-600`}>
            ➕ {t('addListing')}
          </Link>
        </div>

        {/* Rând 3: Limbă + Profil/Mesaje + Login/Register */}
        <div className={rowClass}>
          {/* Selector Limbă */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className={`${baseBtn} bg-indigo-500 text-white hover:bg-indigo-600 px-2`}
              type="button"
            >
              <span className="mr-1">{currentLangInfo.flag}</span>
              <span className="text-xs">{currentLangInfo.code.toUpperCase()}</span>
            </button>
            {showLanguageDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl py-1 min-w-[150px] z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2 text-xs ${
                      language === lang.code ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <>
              {user?.isAdmin && (
                <Link to="/admin" className={`${baseBtn} bg-red-700 text-white hover:bg-red-800`}>
                  🛡️ Admin
                </Link>
              )}
              <Link to="/profil" className={`${baseBtn} bg-pink-500 text-white hover:bg-pink-600`}>
                👤 {t('profile')}
              </Link>
              <Link to="/chat" className={`${baseBtn} bg-teal-500 text-white hover:bg-teal-600`}>
                💬 {t('messages')}
              </Link>
              <button
                onClick={handleLogout}
                className={`${baseBtn} bg-red-500 text-white hover:bg-red-600`}
              >
                🚪 {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`${baseBtn} bg-emerald-500 text-white hover:bg-emerald-600`}>
                🔐 {t('login')}
              </Link>
              <Link to="/register" className={`${baseBtn} bg-orange-500 text-white hover:bg-orange-600`}>
                📝 {t('register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;