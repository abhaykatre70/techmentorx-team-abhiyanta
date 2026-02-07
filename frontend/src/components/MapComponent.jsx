import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '12px'
};

const center = {
    lat: 28.6139, // Default to New Delhi
    lng: 77.2090
};

const MapComponent = () => {
    const [map, setMap] = useState(null);

    const onLoad = React.useCallback(function callback(map) {
        // const bounds = new window.google.maps.LatLngBounds(center);
        // map.fitBounds(bounds);
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    // Use a dummy key or environment variable. 
    // For dev without billing, it might show "For Development Purposes Only"
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
            >
                { /* Child components, such as markers, info windows, etc. */}
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
}

export default React.memo(MapComponent);
