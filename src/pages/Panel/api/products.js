import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Token ${token}`;
  return cfg;
});

// LISTA z wyszukiwaniem
export const listProducts = async (q) => {
  const { data } = await api.get("/api/products/manage/", { params: q ? { search: q } : {} });
  return Array.isArray(data) ? data : data.results ?? data.items ?? [];
};

// EDYCJA
export const patchProduct = (id, body) => api.patch(`/api/products/manage/${id}/`, body);

// USUWANIE
export const deleteProduct = (id) => api.delete(`/api/products/manage/${id}/`);

// DODAWANIE (multipart)
export const createProduct = (formData) =>
  api.post(`/api/products/manage/`, formData, { headers: { "Content-Type": "multipart/form-data" } });

// PROMOCJE
export const promoPercent = (id, percent) => api.post(`/api/products/manage/${id}/promotion/`, { percent: Number(percent) });
export const promoPrice   = (id, price)   => api.post(`/api/products/manage/${id}/promotion/`, { price: Number(price) });
export const promoClear   = (id)          => api.delete(`/api/products/manage/${id}/promotion/`);
