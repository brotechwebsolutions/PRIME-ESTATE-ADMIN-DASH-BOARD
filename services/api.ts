
import axios from 'axios';
import { Flat } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getFlats = async () => {
  const response = await api.get<Flat[]>('/flats');
  return response.data;
};

export const createFlat = async (flat: Flat) => {
  const response = await api.post<Flat>('/flats', flat);
  return response.data;
};

export const updateFlat = async (id: string, flat: Partial<Flat>) => {
  const response = await api.put<Flat>(`/flats/${id}`, flat);
  return response.data;
};

export const deleteFlat = async (id: string) => {
  const response = await api.delete(`/flats/${id}`);
  return response.data;
};
