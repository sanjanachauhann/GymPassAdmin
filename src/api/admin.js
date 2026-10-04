import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/admin",
});

export const getApplications = async () => {
  const { data } = await API.get("/applications");

  console.log("data is ", data);
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
