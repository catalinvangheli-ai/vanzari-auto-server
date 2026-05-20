const normalizeBaseUrl = (value) => value.replace(/\/+$/, '');

const envApiBaseUrl = normalizeBaseUrl((process.env.REACT_APP_API_BASE_URL || '').trim());
const isBrowser = typeof window !== 'undefined';
const isDevelopment = process.env.NODE_ENV === 'development';
const browserHostname = isBrowser ? window.location.hostname : '';
const browserOrigin = isBrowser ? window.location.origin : '';
const isHttpOrigin = /^https?:\/\//i.test(browserOrigin);
const sameOriginApiBaseUrl = isHttpOrigin ? normalizeBaseUrl(browserOrigin) : '';
const isNativeRuntime = isBrowser ? Boolean(window.Capacitor?.isNativePlatform?.()) : false;
const shouldUseSameOrigin = !isDevelopment && isHttpOrigin && !['localhost', '127.0.0.1'].includes(browserHostname);

export const API_BASE_URL = envApiBaseUrl || (isDevelopment ? 'http://localhost:3001' : shouldUseSameOrigin ? sameOriginApiBaseUrl : '');

if (!API_BASE_URL) {
  console.error('❌ API_BASE_URL lipsește. Configurează REACT_APP_API_BASE_URL pentru build-urile mobile sau folosește hosting pe același domeniu pentru web.');
}

if (isNativeRuntime && !envApiBaseUrl) {
  console.error('❌ Aplicația rulează nativ, dar REACT_APP_API_BASE_URL nu este setat. Request-urile către backend vor eșua.');
}

console.log('🌐 API Base URL:', API_BASE_URL || '(same-origin sau lipsă configurare)');
console.log('🏠 Is Development:', isDevelopment);
console.log('🔍 Window location:', isBrowser ? browserHostname : 'n/a');
console.log('📱 User Agent:', typeof navigator !== 'undefined' ? navigator.userAgent : 'n/a');

// Helper pentru debug network
export const testConnection = async () => {
  try {
    if (!API_BASE_URL) {
      console.error('❌ Nu pot testa conexiunea fără API_BASE_URL configurat');
      return false;
    }

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