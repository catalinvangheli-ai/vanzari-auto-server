import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import { useParams } from 'react-router-dom';

const Profil = () => {
  const { username: urlUsername } = useParams(); // username din URL
  const { isAuthenticated, user: loggedUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [usernameState, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [telefon, setTelefon] = useState("");

  useEffect(() => {
    console.log('🔍 Profil useEffect - urlUsername:', urlUsername, 'isAuthenticated:', isAuthenticated);
    setLoading(true);
    
    if (urlUsername) {
      // Profil public - cineva vrea să vadă profilul unui alt utilizator
      console.log('📖 Încarcă profil public pentru:', urlUsername);
      fetch(`${API_BASE_URL}/users?username=${urlUsername}`)
        .then(res => {
          console.log('📡 Răspuns profil public:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('✅ Date profil public:', data);
          setUser(Array.isArray(data) ? data[0] : data);
          setLoading(false);
        })
        .catch(err => {
          console.error('❌ Eroare profil public:', err);
          setError('Nu s-a putut încărca profilul public');
          setLoading(false);
        });
    } else if (localStorage.getItem("token")) {
      // Profil propriu
      console.log('👤 Încarcă profil propriu');
      fetch(`${API_BASE_URL}/me`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then(res => {
          console.log('📡 Răspuns profil propriu:', res.status);
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('✅ Date profil propriu:', data);
          setUser(data);
          setUsername(data.username || "");
          setEmail(data.email || "");
          setFullName(data.fullName || "");
          setRole(data.role || "");
          setSkills(Array.isArray(data.skills) ? data.skills.join(", ") : "");
          setTelefon(data.telefon || "");
          setLoading(false);
        })
        .catch(err => {
          console.error('❌ Eroare profil propriu:', err);
          setError('Nu s-a putut încărca profilul. Verifică autentificarea.');
          setLoading(false);
        });
    } else {
      console.log('⚠️ Nu există token, utilizator neautentificat');
      setLoading(false);
    }
  }, [urlUsername, loggedUser]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("username", usernameState);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("fullName", fullName);
    formData.append("role", role);
    formData.append("skills", skills);
    formData.append("telefon", telefon);
    if (selectedFile) formData.append("photo", selectedFile);

    try {
      const res = await fetch(`${API_BASE_URL}/me`, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + token
        },
        body: formData
      });

      if (res.ok) {
        setSuccess("Profil actualizat!");
        setEditMode(false);
        setPassword("");

        const refreshed = await fetch(`${API_BASE_URL}/me`, {
          headers: { Authorization: "Bearer " + token }
        }).then(r => r.json());

        setUser(refreshed);
      } else {
        const errData = await res.json();
        setError(errData.error || "Eroare la actualizare!");
      }
    } catch {
      setError("Nu se poate conecta la server!");
    }
  };

  const handlePhotoUpload = (photoUrl) => {
    setUser({ ...user, photo: photoUrl });
  };

  // Dacă e profilul personal, arată opțiuni de editare
  const isOwnProfile =
    !urlUsername && isAuthenticated ||
    (isAuthenticated && user && user.email === localStorage.getItem("email"));

  // Loading state
  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Se încarcă profilul...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        {!isAuthenticated && (
          <div className="space-x-4">
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Autentifică-te
            </button>
            <button
              onClick={() => window.location.href = '/register'}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Înregistrează-te
            </button>
          </div>
        )}
      </div>
    );
  }

  // No user but not loading
  if (!user && !loading) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Profil neaccesibil</h2>
        <p className="text-gray-600 mb-4">
          {isAuthenticated 
            ? 'Nu s-a putut încărca profilul.' 
            : 'Trebuie să te autentifici pentru a vedea profilul.'}
        </p>
        {!isAuthenticated && (
          <div className="space-x-4">
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Autentifică-te
            </button>
            <button
              onClick={() => window.location.href = '/register'}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Înregistrează-te
            </button>
          </div>
        )}
      </div>
    );
  }
  if (user && user.error) return <div style={{color: "red"}}>Eroare: {user.error}</div>;

  // Profil public (doar vizualizare)
  if (urlUsername) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <div className="text-center mb-4">
            {user.photo && (
              <img
                src={`${API_BASE_URL}${user.photo}`}
                alt="Poza profil"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
              />
            )}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {user.fullName || user.username}
            </h2>
          </div>
          
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Informații de contact</h3>
            {user.email && (
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-20">Email:</span>
                <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                  {user.email}
                </a>
              </div>
            )}
            {user.telefon && (
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-20">Telefon:</span>
                <a href={`tel:${user.telefon}`} className="text-blue-600 hover:underline">
                  {user.telefon}
                </a>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <button 
              onClick={() => window.location.href = `/chat?user=${user.username}`}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              💬 Trimite mesaj
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profil propriu (editabil)
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Profilul meu</h2>
      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!editMode ? (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Informații personale</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <span className="font-medium text-gray-600">Nume complet:</span>
                  <span className="ml-2 text-gray-800">{user.fullName || 'Nu este completat'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Username:</span>
                  <span className="ml-2 text-gray-800">{user.username}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="ml-2 text-blue-600">{user.email || 'Nu este completat'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Telefon:</span>
                  <span className="ml-2 text-gray-800">{user.telefon || 'Nu este completat'}</span>
                </div>
              </div>
            </div>
            
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
              onClick={() => setEditMode(true)}
            >
              ✏️ Editează profilul
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleEdit} className="flex flex-col gap-2 max-w-xs mt-4">
          <label>
            Username:
            <input
              type="text"
              value={usernameState}
              onChange={e => setUsername(e.target.value)}
              className="p-2 border rounded w-full text-black"
              required
            />
          </label>
          <label>
            Parolă nouă:
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="p-2 border rounded w-full text-black"
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="p-2 border rounded w-full text-black"
            />
          </label>
          <label>
            Nume complet:
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="p-2 border rounded w-full text-black"
            />
          </label>
          <label>
            Telefon:
            <input
              type="text"
              value={telefon}
              onChange={e => setTelefon(e.target.value)}
              className="p-2 border rounded w-full text-black"
            />
          </label>
          <label>
            Poză profil:
            <input
              type="file"
              accept="image/*"
              onChange={e => setSelectedFile(e.target.files[0])}
              className="p-2 border rounded w-full text-black"
            />
          </label>
          <button type="submit" className="bg-green-600 text-white p-2 rounded">Salvează</button>
          <button type="button" className="bg-gray-400 text-white p-2 rounded" onClick={() => setEditMode(false)}>Anulează</button>
        </form>
      )}
      <div className="mt-4">
        {user.photo && <img src={`${API_BASE_URL}${user.photo}`} alt="Poza profil" width={120} />}
      </div>

      {/* Butoane pentru gestionarea anunțurilor - doar pentru utilizatorul autentificat */}
      {isAuthenticated && !urlUsername && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Gestionează anunțurile</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.location.href = '/my-listings'}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              📋 Anunțurile mele
            </button>
            <button
              onClick={() => window.location.href = '/add-listing'}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              ➕ Adaugă anunț nou
            </button>
            <button
              onClick={() => window.location.href = '/vanzari'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔍 Caută mașini
            </button>
            <button
              onClick={() => window.location.href = '/inchirieri'}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              🔑 Închirieri auto
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profil;