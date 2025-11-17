import React, { useEffect, useState } from "react";

function Lista() {
  const [oferte, setOferte] = useState([]);
  const [cereri, setCereri] = useState([]);
  const [searchOffer, setSearchOffer] = useState("");
  const [searchRequest, setSearchRequest] = useState("");
  const [editOffer, setEditOffer] = useState(null);
  const [editRequest, setEditRequest] = useState(null);

  useEffect(() => {
    // Ia ofertele din backend
    fetch("http://localhost:4000/offers")
      .then(res => res.json())
      .then(data => setOferte(data));

    // Ia cererile din backend
    fetch("http://localhost:4000/requests")
      .then(res => res.json())
      .then(data => setCereri(data));
  }, []);

  const handleDeleteOffer = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:4000/offers/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (res.ok) {
      setOferte(oferte.filter(o => o._id !== id));
    }
  };

  const handleDeleteRequest = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:4000/requests/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (res.ok) {
      setCereri(cereri.filter(c => c._id !== id));
    }
  };

  const handleEditOffer = (offer) => {
    // Logica pentru editarea ofertei
    console.log("Editează oferta:", offer);
  };

  const handleEditRequest = (request) => {
    // Logica pentru editarea cererii
    console.log("Editează cererea:", request);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Listă generală</h1>

      {/* Secțiunea Oferte */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Oferte de servicii</h2>
        <input
          type="text"
          placeholder="Cauta oferta..."
          value={searchOffer}
          onChange={e => setSearchOffer(e.target.value)}
          className="border p-2 rounded mb-4"
        />
        <button className="bg-yellow-300 text-black font-bold p-2 rounded">
  Caută oferte servicii
</button>
        {oferte.length === 0 ? (
          <p>Momentan nu există oferte.</p>
        ) : (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {oferte
              .filter(o =>
                o.service.toLowerCase().includes(searchOffer.toLowerCase())
              )
              .map((o, index) => (
                <li key={o._id || index} style={{ marginBottom: 24, borderBottom: "1px solid #ccc", paddingBottom: 8 }}>
                  <b>{o.nume}</b>
                  <div><strong>Serviciu:</strong> {o.service}</div>
                  <div><strong>Email:</strong> {o.email}</div>
                  <div style={{ color: "black" }}><strong>Telefon:</strong> {o.telefon}</div>
                  <div style={{ marginTop: 12 }}>
                    <a href={`/profil/${o.nume}`} style={{ color: "blue" }}>
                      Vezi profilul persoanei
                    </a>
                  </div>
                </li>
              ))}
          </ul>
        )}
        {editOffer && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const token = localStorage.getItem("token");
              const res = await fetch(`http://localhost:4000/offers/${editOffer._id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + token
                },
                body: JSON.stringify(editOffer)
              });
              if (res.ok) {
                setOferte(oferte.map(o => o._id === editOffer._id ? editOffer : o));
                setEditOffer(null);
              }
            }}
            className="mb-4"
          >
            <input
              type="text"
              value={editOffer.nume}
              onChange={e => setEditOffer({ ...editOffer, nume: e.target.value })}
              className="p-2 border rounded mr-2"
            />
            <input
              type="text"
              value={editOffer.service}
              onChange={e => setEditOffer({ ...editOffer, service: e.target.value })}
              className="p-2 border rounded mr-2"
            />
            <input
              type="email"
              value={editOffer.email}
              onChange={e => setEditOffer({ ...editOffer, email: e.target.value })}
              className="p-2 border rounded mr-2"
            />
            <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded">Salvează</button>
            <button type="button" className="ml-2 bg-gray-400 text-white px-2 py-1 rounded" onClick={() => setEditOffer(null)}>Anulează</button>
          </form>
        )}
      </div>

      {/* Secțiunea Cereri */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Cereri de ajutor</h2>
        <input
          type="text"
          placeholder="Cauta cerere..."
          value={searchRequest}
          onChange={e => setSearchRequest(e.target.value)}
          className="border p-2 rounded mb-4"
        />
        <button className="bg-yellow-300 text-black font-bold p-2 rounded">
  Caută cereri ajutor
</button>
        {cereri.length === 0 ? (
          <p>Momentan nu există cereri.</p>
        ) : (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {cereri
              .filter(c =>
                c.need.toLowerCase().includes(searchRequest.toLowerCase())
              )
              
              .map((c, index) => (
                <li key={index} style={{ marginBottom: 24, borderBottom: "1px solid #ccc", paddingBottom: 8 }}>
                  <b>{c.nume}</b>
                  <div><strong>Serviciu:</strong> {c.need}</div>
                  <div><strong>Email:</strong> {c.email}</div>
                  <div style={{ color: "black" }}><strong>Telefon:</strong> {c.telefon}</div>
                  <div style={{ marginTop: 16 }}>
                    <button
          className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => handleDeleteRequest(c._id)}
        >
          Șterge
        </button>
        <button
          className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded"
          onClick={() => handleEditRequest(c)}
        >
          Editează
        </button>
                  </div>
                </li>
                
              ))}
          </ul>
        )}
        {editRequest && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const token = localStorage.getItem("token");
              const res = await fetch(`http://localhost:4000/requests/${editRequest._id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + token
                },
                body: JSON.stringify(editRequest)
              });
              if (res.ok) {
                setCereri(cereri.map(c => c._id === editRequest._id ? editRequest : c));
                setEditRequest(null);
              }
            }}
            className="mb-4"
          >
            <input
              type="text"
              value={editRequest.nume}
              onChange={e => setEditRequest({ ...editRequest, nume: e.target.value })}
              className="p-2 border rounded mr-2"
            />
            <input
              type="text"
              value={editRequest.need}
              onChange={e => setEditRequest({ ...editRequest, need: e.target.value })}
              className="p-2 border rounded mr-2"
            />
            <input
              type="email"
              value={editRequest.email}
              onChange={e => setEditRequest({ ...editRequest, email: e.target.value })}
              className="p-2 border rounded mr-2"
            />
            <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded">Salvează</button>
            <button type="button" className="ml-2 bg-gray-400 text-white px-2 py-1 rounded" onClick={() => setEditRequest(null)}>Anulează</button>
          </form>
        )}
      </div>
     
    </div>
  );
}

export default Lista;