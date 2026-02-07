import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Chip, Stack, TextField, Alert, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DonationDetails = ({ donation, onClose, onRequestSent }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();

    const handleRequest = async () => {
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5001/api/volunteers/request', {
                donationId: donation.id,
                message: message
            });
            if (onRequestSent) onRequestSent();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={!!donation}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{ sx: { borderRadius: 6, p: 2 } }}
        >
            <DialogTitle sx={{ pr: 6 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{donation.title}</Typography>
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 16, top: 16 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip label={donation.category} color="primary" variant="outlined" sx={{ fontWeight: 700, textTransform: 'uppercase' }} />
                        <Chip label={donation.priority} color="warning" sx={{ fontWeight: 700, textTransform: 'uppercase' }} />
                    </Box>

                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                        {donation.description}
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 4 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Quantity</Typography>
                                <Typography variant="h6">{donation.quantity} {donation.unit}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 4 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Location</Typography>
                                <Typography variant="h6">📍 {donation.address}</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {user?.role === 'volunteer' && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Volunteer to help</Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Message for the donor (e.g. I can pick this up tomorrow at 10 AM)"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        </Box>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
                {user?.role === 'volunteer' && (
                    <Button
                        onClick={handleRequest}
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ px: 4 }}
                    >
                        {loading ? 'Sending...' : 'Request to Facilitate'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default DonationDetails;
