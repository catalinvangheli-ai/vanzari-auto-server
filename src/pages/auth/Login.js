import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { translateText } from "../../utils/simpleTranslator";
import { API_BASE_URL } from "../../config/api";

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState('ro');
  const navigate = useNavigate();

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
    console.log("🔄 Încerc să mă conectez la server...");
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username: email, password }),
      });
      console.log("📡 Răspuns primit:", res.status, res.statusText);
      if (res.ok) {
        const data = await res.json();
        console.log("✅ Login reușit:", data);
  login(data.token, data.username);
        navigate("/");
      } else {
        let msg = translateText('authenticationError', currentLanguage);
        try {
          const err = await res.json();
          if (err?.error) msg = err.error;
        } catch {}
        console.log("❌ Eroare server:", msg);
        setError(msg);
      }
    } catch (networkErr) {
      console.error("🔥 Eroare de rețea:", networkErr);
      setError(`${translateText('connectionFailed', currentLanguage)}: ${networkErr.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-xs mx-auto mt-8">
      <h2 className="text-xl font-bold mb-2">{translateText('authentication', currentLanguage)}</h2>
      <input
        type="email"
        placeholder={translateText('email', currentLanguage)}
        value={email}
        onChange={e => setEmail(e.target.value)}
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
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">{translateText('loginButton', currentLanguage)}</button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
}

export default Login;