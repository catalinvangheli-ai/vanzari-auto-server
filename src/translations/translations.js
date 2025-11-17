// Sistem de traduceri pentru aplicație
export const translations = {
  ro: {
    // Navigare
    home: "Acasă",
    carSales: "Vanzari Auto",
    carRentals: "Inchirieri Auto",
    addAd: "Adaugă anunț vânzare",
    myAds: "Anunturile mele",
    messages: "Mesagerie",
    login: "Login",
    register: "Register",
    logout: "Logout",
    profile: "Profil",
    
    // Formulare
    brand: "Marca",
    model: "Model",
    year: "An fabricație",
    price: "Preț",
    fuel: "Combustibil",
    transmission: "Transmisie",
    city: "Oraș",
    description: "Descriere",
    
    // Tipuri combustibil
    gasoline: "Benzină",
    diesel: "Motorină",
    hybrid: "Hibrid",
    electric: "Electric",
    
    // Transmisie
    manual: "Manual",
    automatic: "Automat",
    
    // Butoane
    search: "Caută",
    publish: "Publică",
    edit: "Editează",
    delete: "Șterge",
    save: "Salvează",
    cancel: "Anulează",
    
    // Mesaje
    loading: "Se încarcă...",
    noResults: "Nu au fost găsite rezultate",
    success: "Succes!",
    error: "Eroare!",
    you: "Tu"
  },
  
  hu: {
    // Navigare
    home: "Főoldal",
    carSales: "Autó Eladás",
    carRentals: "Autó Bérlés",
    addAd: "Hirdetés hozzáadása",
    myAds: "Hirdetéseim",
    messages: "Üzenetek",
    login: "Bejelentkezés",
    register: "Regisztráció",
    logout: "Kijelentkezés",
    profile: "Profil",
    
    // Formulare
    brand: "Márka",
    model: "Modell",
    year: "Gyártási év",
    price: "Ár",
    fuel: "Üzemanyag",
    transmission: "Váltó",
    city: "Város",
    description: "Leírás",
    
    // Tipuri combustibil
    gasoline: "Benzin",
    diesel: "Dízel",
    hybrid: "Hibrid",
    electric: "Elektromos",
    
    // Transmisie
    manual: "Kézi",
    automatic: "Automata",
    
    // Butoane
    search: "Keresés",
    publish: "Közzététel",
    edit: "Szerkesztés",
    delete: "Törlés",
    save: "Mentés",
    cancel: "Mégse",
    
    // Mesaje
    loading: "Betöltés...",
    noResults: "Nincs találat",
    success: "Sikeres!",
    error: "Hiba!",
    you: "Te"
  },
  
  en: {
    // Navigare
    home: "Home",
    carSales: "Car Sales",
    carRentals: "Car Rentals",
    addAd: "Add advertisement",
    myAds: "My Ads",
    messages: "Messages",
    login: "Login",
    register: "Register",
    logout: "Logout",
    profile: "Profile",
    
    // Formulare
    brand: "Brand",
    model: "Model",
    year: "Year",
    price: "Price",
    fuel: "Fuel",
    transmission: "Transmission",
    city: "City",
    description: "Description",
    
    // Tipuri combustibil
    gasoline: "Gasoline",
    diesel: "Diesel",
    hybrid: "Hybrid",
    electric: "Electric",
    
    // Transmisie
    manual: "Manual",
    automatic: "Automatic",
    
    // Butoane
    search: "Search",
    publish: "Publish",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    
    // Mesaje
    loading: "Loading...",
    noResults: "No results found",
    success: "Success!",
    error: "Error!",
    you: "You"
  },
  
  fr: {
    // Navigare
    home: "Accueil",
    carSales: "Ventes Auto",
    carRentals: "Location Auto",
    addAd: "Ajouter annonce",
    myAds: "Mes Annonces",
    messages: "Messages",
    login: "Connexion",
    register: "S'inscrire",
    logout: "Déconnexion",
    profile: "Profil",
    
    // Formulare
    brand: "Marque",
    model: "Modèle",
    year: "Année",
    price: "Prix",
    fuel: "Carburant",
    transmission: "Transmission",
    city: "Ville",
    description: "Description",
    
    // Tipuri combustibil
    gasoline: "Essence",
    diesel: "Diesel",
    hybrid: "Hybride",
    electric: "Électrique",
    
    // Transmisie
    manual: "Manuelle",
    automatic: "Automatique",
    
    // Butoane
    search: "Rechercher",
    publish: "Publier",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Sauvegarder",
    cancel: "Annuler",
    
    // Mesaje
    loading: "Chargement...",
    noResults: "Aucun résultat trouvé",
    success: "Succès!",
    error: "Erreur!",
    you: "Vous"
  }
};

export const getTranslation = (key, language = 'ro') => {
  return translations[language]?.[key] || translations.ro[key] || key;
};