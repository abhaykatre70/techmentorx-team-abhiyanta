
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons not showing
// We use a CDN backup to ensure icons load even if local assets are missing
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = () => {
    const [position, setPosition] = useState([28.6139, 77.2090]); // Default to New Delhi
    const [markers, setMarkers] = useState([
        { id: 1, pos: [28.62, 77.21], title: 'NGO: Hope India', type: 'ngo' },
        { id: 2, pos: [28.61, 77.22], title: 'Active Task: Food Pickup', type: 'task' },
        { id: 3, pos: [28.60, 77.20], title: 'Volunteer: Rahul', type: 'volunteer' },
    ]);
    const [mapReady, setMapReady] = useState(false);

    // Track user location live
    useEffect(() => {
        setMapReady(true); // Delay map render slightly to ensure container exists
        if ("geolocation" in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude]);
                },
                (err) => console.log("Location Denied/Error", err),
                { enableHighAccuracy: true }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    if (!mapReady) return <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">Loading Map...</div>;

    return (
        <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%', borderRadius: '12px', zIndex: 10 }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Location */}
            <Marker position={position}>
                <Popup>
                    You are here! <br /> (Live Tracking Active)
                </Popup>
            </Marker>

            {/* Other Entities */}
            {markers.map(m => (
                <Marker key={m.id} position={m.pos}>
                    <Popup>
                        <b>{m.title}</b> <br />
                        Type: {m.type.toUpperCase()}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
