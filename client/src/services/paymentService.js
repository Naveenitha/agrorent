import axiosInstance from "../api/axiosInstance";

// Create a Razorpay order
export const createRazorpayOrder = async (paymentData) => {
  const res = await axiosInstance.post("/payments/create-order", paymentData);
  return res.data;
};

// Verify payment and create booking
export const verifyPayment = async (paymentData) => {
  const res = await axiosInstance.post("/payments/verify", paymentData);
  return res.data;
};

// Get all payments for the logged-in user
export const getPayments = async () => {
  const res = await axiosInstance.get("/payments");
  return res.data;
};

// Load Razorpay checkout script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize Razorpay checkout
export const openRazorpayCheckout = (options) => {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error("Razorpay not loaded"));
      return;
    }
    const rzp = new window.Razorpay(options);
    rzp.on("payment.success", (response) => {
      resolve(response);
    });
    rzp.on("payment.failed", (response) => {
      reject(response);
    });
    rzp.open();
  });
};