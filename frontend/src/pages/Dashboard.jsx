import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Grid, Typography, Box, Button, Card, CardContent,
    Chip, Stack, IconButton, Fab, ToggleButton, ToggleButtonGroup,
    Skeleton, Avatar, useTheme, useMediaQuery, Paper
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import DonationForm from '../components/DonationForm';
import DonationMap from '../components/DonationMap';
import DonationDetails from '../components/DonationDetails';
import AddIcon from '@mui/icons-material/Add';
import GridViewIcon from '@mui/icons-material/GridView';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Dashboard = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [nearbyOnly, setNearbyOnly] = useState(false);
    const { user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchDonations = async (coords = null) => {
        setLoading(true);
        try {
            let url = 'http://localhost:5001/api/donations/';
            if (nearbyOnly) {
                const lat = coords?.latitude || 20.5937;
                const lon = coords?.longitude || 78.9629;
                url = `http://localhost:5001/api/donations/nearby?lat=${lat}&lon=${lon}&radius=50`;
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
            case 'urgent': return '#ef4444';
            case 'high': return '#f59e0b';
            case 'medium': return '#3b82f6';
            default: return '#10b981';
        }
    };

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 10 }}>
            {/* Header / Stats Bar */}
            <Box sx={{ bgcolor: 'white', borderBottom: '1px solid rgba(0,0,0,0.05)', py: 6, mb: 6 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="flex-end">
                        <Grid item xs={12} md={7}>
                            <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>COMMUNITY HUB</Typography>
                            <Typography variant="h2" sx={{ fontWeight: 900, mt: 1, mb: 1, letterSpacing: -1 }}>Active Needs</Typography>
                            <Typography variant="h6" color="text.secondary" fontWeight={400}>Hey {user?.fullName?.split(' ')[0] || 'Hero'}, here is what's happening in your area today.</Typography>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Stack direction="row" spacing={isMobile ? 1 : 2} justifyContent={isMobile ? 'flex-start' : 'flex-end'}>
                                <ToggleButtonGroup
                                    value={viewMode}
                                    exclusive
                                    onChange={(e, val) => val && setViewMode(val)}
                                    size="medium"
                                    sx={{ bgcolor: '#f1f5f9', p: 0.5, borderRadius: 3, '& .MuiToggleButton-root': { border: 'none', borderRadius: 2.5, px: 3 } }}
                                >
                                    <ToggleButton value="grid" sx={{ '&.Mui-selected': { bgcolor: 'white !important', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } }}>
                                        <GridViewIcon sx={{ mr: 1, fontSize: 20 }} /> Grid
                                    </ToggleButton>
                                    <ToggleButton value="map" sx={{ '&.Mui-selected': { bgcolor: 'white !important', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } }}>
                                        <MapIcon sx={{ mr: 1, fontSize: 20 }} /> Map
                                    </ToggleButton>
                                </ToggleButtonGroup>

                                <Button
                                    variant={nearbyOnly ? "contained" : "outlined"}
                                    onClick={() => setNearbyOnly(!nearbyOnly)}
                                    startIcon={<LocationOnIcon />}
                                    sx={{
                                        borderRadius: 3,
                                        px: 3,
                                        fontWeight: 700,
                                        borderWidth: 2,
                                        '&:hover': { borderWidth: 2 }
                                    }}
                                >
                                    Nearby
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <AnimatePresence>
                    {showForm && (
                        <Box component={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} sx={{ mb: 8 }}>
                            <Paper elevation={0} sx={{ p: 5, borderRadius: 8, border: '2px dashed rgba(255,107,107,0.3)', bgcolor: 'rgba(255,107,107,0.02)' }}>
                                <DonationForm onComplete={() => { setShowForm(false); fetchDonations(); }} />
                            </Paper>
                        </Box>
                    )}
                </AnimatePresence>

                {loading ? (
                    <Grid container spacing={4}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 8 }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : viewMode === 'map' ? (
                    <Box sx={{ height: 650, borderRadius: 10, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <DonationMap donations={donations} onSelect={setSelectedDonation} />
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {donations.length > 0 ? (
                            donations.map((donation, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={donation.id || idx}>
                                    <Card
                                        component={motion.div}
                                        whileHover={{ y: -10 }}
                                        layout
                                        sx={{
                                            height: '100%',
                                            borderRadius: 8,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            border: '1px solid rgba(0,0,0,0.05)',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                                            overflow: 'visible',
                                            position: 'relative'
                                        }}
                                    >
                                        <Box sx={{
                                            position: 'absolute',
                                            top: -12,
                                            left: 24,
                                            zIndex: 2,
                                            px: 2, py: 0.5,
                                            borderRadius: 2,
                                            bgcolor: getPriorityColor(donation.priority),
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            fontWeight: 900,
                                            textTransform: 'uppercase',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                        }}>
                                            {donation.priority || 'medium'}
                                        </Box>

                                        <CardContent sx={{ flexGrow: 1, p: 4, pt: 5 }}>
                                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1.5, letterSpacing: -0.5 }}>{donation.title}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                mb: 3,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                lineHeight: 1.6
                                            }}>
                                                {donation.description}
                                            </Typography>

                                            <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
                                                <Chip label={donation.category} size="small" sx={{ fontWeight: 700, bgcolor: '#f1f5f9' }} />
                                                <Chip label={`${donation.quantity} ${donation.unit}`} size="small" sx={{ fontWeight: 700, bgcolor: '#f1f5f9' }} />
                                            </Stack>

                                            <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid #f1f5f9' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.7rem' }}>📍</Avatar>
                                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>{donation.address}</Typography>
                                                </Box>

                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => setSelectedDonation(donation)}
                                                    sx={{
                                                        borderRadius: 3.5,
                                                        py: 1.5,
                                                        fontWeight: 900,
                                                        boxShadow: '0 10px 20px rgba(255,107,107,0.2)'
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Paper sx={{ py: 15, textAlign: 'center', borderRadius: 10, bgcolor: 'transparent', border: '2px dashed #cbd5e1' }}>
                                    <FilterListIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
                                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#64748b' }}>No donations found</Typography>
                                    <Typography variant="body1" color="text.secondary">Try adjusting your filters or checking back later.</Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                )}

                {user?.role === 'donor' && (
                    <Fab
                        color="primary"
                        aria-label="add"
                        onClick={() => setShowForm(!showForm)}
                        sx={{
                            position: 'fixed',
                            bottom: 40,
                            right: 40,
                            width: 76,
                            height: 76,
                            boxShadow: '0 20px 40px rgba(255,107,107,0.4)',
                            '&:hover': { transform: 'scale(1.1)' },
                            transition: '0.3s'
                        }}
                    >
                        {showForm ? <Typography variant="h4" fontWeight={900}>×</Typography> : <AddIcon sx={{ fontSize: 32 }} />}
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
        </Box>
    );
};

export default Dashboard;
