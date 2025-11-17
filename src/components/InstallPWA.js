import React, { useState, useEffect } from 'react';
import { translateText } from '../utils/simpleTranslator';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('ro');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'ro';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail);
    };

    window.addEventListener('languageChanged', handleLanguageChange);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      // Show the install button
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hide install button if app is already installed
    window.addEventListener('appinstalled', () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const result = await deferredPrompt.userChoice;
    
    if (result.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (!showInstallButton) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <h3 className="font-semibold mb-2">
          📱 {translateText('installApp', currentLanguage)}
        </h3>
        <p className="text-sm mb-3">
          {translateText('installAppDescription', currentLanguage)}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleInstallClick}
            className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 flex-1"
          >
            {translateText('install', currentLanguage)}
          </button>
          <button
            onClick={() => setShowInstallButton(false)}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            {translateText('later', currentLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;