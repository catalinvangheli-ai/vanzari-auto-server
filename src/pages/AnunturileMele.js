import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import { modele } from '../utils/vehicleData';

const AnunturileMele = () => {
  const { isAuthenticated, username } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('vanzari');
  const [vanzari, setVanzari] = useState([]);
  const [inchirieri, setInchirieri] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnunt, setSelectedAnunt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAnunt, setEditingAnunt] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Pentru editare poze
  const [editPoze, setEditPoze] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const maxPoze = 9;

  const tipuriVehicule = ['Sedan', 'Hatchback', 'SUV', 'Break', 'Coupe', 'Cabrio', 'Monovolum', 'Pickup', 'Van'];
  
  // Toate mărcile și modelele din vehicleData.js
  const marciComplete = {
    'Audi': 'audi',
    'BMW': 'bmw',
    'Mercedes-Benz': 'mercedes',
    'Volkswagen': 'volkswagen',
    'Ford': 'ford',
    'Toyota': 'toyota',
    'Honda': 'honda',
    'Nissan': 'nissan',
    'Mazda': 'mazda',
    'Hyundai': 'hyundai',
    'Kia': 'kia',
    'Renault': 'renault',
    'Peugeot': 'peugeot',
    'Opel': 'opel',
    'Dacia': 'dacia',
    'Skoda': 'skoda',
    'Seat': 'seat',
    'Volvo': 'volvo',
    'Fiat': 'fiat',
    'Alfa Romeo': 'alfa romeo',
    'Jeep': 'jeep',
    'Mini': 'mini',
    'Lexus': 'lexus',
    'Infiniti': 'infiniti'
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnunturi();
    }
  }, [isAuthenticated]);

  const fetchAnunturi = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Username din context:', username);
      console.log('🔍 Token din localStorage:', token);
      
      // Fetch vânzări
      const vanzariResponse = await fetch(`${API_BASE_URL}/api/my-car-sales`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (vanzariResponse.ok) {
        const vanzariData = await vanzariResponse.json();
        setVanzari(vanzariData);
      }

      // Fetch închirieri
      const inchirieriResponse = await fetch(`${API_BASE_URL}/api/my-car-rentals`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (inchirieriResponse.ok) {
        const inchirieriData = await inchirieriResponse.json();
        setInchirieri(inchirieriData);
      }
    } catch (error) {
      console.error('Eroare încărcare anunțuri:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnunt = async (id, type) => {
    if (!window.confirm('Ești sigur că vrei să ștergi acest anunț?')) return;

    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'vanzari' ? 'car-sales' : 'car-rentals';
      
      const response = await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Anunțul a fost șters cu succes!');
        fetchAnunturi();
        if (showModal) setShowModal(false);
        if (showEditModal) setShowEditModal(false);
      } else {
        alert('Eroare la ștergerea anunțului!');
      }
    } catch (error) {
      console.error('Eroare ștergere:', error);
      alert('Eroare la ștergerea anunțului!');
    }
  };

  const toggleStatus = async (id, type, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'vanzari' ? 'car-sales' : 'car-rentals';
      
      const response = await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: currentStatus === 'activ' ? 'inactiv' : 'activ'
        })
      });

      if (response.ok) {
        alert(`Anunțul a fost ${currentStatus === 'activ' ? 'dezactivat' : 'activat'}!`);
        fetchAnunturi();
        if (showModal) setShowModal(false);
        if (showEditModal) setShowEditModal(false);
      } else {
        alert('Eroare la modificarea statusului!');
      }
    } catch (error) {
      console.error('Eroare status:', error);
    }
  };

  const openAnuntDetails = (anunt, type) => {
    setSelectedAnunt({ ...anunt, type });
    setShowModal(true);
  };

  const openEditModal = (anunt, type) => {
    setEditingAnunt({ ...anunt, type });
    
    // Pregătește datele pentru editare
    if (type === 'vanzari') {
      setEditFormData({
        marca: anunt.marca || '',
        model: anunt.model || '',
        anFabricatie: anunt.anFabricatie || anunt.an || '',
        km: anunt.km || '',
        carburant: anunt.carburant || anunt.combustibil || '',
        transmisie: anunt.transmisie || '',
        pret: anunt.pret || '',
        locatie: anunt.locatie || '',
        descriere: anunt.descriere || '',
        telefon: anunt.telefon || '',
        email: anunt.email || ''
      });
    } else {
      setEditFormData({
        marca: anunt.marca || '',
        model: anunt.model || '',
        anFabricatie: anunt.anFabricatie || anunt.an || '',
        combustibil: anunt.combustibil || anunt.carburant || '',
        transmisie: anunt.transmisie || '',
        pretPeZi: anunt.pretPeZi || '',
        locatie: anunt.locatie || '',
        descriere: anunt.descriere || '',
        telefon: anunt.telefon || '',
        email: anunt.email || ''
      });
    }
    
    // Încarcă pozele existente
    setEditPoze(anunt.poze ? anunt.poze.map((poza, index) => ({
      id: index,
      preview: poza,
      existing: true,
      url: poza
    })) : []);
    
    setShowEditModal(true);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAnunt(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingAnunt(null);
    setEditFormData({});
    setEditPoze([]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Funcții pentru upload poze în editare
  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
      if (editPoze.length < maxPoze && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setEditPoze(prev => {
            if (prev.length < maxPoze) {
              return [...prev, {
                id: Date.now() + Math.random(),
                file: file,
                preview: e.target.result,
                name: file.name,
                existing: false
              }];
            }
            return prev;
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileChange = (e) => { handleFileSelect(e.target.files); };
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false); };
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files); };
  const removePoza = (id) => { setEditPoze(editPoze.filter(poza => poza.id !== id)); };

  const handleUpdateAnunt = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const token = localStorage.getItem('token');
      const endpoint = editingAnunt.type === 'vanzari' ? 'car-sales' : 'car-rentals';
      
      const formDataToSend = new FormData();
      
      // Adaugă datele anunțului
      Object.keys(editFormData).forEach(key => {
        formDataToSend.append(key, editFormData[key]);
      });

      // Adaugă pozele noi
      const newPoze = editPoze.filter(poza => !poza.existing);
      newPoze.forEach((poza) => {
        if (poza.file) {
          formDataToSend.append('poze', poza.file);
        }
      });

      // Păstrează pozele existente
      const existingPoze = editPoze.filter(poza => poza.existing).map(poza => poza.url);
      formDataToSend.append('existingPoze', JSON.stringify(existingPoze));

      const response = await fetch(`${API_BASE_URL}/api/${endpoint}/${editingAnunt.id || editingAnunt._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        alert('Anunțul a fost actualizat cu succes!');
        fetchAnunturi();
        closeEditModal();
      } else {
        const errorData = await response.json();
        alert(`Eroare: ${errorData.message || 'Nu s-a putut actualiza anunțul'}`);
      }
    } catch (error) {
      console.error('Eroare actualizare:', error);
      alert('Eroare la actualizarea anunțului!');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Autentificare necesară</h2>
        <p className="text-gray-600 mb-4">Trebuie să te loghezi pentru a vedea anunțurile tale.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Du-te la Login
        </button>
      </div>
    );
  }

  const renderAnunturi = (anunturi, type) => {
    if (anunturi.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">
            Nu ai anunțuri {type === 'vanzari' ? 'de vânzare' : 'de închiriere'}
          </h3>
          <p className="mb-4">
            Adaugă primul tău anunț {type === 'vanzari' ? 'de vânzare' : 'de închiriere'} auto
          </p>
          <button
            onClick={() => window.location.href = '/add-listing'}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Adaugă anunț
          </button>
        </div>
      );
    }

    return (
      <div className="grid gap-6">
        {anunturi.map((anunt, index) => (
          <div key={anunt.id || anunt._id} className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <Link 
                to={`/anunt/${type}/${anunt.id || anunt._id}`}
                className="cursor-pointer hover:text-blue-600 flex-1">
              >
                <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600">
                  {anunt.marca} {anunt.model}
                </h3>
                <p className="text-gray-600">Anul {anunt.anFabricatie || anunt.an}</p>
              </Link>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {anunt.pret || anunt.pretPeZi}€{type === 'inchirieri' ? '/zi' : ''}
                </p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  (anunt.status || 'activ') === 'activ' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {anunt.status || 'activ'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
              {type === 'vanzari' && <span>Km: {anunt.km?.toLocaleString()}</span>}
              <span>Combustibil: {anunt.carburant || anunt.combustibil}</span>
              <span>Transmisie: {anunt.transmisie}</span>
              <span>Locație: {anunt.locatie}</span>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-2">
              {anunt.descriere}
            </p>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Publicat: {new Date(anunt.createdAt).toLocaleDateString('ro-RO')}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(anunt.id || anunt._id, type, anunt.status || 'activ')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    (anunt.status || 'activ') === 'activ'
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {(anunt.status || 'activ') === 'activ' ? 'Dezactivează' : 'Activează'}
                </button>
                
                <button 
                  onClick={() => openEditModal(anunt, type)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
                >
                  Editează
                </button>
                
                <button
                  onClick={() => deleteAnunt(anunt.id || anunt._id, type)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium">
                  Șterge
                  Șterge
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 page-container">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Anunțurile mele
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setActiveTab('vanzari')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'vanzari'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Vânzări Auto ({vanzari.length})
          </button>
          <button
            onClick={() => setActiveTab('inchirieri')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'inchirieri'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Închirieri Auto ({inchirieri.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Se încarcă anunțurile...</p>
          </div>
        ) : (
          <>
            {activeTab === 'vanzari' && renderAnunturi(vanzari, 'vanzari')}
            {activeTab === 'inchirieri' && renderAnunturi(inchirieri, 'inchirieri')}
          </>
        )}
      </div>

      {/* Modal pentru detalii anunț */}
      {showModal && selectedAnunt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedAnunt.marca} {selectedAnunt.model}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><strong>Anul:</strong> {selectedAnunt.anFabricatie || selectedAnunt.an}</div>
                <div><strong>Preț:</strong> {selectedAnunt.pret || selectedAnunt.pretPeZi}€{selectedAnunt.type === 'inchirieri' ? '/zi' : ''}</div>
                {selectedAnunt.km && <div><strong>Kilometri:</strong> {selectedAnunt.km.toLocaleString()}</div>}
                <div><strong>Combustibil:</strong> {selectedAnunt.carburant || selectedAnunt.combustibil}</div>
                <div><strong>Transmisie:</strong> {selectedAnunt.transmisie}</div>
                <div><strong>Locație:</strong> {selectedAnunt.locatie}</div>
              </div>

              <div className="mb-4">
                <strong>Descriere:</strong>
                <p className="mt-2 text-gray-700">{selectedAnunt.descriere}</p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => openEditModal(selectedAnunt, selectedAnunt.type)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Editează
                </button>
                <button
                  onClick={() => toggleStatus(selectedAnunt.id || selectedAnunt._id, selectedAnunt.type, selectedAnunt.status || 'activ')}
                  className={`px-4 py-2 rounded ${
                    (selectedAnunt.status || 'activ') === 'activ'
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {(selectedAnunt.status || 'activ') === 'activ' ? 'Dezactivează' : 'Activează'}
                </button>
                <button
                  onClick={() => deleteAnunt(selectedAnunt.id || selectedAnunt._id, selectedAnunt.type)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Șterge anunț
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Închide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal pentru editare anunț */}
      {showEditModal && editingAnunt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Editează anunț: {editingAnunt.marca} {editingAnunt.model}
                </h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateAnunt} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Marca *</label>
                    <select
                      name="marca"
                      value={editFormData.marca || ''}
                      onChange={handleEditChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selectează marca</option>
                      {Object.keys(marciComplete).map(marca => (
                        <option key={marca} value={marca}>{marca}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Model *</label>
                    <select
                      name="model"
                      value={editFormData.model || ''}
                      onChange={handleEditChange}
                      required
                      disabled={!editFormData.marca}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <option value="">Selectează modelul</option>
                      {editFormData.marca && marciComplete[editFormData.marca] && modele[marciComplete[editFormData.marca]]?.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">An fabricație *</label>
                    <input
                      type="number"
                      name="anFabricatie"
                      value={editFormData.anFabricatie || ''}
                      onChange={handleEditChange}
                      required
                      min="1990"
                      max="2025"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {editingAnunt.type === 'vanzari' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Kilometri *</label>
                        <input
                          type="number"
                          name="km"
                          value={editFormData.km || ''}
                          onChange={handleEditChange}
                          required
                          min="0"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Combustibil *</label>
                    <select
                      name={editingAnunt.type === 'vanzari' ? 'carburant' : 'combustibil'}
                      value={editFormData.carburant || editFormData.combustibil || ''}
                      onChange={handleEditChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selectează combustibilul</option>
                      <option value="Benzină">Benzină</option>
                      <option value="Motorină">Motorină</option>
                      <option value="Hibrid">Hibrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Transmisie *</label>
                    <select
                      name="transmisie"
                      value={editFormData.transmisie || ''}
                      onChange={handleEditChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selectează transmisia</option>
                      <option value="Manual">Manual</option>
                      <option value="Automat">Automat</option>
                      <option value="CVT">CVT</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {editingAnunt.type === 'vanzari' ? 'Preț (€) *' : 'Preț pe zi (€) *'}
                    </label>
                    <input
                      type="number"
                      name={editingAnunt.type === 'vanzari' ? 'pret' : 'pretPeZi'}
                      value={editFormData.pret || editFormData.pretPeZi || ''}
                      onChange={handleEditChange}
                      required
                      min="1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Locație *</label>
                    <input
                      type="text"
                      name="locatie"
                      value={editFormData.locatie || ''}
                      onChange={handleEditChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Poze ({editPoze.length}/{maxPoze})
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                  }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="edit-foto-upload"
                      disabled={editPoze.length >= maxPoze}
                    />
                    <label
                      htmlFor="edit-foto-upload"
                      className={`cursor-pointer ${editPoze.length >= maxPoze ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="text-gray-600 mb-2">📸 Trage pozele aici sau click pentru a selecta</div>
                      <div className="text-sm text-gray-500">
                        {editPoze.length >= maxPoze
                          ? `Ai atins limita de ${maxPoze} poze`
                          : `Poți adăuga încă ${maxPoze - editPoze.length} ${maxPoze - editPoze.length === 1 ? 'poză' : 'poze'}`
                        }
                      </div>
                    </label>
                  </div>

                  {editPoze.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                      {editPoze.map((poza) => (
                        <div key={poza.id} className="relative group">
                          <img
                            src={poza.preview || poza.url}
                            alt={poza.name || 'Poză anunț'}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removePoza(poza.id)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-sm hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                          {poza.existing && (
                            <div className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-tr">
                              Existent
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descriere *</label>
                  <textarea
                    name="descriere"
                    value={editFormData.descriere || ''}
                    onChange={handleEditChange}
                    required
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Anulează
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className={`px-6 py-2 rounded-lg text-white ${
                      isUpdating
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isUpdating ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Se actualizează...
                      </span>
                    ) : (
                      'Actualizează anunț'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnunturileMele;