import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';

function ProfilePhotoUpload({ token, onUpload }) {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);

    await fetch(`${API_BASE_URL}/profile/photo`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: formData
    });
    // Poți da refresh la profil sau să refaci fetch-ul userului
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleChange} />
      <button type="submit">Încarcă poză profil</button>
    </form>
  );
}

export default ProfilePhotoUpload;