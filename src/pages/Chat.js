import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const Chat = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  
  const targetUser = searchParams.get('user');
  const listingId = searchParams.get('listing');

  useEffect(() => {
    if (!isAuthenticated) return;
    if (targetUser) {
      navigate('/chat-conversation?user=' + targetUser + (listingId ? '&listing=' + listingId : ''));
      return;
    }
    fetchConversations();
  }, [isAuthenticated, targetUser, listingId, navigate]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_BASE_URL + '/api/my-conversations', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (response.ok) {
        const data = await response.json();
        const conversationsWithListings = await Promise.all(
          data.map(async (conv) => {
            if (conv.listingId && conv.listingType) {
              try {
                const endpoint = conv.listingType === 'vanzari' ? 'car-sales' : 'car-rentals';
                const listingRes = await fetch(API_BASE_URL + '/api/' + endpoint + '/' + conv.listingId);
                if (listingRes.ok) {
                  const listing = await listingRes.json();
                  return { ...conv, listing };
                }
              } catch (err) {
                console.error('Eroare anunt:', err);
              }
            }
            return conv;
          })
        );
        setConversations(conversationsWithListings);
      }
    } catch (error) {
      console.error('Eroare conversatii:', error);
    }
  };

  const handleConversationClick = (conv) => {
    navigate('/chat-conversation?user=' + conv.otherUser + (conv.listingId ? '&listing=' + conv.listingId : ''));
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Autentificare necesara</h2>
        <p className="text-gray-600 mb-6">Trebuie sa te loghezi pentru a vedea mesajele.</p>
        <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Du-te la Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800"> Mesajele mele</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <div className="text-6xl mb-4"></div>
            <p className="text-lg font-medium">Nicio conversatie inca</p>
            <p className="text-sm mt-2">Conversatiile tale vor aparea aici</p>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((conv, index) => (
              <div key={index} onClick={() => handleConversationClick(conv)} className="p-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition">
                <div className="flex items-center gap-3">
                  {(conv.listing?.photos?.[0] || conv.listing?.poze?.[0]) && (
                    <img src={conv.listing.photos?.[0] || conv.listing.poze?.[0]} alt="Anunt" className="w-16 h-16 object-cover rounded flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">{conv.otherUser}</div>
                    {conv.listing && (
                      <div className="text-sm text-blue-600 font-medium truncate"> {conv.listing.marca} {conv.listing.model}</div>
                    )}
                    <div className="text-sm text-gray-600 truncate mt-1">{conv.lastMessage}</div>
                  </div>
                  <div className="text-gray-400 text-xl"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
