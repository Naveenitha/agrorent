import axiosInstance from "../api/axiosInstance";

export const createBooking = async (bookingData) => {
  const res = await axiosInstance.post("/bookings", bookingData);
  return res.data;
};

export const getMyBookings = async () => {
  const res = await axiosInstance.get("/bookings/mybookings");
  return res.data;
};

export const getOwnerBookings = async () => {
  const res = await axiosInstance.get("/bookings/owner");
  return res.data;
};

export const updateBookingStatus = async (id, status) => {
  const res = await axiosInstance.put(`/bookings/${id}/status`, { status });
  return res.data;
};