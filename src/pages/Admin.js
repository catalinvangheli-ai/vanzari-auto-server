import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [saleAds, setSaleAds] = useState([]);
  const [rentalAds, setRentalAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const getToken = () => localStorage.getItem('token');

  const showMsg = (msg) => {
    setMessage(msg);
    setError('');
    setTimeout(() => setMessage(''), 3000);
  };

  const showErr = (msg) => {
    setError(msg);
    setMessage('');
    setTimeout(() => setError(''), 4000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setUsers(await res.json());
      else showErr('Eroare la încărcarea utilizatorilor');
    } catch {
      showErr('Eroare de rețea');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSaleAds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/ads/vanzari`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setSaleAds(await res.json());
      else showErr('Eroare la încărcarea anunțurilor');
    } catch {
      showErr('Eroare de rețea');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRentalAds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/ads/inchirieri`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setRentalAds(await res.json());
      else showErr('Eroare la încărcarea anunțurilor');
    } catch {
      showErr('Eroare de rețea');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user?.isAdmin) return;
    setSearch('');
    if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'vanzari') fetchSaleAds();
    else if (activeTab === 'inchirieri') fetchRentalAds();
  }, [activeTab, user, fetchUsers, fetchSaleAds, fetchRentalAds]);

  const deleteUser = async (username) => {
    if (!window.confirm(`Ștergi utilizatorul "${username}"? Acțiunea este ireversibilă.`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${encodeURIComponent(username)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) { showMsg(data.message); fetchUsers(); }
      else showErr(data.error);
    } catch { showErr('Eroare de rețea'); }
  };

  const toggleBan = async (username, isBanned) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${encodeURIComponent(username)}/ban`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ban: !isBanned }),
      });
      const data = await res.json();
      if (res.ok) { showMsg(data.message); fetchUsers(); }
      else showErr(data.error);
    } catch { showErr('Eroare de rețea'); }
  };

  const deleteSaleAd = async (id, label) => {
    if (!window.confirm(`Ștergi anunțul "${label}"?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/ads/vanzari/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) { showMsg(data.message); fetchSaleAds(); }
      else showErr(data.error);
    } catch { showErr('Eroare de rețea'); }
  };

  const deleteRentalAd = async (id, label) => {
    if (!window.confirm(`Ștergi anunțul "${label}"?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/ads/inchirieri/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) { showMsg(data.message); fetchRentalAds(); }
      else showErr(data.error);
    } catch { showErr('Eroare de rețea'); }
  };

  if (!user?.isAdmin) return null;

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSaleAds = saleAds.filter(a =>
    `${a.marca} ${a.model}`.toLowerCase().includes(search.toLowerCase()) ||
    a.username?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRentalAds = rentalAds.filter(a =>
    `${a.marca} ${a.model}`.toLowerCase().includes(search.toLowerCase()) ||
    a.username?.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { key: 'users', label: `👤 Utilizatori (${users.length})` },
    { key: 'vanzari', label: `🚗 Vânzări (${saleAds.length})` },
    { key: 'inchirieri', label: `🔑 Închirieri (${rentalAds.length})` },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      {/* Header */}
      <div className="bg-red-700 text-white px-4 py-4 shadow-lg">
        <h1 className="text-xl font-bold">🛡️ Panou Administrare</h1>
        <p className="text-red-200 text-sm">Admin: {user.username}</p>
      </div>

      {/* Mesaje */}
      <div className="px-4 pt-3">
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg text-sm mb-2">
            ✅ {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm mb-2">
            ❌ {error}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 pt-3 pb-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab.key
                ? 'bg-red-700 text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Căutare */}
      <div className="px-4 pb-3">
        <input
          type="text"
          placeholder="Caută..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Tab: Utilizatori */}
      {!loading && activeTab === 'users' && (
        <div className="px-4 space-y-3">
          {filteredUsers.length === 0 && (
            <p className="text-center text-gray-500 py-8">Nu s-au găsit utilizatori.</p>
          )}
          {filteredUsers.map(u => (
            <div key={u.username} className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${u.isBanned ? 'border-red-400' : u.isAdmin ? 'border-yellow-400' : 'border-blue-400'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800 text-sm">{u.username}</span>
                    {u.isAdmin && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">Admin</span>}
                    {u.isBanned && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">Suspendat</span>}
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">{u.email}</p>
                  {u.fullName && <p className="text-gray-600 text-xs">{u.fullName}</p>}
                  {u.telefon && <p className="text-gray-500 text-xs">📞 {u.telefon}</p>}
                </div>
              </div>
              {/* Butoane acțiuni - nu pentru propriul cont sau alți admini */}
              {u.username !== user.username && !u.isAdmin && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => toggleBan(u.username, u.isBanned)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                      u.isBanned
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    {u.isBanned ? '✅ Reactivează' : '🚫 Suspendă'}
                  </button>
                  <button
                    onClick={() => deleteUser(u.username)}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  >
                    🗑️ Șterge
                  </button>
                </div>
              )}
              {u.username === user.username && (
                <p className="text-xs text-gray-400 mt-2 italic">Acesta este contul tău de admin.</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab: Anunțuri Vânzări */}
      {!loading && activeTab === 'vanzari' && (
        <div className="px-4 space-y-3">
          {filteredSaleAds.length === 0 && (
            <p className="text-center text-gray-500 py-8">Nu s-au găsit anunțuri.</p>
          )}
          {filteredSaleAds.map(ad => (
            <div key={ad.id || ad._id} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-400">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">
                    {ad.marca} {ad.model} {ad.anFabricatie ? `(${ad.anFabricatie})` : ''}
                  </p>
                  <p className="text-blue-600 text-sm font-medium">{ad.pret ? `${Number(ad.pret).toLocaleString('ro-RO')} €` : ''}</p>
                  <p className="text-gray-500 text-xs mt-0.5">👤 {ad.username}</p>
                  {ad.locatie && <p className="text-gray-500 text-xs">📍 {ad.locatie}</p>}
                  {ad.km && <p className="text-gray-500 text-xs">🔢 {Number(ad.km).toLocaleString('ro-RO')} km</p>}
                  {ad.createdAt && (
                    <p className="text-gray-400 text-xs mt-0.5">
                      📅 {new Date(ad.createdAt).toLocaleDateString('ro-RO')}
                    </p>
                  )}
                </div>
                {ad.photos?.[0] && (
                  <img
                    src={ad.photos[0]}
                    alt="Anunț"
                    className="w-16 h-14 object-cover rounded-lg ml-2 flex-shrink-0"
                  />
                )}
              </div>
              <button
                onClick={() => deleteSaleAd(ad.id || ad._id, `${ad.marca} ${ad.model}`)}
                className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                🗑️ Șterge anunț
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Anunțuri Închirieri */}
      {!loading && activeTab === 'inchirieri' && (
        <div className="px-4 space-y-3">
          {filteredRentalAds.length === 0 && (
            <p className="text-center text-gray-500 py-8">Nu s-au găsit anunțuri.</p>
          )}
          {filteredRentalAds.map(ad => (
            <div key={ad.id || ad._id} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-400">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">
                    {ad.marca} {ad.model} {ad.anFabricatie ? `(${ad.anFabricatie})` : ''}
                  </p>
                  <p className="text-green-600 text-sm font-medium">{ad.pret ? `${Number(ad.pret).toLocaleString('ro-RO')} €/zi` : ''}</p>
                  <p className="text-gray-500 text-xs mt-0.5">👤 {ad.username}</p>
                  {ad.locatie && <p className="text-gray-500 text-xs">📍 {ad.locatie}</p>}
                  {ad.createdAt && (
                    <p className="text-gray-400 text-xs mt-0.5">
                      📅 {new Date(ad.createdAt).toLocaleDateString('ro-RO')}
                    </p>
                  )}
                </div>
                {ad.photos?.[0] && (
                  <img
                    src={ad.photos[0]}
                    alt="Anunț"
                    className="w-16 h-14 object-cover rounded-lg ml-2 flex-shrink-0"
                  />
                )}
              </div>
              <button
                onClick={() => deleteRentalAd(ad.id || ad._id, `${ad.marca} ${ad.model}`)}
                className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                🗑️ Șterge anunț
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
