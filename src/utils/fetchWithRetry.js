// src/utils/fetchWithRetry.js
// Funcție globală pentru fetch cu timeout și retry pentru Railway cold start

export const fetchWithRetry = async (url, options = {}, config = {}) => {
  const {
    timeout = 60000, // 60 secunde - Railway poate fi FOARTE lent
    retries = 5, // 5 reîncercări = total 6 încercări
    retryDelay = 5000, // 5 secunde între reîncercări
  } = config;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      console.log(`🌐 [Încercarea ${attempt + 1}/${retries + 1}] Se conectează la:`, url);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log(`✅ Răspuns primit:`, response.status, response.statusText);
      return response;

    } catch (error) {
      clearTimeout(timeoutId);
      
      const isLastAttempt = attempt === retries;
      
      if (error.name === 'AbortError') {
        console.warn(`⏱️ Timeout la încercarea ${attempt + 1}/${retries + 1} (după ${timeout/1000}s)`);
        if (isLastAttempt) {
          throw new Error('Serverul nu răspunde după multiple încercări. Verifică conexiunea la internet.');
        }
      } else {
        console.warn(`❌ Eroare de rețea la încercarea ${attempt + 1}/${retries + 1}:`, error.message);
        if (isLastAttempt) {
          if (error.message?.includes('Failed to fetch')) {
            throw new Error('Nu se poate conecta la server. Verifică dacă ai internet activ.');
          }
          throw error;
        }
      }

      // Așteaptă înainte de următoarea încercare
      if (!isLastAttempt) {
        console.log(`⏳ Așteptare ${retryDelay/1000} secunde înainte de reîncercare...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
};
