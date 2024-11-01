import React, { useState, useEffect } from "react";
import { fetchTickets, createTicket, updateTicket } from "../services/ticketservices";
import {
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [newTicket, setNewTicket] = useState({ title: "", description: "", contactInfo: "" });
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortOption, setSortOption] = useState("latestUpdate");

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        const response = await fetchTickets();
        setTickets(response.data);
    };

    const handleCreateTicket = async () => {
        if (newTicket.title && newTicket.description && newTicket.contactInfo) {
            const timestamp = new Date().toISOString();
            await createTicket({
                ...newTicket,
                status: "Pending",
                createdAt: timestamp,
                updatedAt: timestamp,
            });
            loadTickets();
            setNewTicket({ title: "", description: "", contactInfo: "" });
        }
    };

    const handleUpdateTicket = async (id, newStatus) => {
        const updatedTimestamp = new Date().toISOString();
        await updateTicket(id, { status: newStatus, updatedAt: updatedTimestamp });
        loadTickets();
    };

    const filteredAndSortedTickets = tickets
        .filter((ticket) => (statusFilter === "All" ? true : ticket.status === statusFilter))
        .sort((a, b) => {
            if (sortOption === "latestUpdate") {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            }
            return a.status.localeCompare(b.status);
        });

    return (
        <Box>
            <Typography variant="h6">Create New Ticket</Typography>
            <TextField
                label="Title"
                fullWidth
                margin="normal"
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
            />
            <TextField
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
            />
            <TextField
                label="Contact Info"
                fullWidth
                margin="normal"
                value={newTicket.contactInfo}
                onChange={(e) => setNewTicket({ ...newTicket, contactInfo: e.target.value })}
            />
            <Button variant="contained" color="primary" onClick={handleCreateTicket}>
                Create Ticket
            </Button>

            <Typography variant="h6" marginTop={4}>
                Filter and Sort Tickets
            </Typography>
            <FormControl fullWidth margin="normal">
                <InputLabel>Status Filter</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Accepted">Accepted</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Sort By</InputLabel>
                <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <MenuItem value="latestUpdate">Latest Update</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                </Select>
            </FormControl>

            <Typography variant="h6" marginTop={4}>
                Existing Tickets
            </Typography>
            {filteredAndSortedTickets.map((ticket) => (
                <Card key={ticket._id} variant="outlined" style={{ marginTop: "16px" }}>
                    <CardContent>
                        <Typography variant="h5">{ticket.title}</Typography>
                        <Typography variant="body2">{ticket.description}</Typography>
                        <Typography variant="body2" color="textSecondary">{`Contact: ${ticket.contactInfo}`}</Typography>
                        <Typography variant="body2" color="textSecondary">{`Status: ${ticket.status}`}</Typography>
                        <Typography variant="body2" color="textSecondary">{`Created timestamp: ${new Date(
                            ticket.createdAt
                        ).toLocaleString()}`}</Typography>
                        <Typography variant="body2" color="textSecondary">{`Latest ticket update timestamp: ${new Date(
                            ticket.updatedAt
                        ).toLocaleString()}`}</Typography>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Update Status</InputLabel>
                            <Select
                                value={ticket.status}
                                onChange={(e) => handleUpdateTicket(ticket._id, e.target.value)}
                            >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Accepted">Accepted</MenuItem>
                                <MenuItem value="Resolved">Resolved</MenuItem>
                                <MenuItem value="Rejected">Rejected</MenuItem>
                            </Select>
                        </FormControl>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default Tickets;
