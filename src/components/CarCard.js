import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const CarCard = ({ car, type = 'vanzari' }) => {
  // Construiește URL pentru prima poză
  let imageSrc = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500';
  
  // Funcție helper pentru validarea URL-ului
  const isValidUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    // Verifică dacă e URL valid Cloudinary sau alt URL complet
    return url.startsWith('https://res.cloudinary.com/') || 
           (url.startsWith('http') && url.includes('://') && url.includes('.'));
  };
  
  if (car.photos && car.photos.length > 0) {
    // Cloudinary URL sau path relativ
    const photoUrl = car.photos[0];
    if (isValidUrl(photoUrl)) {
      // URL complet valid Cloudinary sau alt CDN
      imageSrc = photoUrl;
    } else if (photoUrl.startsWith('/')) {
      // Path relativ (legacy)
      imageSrc = `${API_BASE_URL}${photoUrl}`;
    }
    // Else: URL invalid (doar nume fișier) → folosește placeholder default
  } else if (car.poze && car.poze.length > 0) {
    // Fallback pentru câmpul vechi 'poze'
    const photoUrl = car.poze[0];
    if (isValidUrl(photoUrl)) {
      imageSrc = photoUrl;
    } else if (photoUrl.startsWith('/')) {
      imageSrc = `${API_BASE_URL}${photoUrl}`;
    }
  } else if (car.image && isValidUrl(car.image)) {
    imageSrc = car.image;
  }

  const brand = car.marca || car.brand;
  const model = car.model;
  const year = car.anFabricatie || car.an || car.year;
  const price = car.pret || car.pretPeZi || car.price;
  const carId = car._id || car.id;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageSrc}
          alt={`${brand} ${model}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {car.featured && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
            ⭐ Featured
          </div>
        )}
        {type === 'inchirieri' && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            🚗 Închiriere
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {brand} {model}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">📅 {year}</span>
          <span className="text-xl font-bold text-blue-600">
            €{price?.toLocaleString()}{type === 'inchirieri' ? '/zi' : ''}
          </span>
        </div>
        <Link
          to={`/anunt/${type}/${carId}`}
          className="block w-full text-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Vezi Detalii →
        </Link>
      </div>
    </div>
  );
};

export default CarCard;