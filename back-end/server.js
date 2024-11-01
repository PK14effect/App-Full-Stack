const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/helpdesk", {
});

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  contactInfo: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Resolved", "Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

app.get("/tickets", async (req, res) => {
  const tickets = await Ticket.find();
  res.json(tickets);
});

app.post("/tickets", async (req, res) => {
  const ticket = new Ticket(req.body);
  await ticket.save();
  res.json(ticket);
});

app.put("/tickets/:id", async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ticket);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

