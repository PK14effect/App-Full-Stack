import axios from "axios";

const API_URL = "http://localhost:5000/tickets";

export const fetchTickets = () => axios.get(API_URL);
export const createTicket = (data) => axios.post(API_URL, data);
export const updateTicket = (id, data) => axios.put(`${API_URL}/${id}`, data);
