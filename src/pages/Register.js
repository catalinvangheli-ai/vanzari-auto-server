import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { fetchWithRetry } from '../utils/fetchWithRetry';

const Register = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('📝 Încercare înregistrare cu:', { email, name, password: '***' });

    try {
      console.log('⏳ Se conectează la server (poate dura până la 1 minut)...');
      
      const response = await fetchWithRetry(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          fullName: name // numele complet ca fullName
        }),
      }, {
        timeout: 60000, // 60 secunde
        retries: 5, // 5 reîncercări
        retryDelay: 5000 // 5 secunde între încercări
      });

      console.log('📡 Răspuns server:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Înregistrare reușită:', data);
        // Logăm utilizatorul automat după înregistrare
        const resolvedEmail = data.email || email;
        const resolvedFullName = data.fullName || name;
        login({ username: data.username, email: resolvedEmail, fullName: resolvedFullName }, data.token); // CORECT: userData, token
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Eroare la înregistrare');
      }
    } catch (networkError) {
      console.error('🔥 Eroare de rețea:', networkError);
      setError(networkError.message || 'Eroare de conexiune');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('register')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nume"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Adresă de email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Parolă"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white rounded-md ${
              loading 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Se înregistrează...' : t('register')}
          </button>
          <div className="text-center">
            <p className="text-gray-600">
              Ai deja cont?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Conectează-te aici
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;