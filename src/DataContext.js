import React, { createContext, useState, useEffect } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [oferte, setOferte] = useState(() => {
    const saved = localStorage.getItem("oferte");
    return saved ? JSON.parse(saved) : [];
  });

  const [cereri, setCereri] = useState(() => {
    const saved = localStorage.getItem("cereri");
    return saved ? JSON.parse(saved) : [];
  });
    // 🔹 Adaugă funcțiile aici:
  const addOffer = (offer) => setOferte((prev) => [...prev, offer]);
  const addRequest = (request) => setCereri((prev) => [...prev, request]);

  // 🔹 Salvăm automat în localStorage când se schimbă ofertele
  useEffect(() => {
    localStorage.setItem("oferte", JSON.stringify(oferte));
  }, [oferte]);

  // 🔹 Salvăm automat în localStorage când se schimbă cererile
  useEffect(() => {
    localStorage.setItem("cereri", JSON.stringify(cereri));
  }, [cereri]);

  return (
    <DataContext.Provider value={{ oferte, setOferte, cereri, setCereri, addOffer, addRequest }}>
      {children}
    </DataContext.Provider>
  );
};
