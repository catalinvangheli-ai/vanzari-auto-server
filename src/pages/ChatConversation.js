import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { Capacitor } from '@capacitor/core';

// Componentă separată pentru conversația individuală (pentru mobil)
const ChatConversation = () => {
  const { isAuthenticated, username, email, user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Detectare platformă
  const isNativeMobile = Capacitor.isNativePlatform();
  
  const targetUser = searchParams.get('user');
  const listingId = searchParams.get('listing');
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [listingDetails, setListingDetails] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !targetUser) {
      navigate('/chat');
      return;
    }
    
    fetchMessages();
    if (listingId) {
      fetchListingDetails(listingId);
    }
    
    // Poll pentru mesaje noi
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [targetUser]);

  const fetchListingDetails = async (id) => {
    try {
      let response = await fetch(`${API_BASE_URL}/api/car-sales/${id}`);
      if (!response.ok) {
        response = await fetch(`${API_BASE_URL}/api/car-rentals/${id}`);
      }
      
      if (response.ok) {
        const data = await response.json();
        setListingDetails(data);
      }
    } catch (error) {
      console.error('Eroare încărcare anunț:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      // Adaugă listingId în query params pentru filtrare
      const url = listingId 
        ? `${API_BASE_URL}/messages/${username}/${targetUser}?listingId=${listingId}`
        : `${API_BASE_URL}/messages/${username}/${targetUser}`;
      
      console.log('📨 Fetch messages from:', url);
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Messages received:', data.length);
        setMessages(data);
      } else {
        console.error('❌ Error fetching messages:', response.status);
      }
    } catch (error) {
      console.error('❌ Eroare încărcare mesaje:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const messageData = {
        to: targetUser,
        text: newMessage,
        listingId: listingId || null,
        listingType: listingDetails ? (listingDetails.pretInchiriere ? 'inchirieri' : 'vanzari') : null
      };
      
      console.log('📤 Sending message:', messageData);
      
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        console.log('✅ Message sent successfully');
        setNewMessage('');
        fetchMessages();
      } else {
        console.error('❌ Error sending message:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('❌ Eroare trimitere mesaj:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div 
      className="flex flex-col bg-gray-50"
      style={{ 
        height: isNativeMobile ? 'calc(100vh - 100px)' : 'calc(100vh - 64px)',
        maxHeight: isNativeMobile ? 'calc(100vh - 100px)' : 'calc(100vh - 64px)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-3 bg-white border-b shadow-sm flex-shrink-0">
        <button
          onClick={() => navigate('/chat')}
          className="text-blue-600 hover:text-blue-800 font-medium text-lg"
        >
          ← 
        </button>
        <h2 className="font-semibold text-lg flex-1 truncate">
          💬 {targetUser}
        </h2>
      </div>

      {/* Anunț referință */}
      {listingDetails && (
        <div 
          onClick={() => {
            const type = listingDetails.pretInchiriere ? 'inchirieri' : 'vanzari';
            navigate(`/anunt/${type}/${listingDetails._id || listingDetails.id}`);
          }}
          className="mx-3 mt-3 mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer active:bg-blue-100 transition flex items-center gap-3 shadow-sm flex-shrink-0"
        >
          {(listingDetails.photos?.[0] || listingDetails.poze?.[0]) && (
            <img 
              src={listingDetails.photos?.[0] || listingDetails.poze?.[0]} 
              alt="Anunț"
              className="w-14 h-14 object-cover rounded flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-blue-600 font-semibold mb-1">
              📋 Anunț - Apasă pentru detalii
            </div>
            <div className="font-medium text-gray-800 truncate">
              {listingDetails.marca} {listingDetails.model}
            </div>
            <div className="text-sm text-gray-600">
              {listingDetails.pretInchiriere 
                ? `${listingDetails.pretInchiriere}€/zi`
                : `${listingDetails.pret}€`
              }
            </div>
          </div>
        </div>
      )}

      {/* Mesaje - DOAR această zonă scrollable */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-3" 
        style={{ 
          minHeight: 0,
          maxHeight: '100%',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="font-medium text-lg">Nicio conversație încă</p>
            <p className="text-sm mt-2">Trimite primul mesaj</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => {
              // Compară username-ul curent cu cel din mesaj
              const isMyMessage = message.from === username;
              const showName = index === 0 || messages[index - 1].from !== message.from;
              
              console.log('Message:', { from: message.from, username, isMyMessage });
              
              return (
                <div key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                    {showName && (
                      <div className={`text-xs font-medium mb-1 px-2 ${
                        isMyMessage ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {isMyMessage ? 'Tu' : message.from}
                      </div>
                    )}
                    <div className={`px-4 py-3 rounded-2xl shadow ${
                      isMyMessage 
                        ? 'bg-blue-600 text-white rounded-br-sm' 
                        : 'bg-white text-gray-800 rounded-bl-sm'
                    }`}>
                      <div className="break-words whitespace-pre-wrap text-sm">{message.text}</div>
                      <div className={`text-xs mt-1 ${
                        isMyMessage ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.date).toLocaleTimeString('ro-RO', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form trimitere - FIX la bază, DEASUPRA butoanelor virtuale */}
      <form 
        onSubmit={sendMessage} 
        className="bg-white border-t flex-shrink-0" 
        style={{ 
          padding: '12px',
          paddingBottom: '12px'
        }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Scrie un mesaj..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? '...' : '📤'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatConversation;
