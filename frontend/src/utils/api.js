import axios from 'axios';

const API_BASE = '/api';

export const authAPI = {
  register: (data) => axios.post(`${API_BASE}/auth/register`, data),
  login: (data) => axios.post(`${API_BASE}/auth/login`, data),
  getMe: () => axios.get(`${API_BASE}/auth/me`),
};

export const incomeAPI = {
  getAll: () => axios.get(`${API_BASE}/income`),
  add: (data) => axios.post(`${API_BASE}/income`, data),
  delete: (id) => axios.delete(`${API_BASE}/income/${id}`),
  download: () => axios.get(`${API_BASE}/income/download/excel`, { responseType: 'blob' }),
};

export const expenseAPI = {
  getAll: () => axios.get(`${API_BASE}/expense`),
  add: (data) => axios.post(`${API_BASE}/expense`, data),
  delete: (id) => axios.delete(`${API_BASE}/expense/${id}`),
  download: () => axios.get(`${API_BASE}/expense/download/excel`, { responseType: 'blob' }),
};

export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
