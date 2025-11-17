import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [step, setStep] = useState(token ? 'reset' : 'request'); // 'request' sau 'reset'
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState(token || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/reset-password-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Token resetare primit:', data);
        setResetToken(data.resetToken);
        setSuccess('Token de resetare generat! (În producție ar fi trimis pe email)');
        setStep('reset');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Eroare la cererea de resetare');
      }
    } catch (networkError) {
      console.error('🔥 Eroare de rețea:', networkError);
      setError('Nu se poate conecta la server. Verifică conexiunea la internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Parolele nu coincid');
      return;
    }

    if (newPassword.length < 6) {
      setError('Parola trebuie să aibă cel puțin 6 caractere');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetToken,
          newPassword: newPassword,
        }),
      });

      if (response.ok) {
        setSuccess('Parola a fost resetată cu succes! Te poți conecta acum.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Eroare la resetarea parolei');
      }
    } catch (networkError) {
      console.error('🔥 Eroare de rețea:', networkError);
      setError('Nu se poate conecta la server. Verifică conexiunea la internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 'request' ? 'Resetează parola' : 'Setează parola nouă'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 'request' 
              ? 'Introdu email-ul pentru a primi linkul de resetare'
              : 'Introdu parola nouă pentru contul tău'
            }
          </p>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {step === 'request' && (
          <form className="mt-8 space-y-6" onSubmit={handleRequestReset}>
            <div>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email-ul tău"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 text-white rounded-md ${
                loading 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Se trimite...' : 'Trimite link de resetare'}
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                placeholder="Token de resetare"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Tokenul primit prin email (pentru dezvoltare este afișat automat)
              </p>
            </div>
            <div>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Parola nouă"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirmă parola nouă"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Se resetează...' : 'Resetează parola'}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Înapoi la login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;