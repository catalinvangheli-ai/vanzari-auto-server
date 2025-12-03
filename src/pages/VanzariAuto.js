import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translateText } from '../utils/simpleTranslator';
import { API_BASE_URL } from '../config/api';
import { fetchWithRetry } from '../utils/fetchWithRetry';
import CarCard from '../components/CarCard';
import { marci, modele } from '../utils/vehicleData';

const VanzariAuto = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { language: currentLanguage } = useLanguage();
  const [showResults, setShowResults] = useState(false);
  const [anunturi, setAnunturi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // NU încărcăm anunțuri automat - utilizatorul trebuie să caute
  // useEffect(() => {
  //   fetchAnunturi();
  // }, []);

  const fetchAnunturi = async (filters = {}) => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}/api/car-sales${queryParams ? `?${queryParams}` : ''}`;
      
      console.log('🚗 Încărcare anunțuri vânzare din:', url);
      
      const response = await fetchWithRetry(url, {}, {
        timeout: 60000, // 60 secunde
        retries: 5, // 5 reîncercări = total 6 minute maxim
        retryDelay: 5000 // 5 secunde între încercări
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Anunțuri primite:', data.length);
        setAnunturi(data);
        setShowResults(true);
      } else {
        setError('Eroare la încărcarea anunțurilor');
      }
    } catch (err) {
      console.error('🔥 Eroare fetch anunțuri:', err);
      setError(err.message || 'Eroare la conectarea la server');
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    vehicleType: '',
    brand: '',
    model: '',
    priceFrom: '',
    priceTo: '',
    yearFrom: '',
    yearTo: '',
    kilometers: '',
    fuel: '',
    transmission: '',
    powerFrom: '',
    powerTo: '',
    engineFrom: '',
    engineTo: '',
    sortBy: ''
  });

  // Vehicle types - acum traduse
  const vehicleTypes = [
    translateText('Autoturisme', currentLanguage),
    translateText('Autoutilitare', currentLanguage), 
    translateText('Camioane', currentLanguage),
    translateText('Rulote si autorulote', currentLanguage),
    translateText('Motociclete scutere si trotinete electrice', currentLanguage)
  ];

  // Car brands - folosim vehicleData.js
  const carBrands = marci.Autoturism.sort((a, b) => a.label.localeCompare(b.label));

  // Motorcycle brands - folosim vehicleData.js
  const motorcycleBrands = marci['Motocicletă'].sort((a, b) => a.label.localeCompare(b.label));

  // Car models by brand - folosim vehicleData.js
  const getModelsForBrand = () => {
    if (!formData.brand) return [];
    
    // Căutăm cheia în modele (lowercase pentru match)
    const brandKey = Object.keys(modele).find(
      key => key.toLowerCase() === formData.brand.toLowerCase()
    );
    
    return brandKey ? modele[brandKey] : [];
  };

  // Fuel types
  const fuelTypes = [
    translateText('Benzina', currentLanguage),
    translateText('Motorina', currentLanguage), 
    translateText('GPL', currentLanguage),
    translateText('Electric', currentLanguage),
    translateText('Hibrid', currentLanguage)
  ];

  // Transmission types  
  const transmissionTypes = [
    translateText('Manual', currentLanguage),
    translateText('Automată', currentLanguage),
    translateText('Semi-automată', currentLanguage),
    translateText('CVT', currentLanguage)
  ];

  // Sort options
  const sortOptions = [
    translateText('Cele mai noi', currentLanguage),
    translateText('Ieftine', currentLanguage),
    translateText('Scumpe', currentLanguage)
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'brand') {
      setFormData(prevState => ({
        ...prevState,
        model: ''
      }));
    }
  };

  const getBrandsForVehicleType = () => {
    if (formData.vehicleType === 'Motociclete scutere si trotinete electrice') {
      return motorcycleBrands;
    }
    return carBrands;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construiește filtrele pentru server
    const filters = {};
    if (formData.brand) filters.marca = formData.brand;
    if (formData.model) filters.model = formData.model;
    if (formData.priceFrom) filters.pretMin = formData.priceFrom;
    if (formData.priceTo) filters.pretMax = formData.priceTo;
    if (formData.yearFrom) filters.anMin = formData.yearFrom;
    if (formData.yearTo) filters.anMax = formData.yearTo;
    if (formData.fuel) filters.combustibil = formData.fuel;
    if (formData.transmission) filters.transmisie = formData.transmission;
    if (formData.powerFrom) filters.putereMin = formData.powerFrom;
    if (formData.powerTo) filters.putereMax = formData.powerTo;
    if (formData.engineFrom) filters.capacitateMin = formData.engineFrom;
    if (formData.engineTo) filters.capacitateMax = formData.engineTo;
    
    // Verifică dacă există cel puțin un filtru
    if (Object.keys(filters).length === 0) {
      setError('Te rugăm să selectezi cel puțin un criteriu de căutare');
      return;
    }
    
    console.log('Filtres de căutare:', filters);
    fetchAnunturi(filters);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg page-container">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{translateText('carSales', currentLanguage)}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {translateText('vehicleTypeFilter', currentLanguage)}
          </label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{translateText('Selecteaza tipul vehiculului', currentLanguage)}</option>
            {vehicleTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {translateText('brand', currentLanguage)}
          </label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!formData.vehicleType}
          >
            <option value="">{translateText('Selecteaza marca', currentLanguage)}</option>
            {getBrandsForVehicleType().map(brand => (
              <option key={brand.value} value={brand.value}>{brand.label}</option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {translateText('model', currentLanguage)}
          </label>
          <select
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!formData.brand}
          >
            <option value="">{translateText('Selecteaza modelul', currentLanguage)}</option>
            {getModelsForBrand().map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {translateText('price', currentLanguage)} (EUR)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="priceFrom"
              value={formData.priceFrom}
              onChange={handleInputChange}
              placeholder={translateText('priceFrom', currentLanguage)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="priceTo"
              value={formData.priceTo}
              onChange={handleInputChange}
              placeholder={translateText('priceTo', currentLanguage)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Year Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {translateText('year', currentLanguage)}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="yearFrom"
              value={formData.yearFrom}
              onChange={handleInputChange}
              placeholder={translateText('yearFrom', currentLanguage)}
              min="1900"
              max="2025"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="yearTo"
              value={formData.yearTo}
              onChange={handleInputChange}
              placeholder={translateText('yearTo', currentLanguage)}
              min="1900"
              max="2025"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Kilometers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {translateText('kilometers', currentLanguage)}
          </label>
          <input
            type="number"
            name="kilometers"
            value={formData.kilometers}
            onChange={handleInputChange}
            placeholder={translateText('kilometers', currentLanguage)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {translateText('fuel', currentLanguage)}
          </label>
          <select
            name="fuel"
            value={formData.fuel}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{translateText('Selecteaza combustibilul', currentLanguage)}</option>
            {fuelTypes.map(fuel => (
              <option key={fuel} value={fuel}>{fuel}</option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {translateText('transmission', currentLanguage)}
          </label>
          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{translateText('Selecteaza cutia de viteze', currentLanguage)}</option>
            {transmissionTypes.map(transmission => (
              <option key={transmission} value={transmission}>{transmission}</option>
            ))}
          </select>
        </div>

        {/* Power (HP) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {translateText('Putere (CP)', currentLanguage)}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="powerFrom"
              value={formData.powerFrom}
              onChange={handleInputChange}
              placeholder={translateText('De la', currentLanguage)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="powerTo"
              value={formData.powerTo}
              onChange={handleInputChange}
              placeholder={translateText('Până la', currentLanguage)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Engine Capacity (cc) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {translateText('Capacitate cilindrică (cmc)', currentLanguage)}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="engineFrom"
              value={formData.engineFrom}
              onChange={handleInputChange}
              placeholder={translateText('De la', currentLanguage)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="engineTo"
              value={formData.engineTo}
              onChange={handleInputChange}
              placeholder={translateText('Până la', currentLanguage)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {translateText('sortBy', currentLanguage)}
          </label>
          <select
            name="sortBy"
            value={formData.sortBy}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{translateText('Selecteaza sortarea', currentLanguage)}</option>
            {sortOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          {translateText('Cauta vehicule', currentLanguage)}
        </button>
      </form>

      {/* Rezultate căutare */}
      {loading && (
        <div className="mt-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Se încarcă anunțurile...</p>
        </div>
      )}

      {error && (
        <div className="mt-8 text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          <button 
            onClick={() => fetchAnunturi()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Încearcă din nou
          </button>
        </div>
      )}

      {showResults && !loading && !error && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Rezultate căutare ({anunturi.length} anunț{anunturi.length !== 1 ? 'uri' : ''} găsit{anunturi.length !== 1 ? 'e' : ''})
          </h2>
          
          {anunturi.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">Nu am găsit anunțuri care să corespundă criteriilor de căutare.</p>
              <p className="text-gray-500">Încercați să modificați filtrele sau să căutați din nou.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {anunturi.map(anunt => (
                <CarCard 
                  key={anunt._id} 
                  car={anunt} 
                  type="vanzari"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!showResults && !loading && !error && (
        <div className="mt-12 text-center py-16 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {translateText('Cauta vehiculul dorit', currentLanguage)}
          </h3>
          <p className="text-gray-600">
            {translateText('Selecteaza criteriile de mai sus si apasa butonul Cauta', currentLanguage)}
          </p>
        </div>
      )}
    </div>
  );
};

export default VanzariAuto;
