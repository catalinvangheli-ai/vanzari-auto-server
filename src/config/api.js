// Configurare pentru URL-ul backend-ului
// Pentru dezvoltare locală (browser): http://localhost:3001
// Pentru aplicația Android: folosește serverul Railway în cloud

const isDevelopment = false; // Folosește Railway pentru production

// URL-ul serverului - Railway pentru production
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3001' 
  : 'https://web-production-9d359.up.railway.app';

console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🏠 Is Development:', isDevelopment);
console.log('🔍 Window location:', window.location.hostname);
console.log('📱 User Agent:', navigator.userAgent);

// Helper pentru debug network
export const testConnection = async () => {
  try {
    console.log('🧪 Testing connection to:', API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ Connection test success:', response.status);
    const data = await response.json();
    console.log('📊 Health data:', data);
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
};