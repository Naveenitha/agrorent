import axiosInstance from "../api/axiosInstance";

export const getAvailableEquipments = async () => {
  const res = await axiosInstance.get("/equipment/available");
  return res.data;
};

export const getMyEquipments = async () => {
  const res = await axiosInstance.get("/equipment/myequipment");
  return res.data;
};

export const addEquipment = async (data) => {
  const res = await axiosInstance.post("/equipment", data);
  return res.data;
};

export const deleteEquipment = async (id) => {
  const res = await axiosInstance.delete(`/equipment/${id}`);
  return res.data;
};

export const getEquipmentById = async (id) => {
  const res = await axiosInstance.get(`/equipment/${id}`);
  return res.data;
};

export const updateEquipment = async (id, data) => {
  const res = await axiosInstance.put(`/equipment/${id}`, data);
  return res.data;
};