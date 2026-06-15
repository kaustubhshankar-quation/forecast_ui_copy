import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL; // Ensure you have this variable in your .env file

export const fetchMetrics = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard_metrics`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching metrics:", error);
    throw error;
  }
};