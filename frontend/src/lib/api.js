const API_URL = 'http://localhost:3000/api';

async function fetchJSON(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'An error occurred');
  return data;
}

export function login(username, password) {
  return fetchJSON(`${API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function signup(username, password) {
  return fetchJSON(`${API_URL}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function getAuctions() {
  return fetchJSON(`${API_URL}/auctions`);
}

export function getAuction(id) {
  return fetchJSON(`${API_URL}/auctions/${id}`);
}

export function placeBid(auctionId, amount) {
  const token = localStorage.getItem('token');
  return fetchJSON(`${API_URL}/auctions/${auctionId}/bid`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ amount }),
  });
}

export function createAuction(formData) {
  const token = localStorage.getItem('token');
  return fetch(`${API_URL}/auctions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  }).then(response => {
    if (!response.ok) throw new Error('Failed to create auction');
    return response.json();
  });
}

export function getMyAuctions() {
  const token = localStorage.getItem('token');
  return fetchJSON(`${API_URL}/auctions/my-auctions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function closeAuction(auctionId) {
  const token = localStorage.getItem('token');
  return fetchJSON(`${API_URL}/auctions/${auctionId}/close`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}
