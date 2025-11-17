import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';

function UserList() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ role: '', skill: '', username: '' });

  useEffect(() => {
    const { role, skill, username } = filters;
    let query = `${API_BASE_URL}/users`;
    if (role || skill || username) {
      query += `?${new URLSearchParams(filters)}`;
    }
    fetch(query)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  return (
    <div>
      <h2>Utilizatori înregistrați</h2>
      <div>
        <input
          type="text"
          name="username"
          placeholder="Filtrează după username"
          value={filters.username}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="role"
          placeholder="Filtrează după rol"
          value={filters.role}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="skill"
          placeholder="Filtrează după competențe"
          value={filters.skill}
          onChange={handleFilterChange}
        />
      </div>
      <ul>
        {users.map(user => (
          <li key={user.username}>
            <img src={`${API_BASE_URL}${user.photo}`} alt="" width={40} style={{borderRadius: '50%'}} />
            <b>{user.fullName || user.username}</b> ({user.role})
            <br />
            <span>Competențe: {user.skills && user.skills.join(', ')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
