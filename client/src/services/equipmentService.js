import axiosInstance from "../api/axiosInstance";

export const getAvailableEquipments = async () => {
  const res = await axiosInstance.get("/equipments/available");
  return res.data;
};

export const getMyEquipments = async () => {
  const res = await axiosInstance.get("/equipments/myequipment");
  return res.data;
};

export const addEquipment = async (data) => {
  const res = await axiosInstance.post("/equipments", data);
  return res.data;
};

export const deleteEquipment = async (id) => {
  const res = await axiosInstance.delete(`/equipments/${id}`);
  return res.data;
};

export const getEquipmentById = async (id) => {
  const res = await axiosInstance.get(`/equipments/${id}`);
  return res.data;
};

export const updateEquipment = async (id, data) => {
  const res = await axiosInstance.put(`/equipments/${id}`, data);
  return res.data;
};
