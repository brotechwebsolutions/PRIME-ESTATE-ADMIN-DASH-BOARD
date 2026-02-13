
import axios from 'axios';
import { Flat } from '../types';

const API = "https://prime-estates-api.onrender.com/api/flats";

export const getFlats = async () => {
  const response = await axios.get<Flat[]>(API);
  return response.data;
};

export const createFlat = async (flat: Flat) => {
  const response = await axios.post<Flat>(API, flat);
  return response.data;
};

export const updateFlat = async (id: string, flat: Partial<Flat>) => {
  const response = await axios.put<Flat>(`${API}/${id}`, flat);
  return response.data;
};

export const deleteFlat = async (id: string) => {
  const response = await axios.delete(`${API}/${id}`);
  return response.data;
};
