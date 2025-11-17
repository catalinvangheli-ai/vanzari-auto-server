// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import CarCard from '../components/CarCard';

const Home = () => {
  const { t } = useLanguage();
  const [featuredCars, setFeaturedCars] = useState([]);

  useEffect(() => {
    const mockCars = [
      {
        id: 1,
        brand: 'BMW',
        model: 'Seria 5',
        year: 2023,
        price: 45000,
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500',
        featured: true
      },
      {
        id: 2,
        brand: 'Mercedes-Benz',
        model: 'C-Class',
        year: 2023,
        price: 42000,
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500',
        featured: true
      },
      {
        id: 3,
        brand: 'Audi',
        model: 'A4',
        year: 2022,
        price: 38000,
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500',
        featured: true
      }
    ];
    setFeaturedCars(mockCars);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-8 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6">
              {t('welcome')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              {t('heroDescription')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto px-4">
              <Link
                to="/vanzari"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                🚗 {t('exploreSales')}
              </Link>
              <Link
                to="/inchirieri"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
              >
                🔑 {t('exploreRentals')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6 sm:mb-8 md:mb-12">
            {t('whyChooseUs')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🚗</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                {t('widestSelection')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                {t('widestSelectionDesc')}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">💬</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                {t('directChat')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                {t('directChatDesc')}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🌍</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                {t('multiLanguage')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                {t('multiLanguageDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 md:mb-12 gap-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center sm:text-left">
              {t('featuredCars')}
            </h2>
            <Link
              to="/vanzari"
              className="text-blue-600 hover:text-blue-700 font-semibold text-base sm:text-lg flex items-center gap-2"
            >
              {t('viewAll')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
            {t('readyToStart')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 px-4">
            {t('joinThousands')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto px-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
            >
              {t('createAccount')}
            </Link>
            <Link
              to="/vanzari"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white text-base sm:text-lg font-semibold rounded-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200"
            >
              {t('browseCars')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
