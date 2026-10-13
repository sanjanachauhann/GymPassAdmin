import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/admin",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const loginAdmin = async (email, password) => {
  const { data } = await API.post("/login", {
    email,
    password,
  });

  return data;
};

export const getCurrentAdmin = async () => {
  const { data } = await API.get("/me");

  return data;
};

export const getApplications = async () => {
  const { data } = await API.get("/applications");

  return data;
};

export const approveApplication = async (id) => {
  const { data } = await API.put(`/applications/${id}/approve`);

  return data;
};

export const rejectApplication = async (id) => {
  const { data } = await API.put(`/applications/${id}/reject`);

  return data;
};

// ================================
// ADMIN MANAGEMENT
// ================================

export const getAdmins = async () => {
  const { data } = await API.get("/admins");

  return data;
};

export const createAdmin = async (adminData) => {
  const { data } = await API.post("/admins", adminData);

  return data;
};

export const deleteAdmin = async (id) => {
  const { data } = await API.delete(`/admins/${id}`);

  return data;
};

export const setupAdminPassword = async (token, password) => {
  const { data } = await API.post("/admins/setup-password", {
    token,
    password,
  });

  return data;
};

export const getGyms = async () => {
  const { data } = await API.get("/gyms");

  return data;
};
export const getPartners = async () => {
  const { data } = await API.get("/partners");

  return data;
};
export const getMembers = async () => {
  const { data } = await API.get("/members");
  return data;
};
export const getPasses = async () => {
  const { data } = await API.get("/passes");
  return data;
};
export const getPayments = async () => {
  const { data } = await API.get("/payments");
  return data;
};
