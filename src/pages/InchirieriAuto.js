// Formular pentru închirieri auto - actualizat cu câmpuri complete
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translateText } from '../utils/simpleTranslator';
import { API_BASE_URL } from '../config/api';
import { fetchWithRetry } from '../utils/fetchWithRetry';
import CarCard from '../components/CarCard';
import { marci, modele } from '../utils/vehicleData';

const InchirieriAuto = () => {
  const [view, setView] = useState('menu'); // 'menu', 'cauta', 'ofera', 'rezultate'
  const { isAuthenticated, username } = useContext(AuthContext);
  const { language: currentLanguage } = useLanguage();
  
  // Stări pentru anunțuri
  const [anunturi, setAnunturi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // NU încărcăm anunțuri automat - utilizatorul trebuie să caute
  // useEffect(() => {
  //   if (view === 'rezultate' || view === 'cauta') {
  //     fetchAnunturi();
  //   }
  // }, [view]);

  const fetchAnunturi = async (filters = {}) => {
    try {
      setLoading(true);
      setSearchError('');
      
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}/api/car-rentals${queryParams ? `?${queryParams}` : ''}`;
      
      console.log('🔑 Încărcare anunțuri închiriere din:', url);
      
      const response = await fetchWithRetry(url, {}, {
        timeout: 60000, // 60 secunde
        retries: 5, // 5 reîncercări
        retryDelay: 5000 // 5 secunde între încercări
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Anunțuri primite:', data.length);
        setAnunturi(data);
        setView('rezultate');
      } else {
        setSearchError('Eroare la încărcarea anunțurilor');
      }
    } catch (err) {
      console.error('🔥 Eroare fetch anunțuri închirieri:', err);
      setSearchError(err.message || 'Eroare la conectarea la server');
    } finally {
      setLoading(false);
    }
  };
  
  // Starea pentru formularul de căutare
  const [searchData, setSearchData] = useState({
    tipVehicul: '', marca: '', model: '', anMin: '', anMax: '', 
    pretMinim: '', pretMaxim: '', perioada: '', oras: ''
  });

  // Starea pentru formularul de ofertă
  const [formData, setFormData] = useState({
    titlu: '', tipVehicul: '', marca: '', model: '', anFabricatie: '',
    combustibil: '', transmisie: '', pretPeZi: '', descriere: '',
    telefon: '', email: '', oras: '', disponibilDeLa: '', disponibilPanaLa: ''
  });

  const [poze, setPoze] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const maxPoze = 5;

  const tipuriVehicule = [
    translateText('Sedan', currentLanguage),
    translateText('Hatchback', currentLanguage), 
    translateText('SUV', currentLanguage),
    translateText('Break', currentLanguage),
    translateText('Coupe', currentLanguage),
    translateText('Cabrio', currentLanguage),
    translateText('Monovolum', currentLanguage),
    translateText('Pickup', currentLanguage),
    translateText('Van', currentLanguage)
  ];
  
  const perioadele = [
    translateText('1-3 zile', currentLanguage),
    translateText('1 săptămână', currentLanguage),
    translateText('2 săptămâni', currentLanguage), 
    translateText('1 lună', currentLanguage),
    translateText('peste 1 lună', currentLanguage)
  ];

  const combustibiliOferire = [
    translateText('Benzina', currentLanguage),
    translateText('Motorina', currentLanguage),
    translateText('Hibrid', currentLanguage),
    translateText('Electric', currentLanguage)
  ];

  const transmisiiOferire = [
    translateText('Manual', currentLanguage),
    translateText('Automată', currentLanguage),
    translateText('CVT', currentLanguage)
  ];
  
  // Folosim datele din vehicleData.js în loc de listă hardcoded
  const marciCautare = marci.Autoturism.map(m => m.label).sort();
  
  const getModeleForMarca = (marca) => {
    if (!marca) return [];
    const marcaKey = Object.keys(modele).find(
      key => key.toLowerCase() === marca.toLowerCase()
    );
    return marcaKey ? modele[marcaKey] : [];
  };

  // Handlers pentru căutare
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'marca' && { model: '' })
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Caută închirieri cu:', searchData);
    
    // Construiește filtrele pentru server
    const filters = {};
    if (searchData.marca) filters.marca = searchData.marca;
    if (searchData.model) filters.model = searchData.model;
    if (searchData.pretMinim) filters.pretMin = searchData.pretMinim;
    if (searchData.pretMaxim) filters.pretMax = searchData.pretMaxim;
    if (searchData.anMin) filters.anMin = searchData.anMin;
    if (searchData.anMax) filters.anMax = searchData.anMax;
    if (searchData.oras) filters.locatie = searchData.oras;
    
    // Verifică dacă există cel puțin un filtru
    if (Object.keys(filters).length === 0) {
      setSearchError('Te rugăm să selectezi cel puțin un criteriu de căutare');
      return;
    }
    
    fetchAnunturi(filters);
  };

  // Handlers pentru ofertă
  const handleOfferChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'marca' && { model: '' })
    }));
  };

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
      if (poze.length < maxPoze && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPoze(prev => {
            if (prev.length < maxPoze) {
              return [...prev, {
                id: Date.now() + Math.random(),
                file: file,
                preview: e.target.result,
                name: file.name
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
  const removePoza = (id) => { setPoze(poze.filter(poza => poza.id !== id)); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validare corectată - folosind formData în loc de variabile inexistente
    const requiredFields = [
      { value: formData.marca, name: 'Marca' },
      { value: formData.model, name: 'Model' },
      { value: formData.anFabricatie, name: 'Anul fabricației' },
      { value: formData.combustibil, name: 'Combustibil' },
      { value: formData.transmisie, name: 'Transmisie' },
      { value: formData.pretPeZi, name: 'Preț pe zi' },
      { value: formData.oras, name: 'Oraș' },
      { value: formData.descriere, name: 'Descriere' }
    ];

    // Verifică câmpurile obligatorii
    for (const field of requiredFields) {
      if (!field.value || field.value.toString().trim() === '') {
        setError(`Te rog completează câmpul: ${field.name}`);
        return;
      }
    }

    // Verifică că prețul este valid
    if (isNaN(formData.pretPeZi) || Number(formData.pretPeZi) <= 0) {
      setError('Te rog introdu un preț valid');
      return;
    }

    // Verifică că anul este valid
    const currentYear = new Date().getFullYear();
    if (isNaN(formData.anFabricatie) || Number(formData.anFabricatie) < 1900 || Number(formData.anFabricatie) > currentYear + 1) {
      setError('Te rog introdu un an valid');
      return;
    }

    // Verifică pozele (minim 1)
    if (poze.length === 0) {
      setError('Te rog încarcă cel puțin o poză');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('🚀 Început trimitere formular...');
      console.log('📋 FormData:', formData);
      console.log('🖼️ Poze:', poze.length);
      
      const formDataToSend = new FormData();
      formDataToSend.append('tipVehicul', formData.tipVehicul);
      formDataToSend.append('marca', formData.marca);
      formDataToSend.append('model', formData.model);
      formDataToSend.append('anFabricatie', formData.anFabricatie);
      formDataToSend.append('carburant', formData.combustibil);
      formDataToSend.append('transmisie', formData.transmisie);
      formDataToSend.append('pret', formData.pretPeZi);
      formDataToSend.append('locatie', formData.oras);
      formDataToSend.append('descriere', formData.descriere);
      formDataToSend.append('telefon', formData.telefon || '');
      formDataToSend.append('email', formData.email || '');
      
      // Adaugă pozele
      poze.forEach((poza, index) => {
        formDataToSend.append('poze', poza.file);
      });

      const token = localStorage.getItem('token');
      console.log('🔑 Token:', token ? 'Există' : 'Lipsește');
      console.log('🌐 Trimit cerere către:', `${API_BASE_URL}/api/car-rentals`);
      
      const response = await fetch(`${API_BASE_URL}/api/car-rentals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      console.log('📡 Răspuns status:', response.status);
      console.log('📡 Răspuns headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Oferta "${formData.titlu}" a fost publicată cu succes!\n\nDetalii:\n- Marca: ${formData.marca} ${formData.model}\n- Anul: ${formData.anFabricatie}\n- Preț: ${formData.pretPeZi}€/zi\n- Poze: ${poze.length}`);
        
        // Reset formular după succes
        setFormData({
          titlu: '', tipVehicul: '', marca: '', model: '', anFabricatie: '',
          combustibil: '', transmisie: '', pretPeZi: '', descriere: '',
          telefon: '', email: '', oras: '', disponibilDeLa: '', disponibilPanaLa: ''
        });
        setPoze([]);
        
        // Întoarce la meniu după 2 secunde
        setTimeout(() => {
          setView('menu');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Eroare la adăugarea anunțului');
      }
      
    } catch (error) {
      console.error('❌ Eroare completă:', error);
      console.error('❌ Tip eroare:', error.name);
      console.error('❌ Mesaj eroare:', error.message);
      setError('Eroare de conexiune la server');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Meniul principal
  if (view === 'menu') {
    return (
      <div className="max-w-4xl mx-auto p-6 page-container">
        <div className="bg-gray-700 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-200">
            {translateText('carRentals', currentLanguage)}
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Caută Închiriere */}
            <div className="bg-gray-600 rounded-lg p-6 text-center hover:bg-gray-500 transition-colors cursor-pointer"
                 onClick={() => setView('cauta')}>
              <div className="mb-4">
                <div className="h-16 w-16 mx-auto text-blue-400 text-6xl">🔍</div>
              </div>
              <h2 className="text-xl font-semibold mb-3 text-blue-200">
                {translateText('searchCars', currentLanguage)}
              </h2>
              <p className="text-gray-300 mb-4">
                {translateText('searchCarsDescription', currentLanguage)}
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                {translateText('searchButton', currentLanguage)}
              </button>
            </div>

            {/* Oferă Închiriere */}
            <div className="bg-gray-600 rounded-lg p-6 text-center hover:bg-gray-500 transition-colors cursor-pointer"
                 onClick={() => setView('ofera')}>
              <div className="mb-4">
                <div className="h-16 w-16 mx-auto text-green-400 text-6xl">➕</div>
              </div>
              <h2 className="text-xl font-semibold mb-3 text-blue-200">
                {translateText('offerCar', currentLanguage)}
              </h2>
              <p className="text-gray-300 mb-4">
                {translateText('offerCarDescription', currentLanguage)}
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                {translateText('publishOffer', currentLanguage)}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formularul de căutare
  if (view === 'cauta') {
    const emptySlots = Array(maxPoze - poze.length).fill(null);
    
    return (
      <div className="max-w-4xl mx-auto p-6 page-container">
        <div className="bg-gray-700 rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => setView('menu')} 
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg mr-4">
              ← {translateText('backToMenu', currentLanguage)}
            </button>
            <h1 className="text-3xl font-bold text-blue-200">{translateText('searchCars', currentLanguage)}</h1>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('vehicleType', currentLanguage)}</label>
                <select name="tipVehicul" value={searchData.tipVehicul} onChange={handleSearchChange}
                  className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">{translateText('Selecteaza tipul vehiculului', currentLanguage)}</option>
                  {tipuriVehicule.map(tip => <option key={tip} value={tip}>{tip}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('period', currentLanguage)}</label>
                <select name="perioada" value={searchData.perioada} onChange={handleSearchChange}
                  className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">{translateText('Selectează perioada', currentLanguage)}</option>
                  {perioadele.map(perioada => <option key={perioada} value={perioada}>{perioada}</option>)}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('brand', currentLanguage)}</label>
                <select name="marca" value={searchData.marca} onChange={handleSearchChange}
                  className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">{translateText('Selecteaza marca', currentLanguage)}</option>
                  {marciCautare.map(marca => <option key={marca} value={marca}>{marca}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('model', currentLanguage)}</label>
                <select name="model" value={searchData.model} onChange={handleSearchChange} disabled={!searchData.marca}
                  className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                  <option value="">{translateText('Selecteaza modelul', currentLanguage)}</option>
                  {searchData.marca && getModeleForMarca(searchData.marca)?.map(model => <option key={model} value={model}>{model}</option>)}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('minPrice', currentLanguage)} (€/zi)</label>
                <input type="number" name="pretMinim" value={searchData.pretMinim} onChange={handleSearchChange}
                  className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('maxPrice', currentLanguage)} (€/zi)</label>
                <input type="number" name="pretMaxim" value={searchData.pretMaxim} onChange={handleSearchChange}
                  className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('city', currentLanguage)}</label>
              <input type="text" name="oras" value={searchData.oras} onChange={handleSearchChange}
                className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium">
                🔍 {translateText('searchButton', currentLanguage)}
              </button>
              <button type="button" onClick={() => setSearchData({
                tipVehicul: '', marca: '', model: '', anMin: '', anMax: '', pretMinim: '', pretMaxim: '', perioada: '', oras: ''
              })} className="px-6 py-3 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-600">
                Resetează
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Formularul de ofertă
  if (view === 'ofera') {
    const emptySlots = Array(maxPoze - poze.length).fill(null);
    
    return (
      <div className="max-w-4xl mx-auto p-6 page-container">
        <div className="bg-gray-700 rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => setView('menu')} 
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg mr-4">
              ← {translateText('back', currentLanguage)}
            </button>
            <h1 className="text-3xl font-bold text-blue-200">{translateText('offerCarForRent', currentLanguage)}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('adTitle', currentLanguage)} *</label>
              <input type="text" name="titlu" value={formData.titlu} onChange={handleOfferChange} required
                placeholder={translateText('adTitlePlaceholder', currentLanguage)}
                className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('vehicleType', currentLanguage)} *</label>
                <select name="tipVehicul" value={formData.tipVehicul} onChange={handleOfferChange} required
                  className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">{translateText('Selecteaza tipul vehiculului', currentLanguage)}</option>
                  {tipuriVehicule.map(tip => <option key={tip} value={tip}>{tip}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('fuel', currentLanguage)} *</label>
                <select name="combustibil" value={formData.combustibil} onChange={handleOfferChange} required
                  className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">{translateText('Selecteaza combustibilul', currentLanguage)}</option>
                  {combustibiliOferire.map(combustibil => <option key={combustibil} value={combustibil}>{combustibil}</option>)}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('transmission', currentLanguage)} *</label>
                <select name="transmisie" value={formData.transmisie} onChange={handleOfferChange} required
                  className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">{translateText('Selecteaza cutia de viteze', currentLanguage)}</option>
                  {transmisiiOferire.map(transmisie => <option key={transmisie} value={transmisie}>{transmisie}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('brand', currentLanguage)} *</label>
                <select name="marca" value={formData.marca} onChange={handleOfferChange} required
                  className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">{translateText('Selecteaza marca', currentLanguage)}</option>
                  {marciCautare.map(marca => <option key={marca} value={marca}>{marca}</option>)}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('model', currentLanguage)} *</label>
                <select name="model" value={formData.model} onChange={handleOfferChange} required disabled={!formData.marca}
                  className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                  <option value="">{translateText('Selecteaza modelul', currentLanguage)}</option>
                  {formData.marca && getModeleForMarca(formData.marca)?.map(model => <option key={model} value={model}>{model}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('manufacturingYear', currentLanguage)} *</label>
                <input type="number" name="anFabricatie" value={formData.anFabricatie} onChange={handleOfferChange}
                  required min="1990" max="2025"
                  className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('pricePerDay', currentLanguage)} (€) *</label>
                <input type="number" name="pretPeZi" value={formData.pretPeZi} onChange={handleOfferChange} required min="1"
                  className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('city', currentLanguage)} *</label>
                <input type="text" name="oras" value={formData.oras} onChange={handleOfferChange} required
                  placeholder={translateText('cityPlaceholder', currentLanguage)}
                  className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-blue-200">{translateText('carPhotos', currentLanguage)} ({poze.length}/{maxPoze}) *</label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragOver ? 'border-blue-400 bg-blue-900/20' : 'border-gray-500 bg-gray-600'}`}
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="foto-upload" disabled={poze.length >= maxPoze} />
                <label htmlFor="foto-upload" className={`cursor-pointer ${poze.length >= maxPoze ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="text-blue-200 mb-2">{translateText('dragPhotosText', currentLanguage)}</div>
                  <div className="text-sm text-gray-400">
                    {poze.length >= maxPoze ? translateText('photoLimitReached', currentLanguage).replace('{maxPoze}', maxPoze) : translateText('canAddMorePhotos', currentLanguage).replace('{remaining}', maxPoze - poze.length).replace('{photoWord}', maxPoze - poze.length === 1 ? translateText('photo', currentLanguage) : translateText('photos', currentLanguage))}
                  </div>
                </label>
              </div>

              {(poze.length > 0 || emptySlots.length > 0) && (
                <div className="grid grid-cols-5 gap-4 mt-4">
                  {poze.map((poza) => (
                    <div key={poza.id} className="relative group">
                      <img src={poza.preview} alt={poza.name} className="w-full h-24 object-cover rounded-lg border border-gray-500" />
                      <button type="button" onClick={() => removePoza(poza.id)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-sm hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        ×
                      </button>
                    </div>
                  ))}
                  {emptySlots.map((_, index) => (
                    <div key={`empty-${index}`} className="w-full h-24 bg-gray-600 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">+</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-blue-200">Descriere *</label>
              <textarea name="descriere" value={formData.descriere} onChange={handleOfferChange} required rows="4"
                placeholder={translateText('descriptionPlaceholder', currentLanguage)}
                className="w-full p-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-4">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-medium text-lg transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Se publică...
                  </span>
                ) : (
                  '🚗 Publică oferta de închiriere'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Rezultate căutare
  if (view === 'rezultate') {
    return (
      <div className="max-w-6xl mx-auto p-6 page-container">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setView('menu')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← Înapoi la meniu
          </button>
          <button
            onClick={() => setView('cauta')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🔍 Caută din nou
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Închirieri auto disponibile
        </h1>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Se încarcă anunțurile...</p>
          </div>
        )}

        {searchError && (
          <div className="text-center py-12">
            <p className="text-red-600 font-semibold mb-4">{searchError}</p>
            <button 
              onClick={() => fetchAnunturi()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Încearcă din nou
            </button>
          </div>
        )}

        {!loading && !searchError && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {anunturi.length} anunț{anunturi.length !== 1 ? 'uri' : ''} găsit{anunturi.length !== 1 ? 'e' : ''}
              </p>
            </div>

            {anunturi.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-lg mb-4">Nu am găsit anunțuri de închiriere.</p>
                <p className="text-gray-500">Încercați să modificați filtrele sau să căutați din nou.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {anunturi.map(anunt => (
                  <CarCard 
                    key={anunt._id} 
                    car={anunt} 
                    type="inchirieri"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return null;
};

export default InchirieriAuto;
