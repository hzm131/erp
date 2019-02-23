import axios from 'axios'
import store from 'store'

const baseUrl = process.env.REACT_APP_API_ENDPOINT
if (!baseUrl) {
  throw new Error('REACT_APP_API_ENDPOINT env is not defined')
}

const api = axios.create({
  baseURL: baseUrl,
  timeout: 10000
});

const token = store.get('token');

if (token && token.access_token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token.access_token}`
}

api.login = async ({ grant_type = 'password', username, password }) => {
  let res;
  try {
    res = await api.post('/v1/users/login', {
      grant_type,
      username,
      password
    })
  } catch (err) {
    throw err.response.data
  }

  const token = res.data;
  store.set('token', token);

  api.defaults.headers.common['Authorization'] = `Bearer ${token.access_token}`;

  return res
};

api.extras = {};

window.api = api
window.store = store

export default api
