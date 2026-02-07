import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, Box, Button, Card, CardContent, Chip, Stack, IconButton, Fab, ToggleButton, ToggleButtonGroup, Skeleton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import DonationForm from '../components/DonationForm';
import DonationMap from '../components/DonationMap';
import DonationDetails from '../components/DonationDetails';
import AddIcon from '@mui/icons-material/Add';
import GridViewIcon from '@mui/icons-material/GridView';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Dashboard = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [nearbyOnly, setNearbyOnly] = useState(false);
    const { user } = useAuth();

    const fetchDonations = async (coords = null) => {
        setLoading(true);
        try {
            let url = 'http://localhost:5000/api/donations/';
            if (nearbyOnly) {
                const lat = coords?.latitude || 20.5937;
                const lon = coords?.longitude || 78.9629;
                url = `http://localhost:5000/api/donations/nearby?lat=${lat}&lon=${lon}&radius=50`;
            }
            const res = await axios.get(url);
            setDonations(res.data.donations);
        } catch (err) {
            console.error('Failed to fetch donations', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (nearbyOnly) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => fetchDonations(position.coords),
                    (error) => {
                        console.warn("Geolocation denied, using default coords");
                        fetchDonations();
                    }
                );
            } else {
                fetchDonations();
            }
        } else {
            fetchDonations();
        }
    }, [nearbyOnly]);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'error';
            case 'high': return 'warning';
            case 'medium': return 'info';
            default: return 'success';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6, flexWrap: 'wrap', gap: 3 }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' } }}>Community Feed</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 400 }}>Discover and facilitate donations in your community.</Typography>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(e, val) => val && setViewMode(val)}
                        size="small"
                        sx={{ bgcolor: 'white' }}
                    >
                        <ToggleButton value="grid"><GridViewIcon sx={{ mr: 1 }} /> Grid</ToggleButton>
                        <ToggleButton value="map"><MapIcon sx={{ mr: 1 }} /> Map</ToggleButton>
                    </ToggleButtonGroup>

                    <Button
                        variant={nearbyOnly ? "contained" : "outlined"}
                        onClick={() => setNearbyOnly(!nearbyOnly)}
                        startIcon={<LocationOnIcon />}
                        sx={{ borderRadius: 3 }}
                    >
                        Nearby Only
                    </Button>
                </Stack>
            </Box>

            <AnimatePresence>
                {showForm && (
                    <Box component={motion.div} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} sx={{ mb: 6 }}>
                        <Card sx={{ p: 4, borderRadius: 6, border: '2px solid rgba(255,107,107,0.1)' }}>
                            <DonationForm onComplete={() => { setShowForm(false); fetchDonations(); }} />
                        </Card>
                    </Box>
                )}
            </AnimatePresence>

            {loading ? (
                <Grid container spacing={4}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Grid item xs={12} md={4} key={i}>
                            <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 6 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : viewMode === 'map' ? (
                <Box sx={{ height: 600, borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                    <DonationMap donations={donations} onSelect={setSelectedDonation} />
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {donations.length > 0 ? (
                        donations.map((donation, idx) => (
                            <Grid item xs={12} md={4} key={donation.id || idx}>
                                <Card
                                    component={motion.div}
                                    whileHover={{ y: -8 }}
                                    sx={{ height: '100%', borderRadius: 6, display: 'flex', flexDirection: 'column' }}
                                >
                                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Chip
                                                label={donation.priority || 'medium'}
                                                color={getPriorityColor(donation.priority)}
                                                size="small"
                                                sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(donation.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>

                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{donation.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineClamp: 3 }}>
                                            {donation.description}
                                        </Typography>

                                        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                                            <Chip label={donation.category} size="small" variant="outlined" />
                                            <Chip label={`${donation.quantity} ${donation.unit}`} size="small" variant="outlined" />
                                        </Stack>

                                        <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <LocationOnIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                                <Typography variant="caption" sx={{ fontWeight: 600 }}>{donation.address}</Typography>
                                            </Stack>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => setSelectedDonation(donation)}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                Details
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12} sx={{ py: 15, textAlign: 'center' }}>
                            <Typography variant="h4" color="text.secondary" sx={{ opacity: 0.3 }}>No donations found.</Typography>
                        </Grid>
                    )}
                </Grid>
            )}

            {user?.role === 'donor' && (
                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={() => setShowForm(!showForm)}
                    sx={{ position: 'fixed', bottom: 32, right: 32, width: 70, height: 70 }}
                >
                    {showForm ? '×' : <AddIcon />}
                </Fab>
            )}

            {selectedDonation && (
                <DonationDetails
                    donation={selectedDonation}
                    onClose={() => setSelectedDonation(null)}
                    onRequestSent={() => {
                        fetchDonations();
                        setSelectedDonation(null);
                    }}
                />
            )}
        </Container>
    );
};

export default Dashboard;
