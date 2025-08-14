import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.salla.dev/admin',
  timeout: 10000
});

// Placeholder functions: replace with real OAuth/token handling when ready.
export async function getProducts({ accessToken, page = 1 }) {
  // The real call would be:
  // return api.get('/v2/products', { headers: { Authorization: `Bearer ${accessToken}` }, params: { page } });
  return { data: { data: [] } };
}
