import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import StarIcon from '@mui/icons-material/Star';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Profile = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const endpoint = user?.role === 'donor'
                    ? 'http://localhost:5000/api/volunteers/incoming-requests'
                    : 'http://localhost:5000/api/volunteers/my-requests';

                const res = await axios.get(endpoint);
                setRequests(res.data.requests);
            } catch (err) {
                console.error('Failed to fetch profile data', err);
            }
        };
        if (user) fetchData();
    }, [user]);

    const statCards = [
        { icon: <StarIcon sx={{ fontSize: 40, color: 'primary.main' }} />, value: user?.points || 0, label: 'Community Points' },
        { icon: <VolunteerActivismIcon sx={{ fontSize: 40, color: 'secondary.main' }} />, value: requests.length, label: user?.role === 'donor' ? 'Incoming Requests' : 'Requests Sent' },
        { icon: <EmojiEventsIcon sx={{ fontSize: 40, color: 'success.main' }} />, value: 'Level 1', label: 'Impact Rank' },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>My Impact</Typography>
                <Typography variant="h6" color="text.secondary">Welcome back, {user?.fullName || user?.email}</Typography>
            </Box>

            <Grid container spacing={4} sx={{ mb: 8 }}>
                {statCards.map((card, idx) => (
                    <Grid item xs={12} md={4} key={idx}>
                        <Paper component={motion.div} whileHover={{ y: -5 }} sx={{ p: 4, textAlign: 'center', borderRadius: 6 }}>
                            <Box sx={{ mb: 2 }}>{card.icon}</Box>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>{card.value}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                                {card.label}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Recent Activity</Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 6, overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>DATE</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>STATUS</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>MESSAGE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.length > 0 ? (
                            requests.map((req) => (
                                <TableRow key={req.id} hover>
                                    <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={req.status}
                                            size="small"
                                            color={req.status === 'pending' ? 'warning' : req.status === 'accepted' ? 'success' : 'default'}
                                            sx={{ fontWeight: 700, textTransform: 'uppercase' }}
                                        />
                                    </TableCell>
                                    <TableCell color="text.secondary">{req.message || 'No message provided'}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 10, color: 'text.secondary', fontStyle: 'italic' }}>
                                    No recent activity found. Start participating today!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Profile;
