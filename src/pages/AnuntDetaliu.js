import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import { fetchWithRetry } from '../utils/fetchWithRetry';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

const AnuntDetaliu = () => {
  const { id, type } = useParams(); // id și type (vanzari/inchirieri) din URL
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  
  const [anunt, setAnunt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Handler pentru butonul back al Android-ului - DOAR pe platformă nativă
  useEffect(() => {
    // Verifică dacă rulează pe platformă nativă (Android/iOS)
    if (Capacitor.isNativePlatform()) {
      const backButtonListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          navigate(-1);
        } else {
          CapacitorApp.exitApp();
        }
      });

      return () => {
        backButtonListener.remove();
      };
    }
    // În browser nu facem nimic - browserul gestionează butonul back
  }, [navigate]);

  useEffect(() => {
    console.log('🔍 AnuntDetaliu - Parametri URL:', { id, type });
    fetchAnunt();
  }, [id, type]);

  const fetchAnunt = async () => {
    try {
      setLoading(true);
      const endpoint = type === 'vanzari' ? 'car-sales' : 'car-rentals';
      const url = `${API_BASE_URL}/api/${endpoint}/${id}`;
      console.log('📡 Fetch anunț de la:', url);
      
      const response = await fetchWithRetry(url, {
        method: 'GET'
      }, {
        timeout: 60000,
        retries: 5,
        retryDelay: 5000
      });
      
      console.log('📦 Răspuns status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Date anunț primite:', data);
        setAnunt(data);
      } else {
        console.error('❌ Eroare răspuns:', response.status, response.statusText);
        setError('Anunțul nu a fost găsit');
      }
    } catch (err) {
      console.error('🔥 Eroare încărcare anunț:', err);
      setError('Eroare la încărcarea anunțului');
    } finally {
      setLoading(false);
    }
  };

  const openFullscreen = (index) => {
    setSelectedImageIndex(index);
    setShowFullscreen(true);
  };

  const closeFullscreen = () => {
    setShowFullscreen(false);
  };

  const nextImage = () => {
    if (imagesToShow && selectedImageIndex < imagesToShow.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleContactMessage = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Folosește USERNAME pentru chat (consistent cu backend)
    const contactUsername = anunt.username || anunt.userId;
    const title = `${anunt.marca} ${anunt.model}`;
    
    console.log('🔍 Contact info:', { 
      username: contactUsername,
      anunt: anunt 
    });
    
    if (contactUsername) {
      navigate(`/chat?user=${contactUsername}&listing=${anunt._id || anunt.id}&title=${encodeURIComponent(title)}`);
    } else {
      console.error('❌ Nu există date de contact:', anunt);
      alert('Nu există date de contact disponibile pentru acest anunț');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !anunt) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">{error}</h2>
        <button 
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          ← Înapoi
        </button>
      </div>
    );
  }

  const defaultImages = [
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800'
  ];

  // Construiește URL-uri pentru poze (Cloudinary sau legacy)
  const photoUrls = anunt.photos && anunt.photos.length > 0 
    ? anunt.photos.map(photo => {
        // Dacă e URL Cloudinary (începe cu http), folosește direct
        if (photo.startsWith('http')) return photo;
        // Altfel, construiește path relativ (legacy)
        return `${API_BASE_URL}${photo}`;
      })
    : [];

  const imagesToShow = photoUrls.length > 0 ? photoUrls : defaultImages;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Spațiu pentru status bar (50px) */}
      <div className="h-12 bg-black"></div>
      
      {/* Galeria de poze - 40% din ecran */}
      <div className="relative bg-black" style={{ height: '40vh' }}>
        {/* Poza principală mare - clickabilă pentru fullscreen */}
        <div 
          className="w-full h-full cursor-pointer"
          onClick={() => openFullscreen(selectedImageIndex)}
        >
          <img
            src={imagesToShow[selectedImageIndex]}
            alt={`${anunt.marca} ${anunt.model}`}
            className="w-full h-full object-cover"
          />
          {/* Overlay pentru better touch feedback */}
          <div className="absolute inset-0 hover:bg-white/5 transition-colors"></div>
        </div>

        {/* Buton înapoi - poziționat sub status bar */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 bg-black/60 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center z-10 hover:bg-black/80 transition-colors text-xl font-bold"
          style={{ top: '60px' }}
        >
          ←
        </button>

        {/* Indicatori număr poze */}
        {imagesToShow.length > 1 && (
          <div className="absolute right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-10" style={{ top: '65px' }}>
            {selectedImageIndex + 1} / {imagesToShow.length}
          </div>
        )}

        {/* Overlay cu informații de bază în josul pozei */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 pb-6">
          <h1 className="text-white text-2xl font-bold mb-2">
            {anunt.marca} {anunt.model}
          </h1>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="text-lg">{anunt.anFabricatie || anunt.an}</span>
              {type === 'vanzari' && anunt.km && (
                <span className="text-sm opacity-90">• {anunt.km.toLocaleString()} km</span>
              )}
            </div>
            <span className="text-yellow-400 text-2xl font-bold">
              {anunt.pret || anunt.pretPeZi}€{type === 'inchirieri' ? '/zi' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Miniaturi poze - 4-5 poze vizibile, scroll orizontal */}
      {imagesToShow.length > 1 && (
        <div className="bg-white p-3 border-b shadow-sm">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {imagesToShow.slice(0, 8).map((image, index) => (
              <button
                key={index}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-3 transition-all ${
                  index === selectedImageIndex 
                    ? 'border-blue-600 scale-105 shadow-lg' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => {
                  setSelectedImageIndex(index);
                  // Scroll sus automat când schimbi poza
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <img
                  src={image}
                  alt={`Imagine ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          {imagesToShow.length > 8 && (
            <p className="text-xs text-gray-500 text-center mt-2">
              +{imagesToShow.length - 8} poze (click pe poza mare pentru toate)
            </p>
          )}
        </div>
      )}

      {/* Detalii tehnice - card modern */}
      <div className="bg-white mx-3 mt-3 p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-xl mr-2">⚙️</span>
          Specificații tehnice
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-500 text-xs uppercase tracking-wide">Marca</span>
            <p className="font-semibold text-gray-900 mt-1">{anunt.marca}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-500 text-xs uppercase tracking-wide">Model</span>
            <p className="font-semibold text-gray-900 mt-1">{anunt.model}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-500 text-xs uppercase tracking-wide">An fabricație</span>
            <p className="font-semibold text-gray-900 mt-1">{anunt.anFabricatie || anunt.an}</p>
          </div>
          {type === 'vanzari' && anunt.km && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-500 text-xs uppercase tracking-wide">Kilometri</span>
              <p className="font-semibold text-gray-900 mt-1">{anunt.km.toLocaleString()}</p>
            </div>
          )}
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-500 text-xs uppercase tracking-wide">Combustibil</span>
            <p className="font-semibold text-gray-900 mt-1">{anunt.carburant || anunt.combustibil}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-500 text-xs uppercase tracking-wide">Transmisie</span>
            <p className="font-semibold text-gray-900 mt-1">{anunt.transmisie}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg col-span-2">
            <span className="text-gray-500 text-xs uppercase tracking-wide">📍 Locație</span>
            <p className="font-semibold text-gray-900 mt-1">{anunt.locatie}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg col-span-2 border-2 border-blue-200">
            <span className="text-blue-700 text-xs uppercase tracking-wide font-semibold">
              💰 {type === 'vanzari' ? 'Preț' : 'Preț pe zi'}
            </span>
            <p className="font-bold text-blue-900 text-2xl mt-1">
              {anunt.pret || anunt.pretPeZi}€{type === 'inchirieri' ? '/zi' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Descriere - card modern */}
      <div className="bg-white mx-3 mt-3 p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <span className="text-xl mr-2">📝</span>
          Descriere
        </h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {anunt.descriere || 'Nu există o descriere disponibilă pentru acest anunț.'}
        </p>
      </div>

      {/* Contact - card modern sticky bottom */}
      <div className="bg-white mx-3 mt-3 mb-3 p-4 rounded-xl shadow-lg">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-xl mr-2">📞</span>
          Contact
        </h2>
        
        {/* Informații vânzător */}
        <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div>
            <p className="font-bold text-gray-900 text-lg">
              {anunt.fullName || anunt.username || 'Proprietar'}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Membru din {new Date(anunt.createdAt).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Butoane contact - mari și moderne */}
        <div className="space-y-3">
          {anunt.telefon && (
            <a
              href={`tel:${anunt.telefon}`}
              className="block w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <span className="text-2xl mr-2">📞</span>
              {anunt.telefon}
            </a>
          )}
          
          <button
            onClick={handleContactMessage}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <span className="text-2xl mr-2">💬</span>
            Trimite mesaj
          </button>
        </div>

        {/* Locație și data publicării */}
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <div className="flex items-center text-gray-600">
            <span className="mr-2">📍</span>
            <span className="font-medium">{anunt.locatie}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <span className="mr-2">🕐</span>
            <span>Publicat la {new Date(anunt.createdAt).toLocaleDateString('ro-RO')}</span>
          </div>
        </div>
      </div>

      {/* Modal fullscreen pentru poze - ocupă tot displayul */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Header cu buton închidere și indicatori */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10">
            <div className="flex items-center justify-between">
              <div className="text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                {selectedImageIndex + 1} / {imagesToShow.length}
              </div>
              <button
                onClick={closeFullscreen}
                className="text-white text-3xl font-bold bg-black/50 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Poza - swipe pentru mobile */}
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={imagesToShow[selectedImageIndex]}
              alt={`${anunt.marca} ${anunt.model} - Imagine ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              style={{ maxHeight: '90vh' }}
            />
          </div>

          {/* Săgeți navigare - doar pe desktop sau când există multiple poze */}
          {imagesToShow.length > 1 && (
            <>
              {selectedImageIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold bg-black/50 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                >
                  ‹
                </button>
              )}
              {selectedImageIndex < imagesToShow.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold bg-black/50 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                >
                  ›
                </button>
              )}
            </>
          )}

          {/* Miniaturi jos pentru navigare rapidă */}
          {imagesToShow.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 px-4 z-10">
              <div className="flex gap-2 justify-center overflow-x-auto scrollbar-hide bg-black/40 backdrop-blur-sm rounded-full p-2 max-w-md mx-auto">
                {imagesToShow.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex 
                        ? 'border-white scale-110' 
                        : 'border-white/30 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumb ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnuntDetaliu;