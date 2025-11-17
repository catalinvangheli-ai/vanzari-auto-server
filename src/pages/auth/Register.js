import React, { useState, useEffect } from "react";
import { translateText } from "../../utils/simpleTranslator";
import { API_BASE_URL } from "../../config/api";

function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('ro');

  // Listen for language changes
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'ro';
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail);
    };

    window.addEventListener('languageChanged', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    console.log("🔄 Încerc să mă înregistrez...");
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      console.log("📡 Răspuns înregistrare:", res.status, res.statusText);
      if (res.ok) {
        console.log("✅ Înregistrare reușită!");
        setSuccess(true);
        setUsername("");
        setPassword("");
        if (onRegister) onRegister();
      } else {
        let msg = translateText('registrationFailed', currentLanguage);
        try {
          const err = await res.json();
            if (err?.error) msg = err.error;
        } catch {}
        console.log("❌ Eroare înregistrare:", msg);
        setError(msg);
      }
    } catch (networkErr) {
      console.error("🔥 Eroare de rețea înregistrare:", networkErr);
      setError(`${translateText('connectionFailed', currentLanguage)}: ${networkErr.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-xs mx-auto mt-8">
      <h2 className="text-xl font-bold mb-2">{translateText('registration', currentLanguage)}</h2>
      <input
        type="text"
        placeholder={translateText('username', currentLanguage)}
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="p-2 border rounded w-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <input
        type="password"
        placeholder={translateText('password', currentLanguage)}
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="p-2 border rounded bg-white text-black"
        required
      />
      <button type="submit" className="bg-green-600 text-white p-2 rounded">{translateText('registerButton', currentLanguage)}</button>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">{translateText('accountCreatedSuccessfully', currentLanguage)}</div>}
    </form>
  );
}

export default Register;