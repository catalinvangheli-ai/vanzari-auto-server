import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translateText } from '../utils/simpleTranslator';
import { marci, modele } from '../utils/vehicleData';
import { API_BASE_URL } from '../config/api';

const AdaugaAnunt = () => {
  const { isAuthenticated, username } = useContext(AuthContext);
  const [tipVehicul, setTipVehicul] = useState('');
  const [marca, setMarca] = useState('');
  const [model, setModel] = useState('');
  const [pret, setPret] = useState('');
  const [an, setAn] = useState('');
  const [km, setKm] = useState('');
  const [combustibil, setCombustibil] = useState('');
  const [transmisie, setTransmisie] = useState('');
  const [descrierePersonala, setDescrierePersonala] = useState('');
  const [poze, setPoze] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locatie, setLocatie] = useState('');
  const [telefon, setTelefon] = useState('');
  const [culoare, setCuloare] = useState('');
  const [putere, setPutere] = useState('');
  const [capacitateCilindrica, setCapacitateCilindrica] = useState('');
  const { language: currentLanguage } = useLanguage();

  // Numărul fix de poze pentru vânzări
  const maxPoze = 9;

  // Funcție pentru a găsi modelele pentru marca selectată
  const getModelsForBrand = (marcaValue) => {
    if (!marcaValue) return [];
    
    // Căutăm cheia în modele (lowercase pentru match exact)
    const brandKey = Object.keys(modele).find(
      key => key.toLowerCase() === marcaValue.toLowerCase()
    );
    
    return brandKey ? modele[brandKey] : [];
  };

  // Funcție pentru încărcarea pozelor
  const handlePozaUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (poze.length < maxPoze && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newPoza = {
            id: Date.now() + Math.random(),
            file: file,
            preview: event.target.result
          };
          setPoze(prev => {
            if (prev.length < maxPoze) {
              return [...prev, newPoza];
            }
            return prev;
          });
        };
        reader.readAsDataURL(file);
      }
    });
    e.target.value = ''; // Reset input pentru a permite re-upload aceeași poză
  };

  // Funcție pentru ștergerea unei poze
  const removePoza = (id) => {
    setPoze(poze.filter(poza => poza.id !== id));
  };

  // Resetează pozele când se schimbă tipul vehiculului
  const handleTipVehiculChange = (e) => {
    setTipVehicul(e.target.value);
    setMarca('');
    setModel('');
    // Nu mai resetăm pozele pentru că sunt întotdeauna 9 pentru vânzări
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Trebuie să te loghezi pentru a posta un anunț!');
      return;
    }

    // Validare câmpuri obligatorii
    if (!tipVehicul || !marca || !model || !pret || !an || !km) {
      alert('Te rog completează toate câmpurile obligatorii!');
      return;
    }

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Creează FormData pentru a trimite fișiere
      const formData = new FormData();
      formData.append('marca', marca);
      formData.append('model', model);
      formData.append('anFabricatie', parseInt(an));
      formData.append('km', parseInt(km));
      formData.append('pret', parseInt(pret));
      formData.append('culoare', culoare);
      formData.append('carburant', combustibil);
      formData.append('transmisie', transmisie);
      formData.append('putere', putere ? parseInt(putere) : '');
      formData.append('capacitateCilindrica', capacitateCilindrica ? parseInt(capacitateCilindrica) : '');
      formData.append('descriere', descrierePersonala);
      formData.append('locatie', locatie);
      formData.append('telefon', telefon);
      
      // Adaugă fișierele foto
      poze.forEach((poza) => {
        formData.append('poze', poza.file);
      });

      const response = await fetch(`${API_BASE_URL}/api/car-sales`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ SUCCES! Anunțul a fost salvat! ID: ${result.id}`);
        
        // Reset formular după submit
        setTipVehicul('');
        setMarca('');
        setModel('');
        setPret('');
        setAn('');
        setKm('');
        setCombustibil('');
        setTransmisie('');
        setDescrierePersonala('');
        setPoze([]);
        setLocatie('');
        setTelefon('');
        setCuloare('');
        setPutere('');
        setCapacitateCilindrica('');
      } else {
        const errorText = await response.text();
        console.error('Eroare backend:', errorText);
        try {
          const error = JSON.parse(errorText);
          alert(`Eroare: ${error.error || errorText}`);
        } catch {
          alert(`Eroare: ${errorText}`);
        }
      }
    } catch (error) {
      console.error('Eroare salvare anunt:', error);
      alert(`Eroare la salvarea anuntului: ${error.message}. Verifică conexiunea la internet.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 page-container">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {translateText("Adaugă anunț", currentLanguage)}
      </h1>

      {!isAuthenticated ? (
        <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-300 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">Autentificare necesară</h2>
          <p className="text-yellow-700 mb-4">Trebuie să te loghezi pentru a posta un anunț.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Du-te la Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tip vehicul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translateText("Tip vehicul", currentLanguage)}
            </label>
            <select
              value={tipVehicul}
              onChange={handleTipVehiculChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">{translateText("Selectează tipul vehiculului", currentLanguage)}</option>
              <option value="Autoturism">{translateText("Autoturisme", currentLanguage)}</option>
              <option value="Motocicletă">{translateText("Motociclete", currentLanguage)}</option>
              <option value="Autoutilitară">{translateText("Auto utilitare", currentLanguage)}</option>
              <option value="Rulotă">{translateText("Rulote", currentLanguage)}</option>
              <option value="Scuter">{translateText("Scuter", currentLanguage)}</option>
            </select>
          </div>

          {/* Marca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translateText("Marca", currentLanguage)}
            </label>
            <select
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              disabled={!tipVehicul}
            >
              <option value="">{translateText("Selectează marca", currentLanguage)}</option>
              {tipVehicul && marci[tipVehicul]?.map(marca => (
                <option key={marca.value} value={marca.value}>
                  {marca.label}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translateText("Modelul", currentLanguage)}
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              disabled={!marca}
            >
              <option value="">{translateText("Selectează modelul", currentLanguage)}</option>
              {marca && getModelsForBrand(marca)?.map(model => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          {/* Preț */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translateText("Preț (€)", currentLanguage)}
            </label>
            <input
              type="number"
              value={pret}
              onChange={(e) => setPret(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="ex: 15000"
              required
            />
          </div>

          {/* An */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translateText("An fabricație", currentLanguage)}
            </label>
            <input
              type="number"
              value={an}
              onChange={(e) => setAn(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="ex: 2020"
              min="1900"
              max="2024"
              required
            />
          </div>

          {/* Kilometri */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translateText("Kilometri", currentLanguage)}
            </label>
            <input
              type="number"
              value={km}
              onChange={(e) => setKm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="ex: 50000"
              required
            />
          </div>

          {/* Combustibil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translateText("Combustibil", currentLanguage)}
            </label>
            <select
              value={combustibil}
              onChange={(e) => setCombustibil(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">{translateText("Selectează combustibilul", currentLanguage)}</option>
              <option value="benzina">{translateText("Benzină", currentLanguage)}</option>
              <option value="motorina">{translateText("Motorină", currentLanguage)}</option>
              <option value="hybrid">{translateText("Hybrid", currentLanguage)}</option>
              <option value="electric">{translateText("Electric", currentLanguage)}</option>
              <option value="gpl">{translateText("GPL", currentLanguage)}</option>
              <option value="cng">{translateText("CNG", currentLanguage)}</option>
            </select>
          </div>

          {/* Transmisie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translateText("Transmisie", currentLanguage)}
            </label>
            <select
              value={transmisie}
              onChange={(e) => setTransmisie(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">{translateText("Selectează transmisia", currentLanguage)}</option>
              <option value="manuala">{translateText("Manuală", currentLanguage)}</option>
              <option value="automata">{translateText("Automată", currentLanguage)}</option>
              <option value="semiautomata">{translateText("Semi-automată", currentLanguage)}</option>
            </select>
          </div>

          {/* Culoare */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translateText("Culoarea", currentLanguage)}
            </label>
            <input
              type="text"
              value={culoare}
              onChange={(e) => setCuloare(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="ex: Alb, Negru, Roșu"
            />
          </div>

          {/* Putere */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translateText("Putere (CP)", currentLanguage)}
            </label>
            <input
              type="number"
              value={putere}
              onChange={(e) => setPutere(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="ex: 150"
            />
          </div>

          {/* Capacitate Cilindrică */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translateText("Capacitate cilindrică (cmc)", currentLanguage)}
            </label>
            <input
              type="number"
              value={capacitateCilindrica}
              onChange={(e) => setCapacitateCilindrica(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="ex: 1600"
            />
          </div>

          {/* Locație */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translateText("Locație", currentLanguage)}
            </label>
            <input
              type="text"
              value={locatie}
              onChange={(e) => setLocatie(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="ex: București, Cluj-Napoca"
              required
            />
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translateText("Telefon contact", currentLanguage)}
            </label>
            <input
              type="tel"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="ex: 0721123456"
              required
            />
          </div>
        </div>

        {/* Descriere personală */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {translateText("Descriere personală", currentLanguage)}
          </label>
          <textarea
            value={descrierePersonala}
            onChange={(e) => setDescrierePersonala(e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder={translateText("Adaugă o descriere detaliată a vehiculului...", currentLanguage)}
            required
          />
        </div>

        {/* Secțiunea pentru încărcarea pozelor */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poze vehicul ({poze.length}/{maxPoze})
          </label>
          <div className="space-y-4">
            {/* Upload zone */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePozaUpload}
                className="hidden"
                id="poze-upload"
                disabled={poze.length >= maxPoze}
              />
              <label
                htmlFor="poze-upload"
                className={`cursor-pointer flex flex-col items-center justify-center ${poze.length >= maxPoze ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-gray-600 mb-1">
                  {poze.length >= maxPoze ? 'Numărul maxim de poze atins' : 'Apasă pentru a încărca poze sau trage pozele aici'}
                </span>
                <span className="text-xs text-gray-500">
                  Maximum {maxPoze} poze (JPG, PNG, GIF)
                </span>
              </label>
            </div>

            {/* Preview pozelor încărcate */}
            {poze.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {poze.map((poza, index) => (
                  <div key={poza.id} className="relative group">
                    <img
                      src={poza.preview}
                      alt={`Poză ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removePoza(poza.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
                
                {/* Placeholder-uri pentru pozele rămase */}
                {[...Array(maxPoze - poze.length)].map((_, index) => (
                  <div
                    key={`placeholder-${index}`}
                    className="w-full h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buton submit */}
        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`font-bold py-3 px-8 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Se salvează...
              </div>
            ) : (
              'Confirmă anunțul'
            )}
          </button>
        </div>
      </form>
      )}
    </div>
  );
};

export default AdaugaAnunt;