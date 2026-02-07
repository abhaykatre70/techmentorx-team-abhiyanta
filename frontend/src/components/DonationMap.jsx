import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { Box, Typography, Button, Paper } from '@mui/material';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DonationMap = ({ donations, onSelect }) => {
    // Center of India or user location
    const defaultCenter = [20.5937, 78.9629];

    // Attempt to center on the first donation with coordinates
    const firstDonationWithCoords = donations.find(d => d.location?.coordinates);
    const mapCenter = firstDonationWithCoords
        ? [firstDonationWithCoords.location.coordinates[1], firstDonationWithCoords.location.coordinates[0]]
        : defaultCenter;

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            sx={{ height: '100%', width: '100%', position: 'relative' }}
        >
            <MapContainer
                center={mapCenter}
                zoom={firstDonationWithCoords ? 13 : 5}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {donations.map((donation) => {
                    const coords = donation.location?.coordinates;
                    if (!coords || coords.length < 2) return null;
                    const pos = [coords[1], coords[0]];

                    return (
                        <Marker key={donation.id} position={pos}>
                            <Popup PaperProps={{ sx: { p: 0, borderRadius: 4, overflow: 'hidden' } }}>
                                <Box sx={{ p: 1, minWidth: 150 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'primary.main' }}>
                                        {donation.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                                        {donation.category} • {donation.priority}
                                    </Typography>
                                    <Button
                                        fullWidth
                                        size="small"
                                        variant="contained"
                                        onClick={() => onSelect && onSelect(donation)}
                                        sx={{ borderRadius: 2, fontSize: '0.7rem' }}
                                    >
                                        View Details
                                    </Button>
                                </Box>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </Box>
    );
};

export default DonationMap;
