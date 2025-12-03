import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bugs';

const getAllBugreports  = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

const createBugreport = async (bugData) => {
  const response = await axios.post(API_URL, bugData);
  return response.data.data;
};
const getoneBugreport = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
};
const updateBugreport = async (id, bugData) => {
  const response = await axios.patch(`${API_URL}/${id}/status`, bugData);
  return response.data.data;
};

const deleteBugreport = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const bugService = {
  getAllBugreports,
  getoneBugreport,
  createBugreport,
  updateBugreport,
  deleteBugreport
};

export default bugService;