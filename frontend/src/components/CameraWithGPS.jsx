// Camera Component with GPS Location Capture
import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, X, Check, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CameraWithGPS = ({ onCapture, onClose }) => {
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(true);
    const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        startCamera();
        getLocation();
        return () => {
            stopCamera();
        };
    }, [facingMode]);

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const startCamera = async () => {
        stopCamera();
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error('Camera error:', error);
            toast.error('Could not access camera. Please check permissions.');
        }
    };

    const flipCamera = () => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    };

    const getLocation = async () => {
        setLocationLoading(true);
        if (!navigator.geolocation) {
            toast.error('Geolocation not supported');
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Reverse geocoding to get address
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    setLocation({
                        latitude,
                        longitude,
                        address: data.display_name || 'Address not found',
                        city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
                        state: data.address?.state || 'Unknown',
                        pincode: data.address?.postcode || '',
                        timestamp: new Date().toISOString()
                    });
                    toast.success('Location captured!');
                } catch (error) {
                    console.error('Geocoding error:', error);
                    setLocation({
                        latitude,
                        longitude,
                        address: 'Address lookup failed',
                        city: 'Unknown',
                        state: 'Unknown',
                        pincode: '',
                        timestamp: new Date().toISOString()
                    });
                }
                setLocationLoading(false);
            },
            (error) => {
                console.error('Location error:', error);
                toast.error('Could not get location. Ensure GPS is on.');
                setLocationLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Ensure video dimensions are available
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            toast.error("Camera not ready yet");
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');

        // Flip properly if user facing
        if (facingMode === 'user') {
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        toast.success('Photo captured!');
    };

    const handleSubmit = () => {
        if (!capturedImage) {
            toast.error('Please capture a photo first');
            return;
        }

        // Allow submission even if location failed, but warn
        if (!location && locationLoading) {
            toast.error('Still fetching location...');
            return;
        }

        onCapture({
            image: capturedImage,
            location: location || {
                latitude: 0, longitude: 0,
                address: 'Location failed', city: 'Unknown', state: 'Unknown'
            }
        });

        stopCamera();
    };

    const retake = () => {
        setCapturedImage(null);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-2xl m-4"
                >
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Camera className="w-6 h-6" />
                            <h2 className="text-xl font-bold">Capture Report</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Camera/Preview */}
                    <div className="relative bg-black aspect-[3/4] md:aspect-video overflow-hidden">
                        {!capturedImage ? (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                                />

                                {/* Flip Camera Button */}
                                <button
                                    onClick={flipCamera}
                                    className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white hover:bg-white/20 backdrop-blur-sm"
                                    title="Flip Camera"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0-4.418-3.582-8-8-8s-8 3.582-8 8H2l5 6 5-6H9c0-3.314 2.686-6 6-6s6 2.686 6 6v3h3v-3z" /></svg>
                                </button>
                            </>
                        ) : (
                            <img
                                src={capturedImage}
                                alt="Captured"
                                className="w-full h-full object-cover"
                            />
                        )}
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Location Overlay */}
                        {location && (
                            <div className="absolute top-4 left-4 right-14 bg-black/60 backdrop-blur-md text-white p-3 rounded-lg border border-white/10 shadow-lg max-w-[80%]">
                                <div className="flex items-start space-x-2">
                                    <MapPin className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 text-sm overflow-hidden">
                                        <p className="font-bold truncate">{location.city}, {location.state}</p>
                                        <p className="text-xs opacity-90 mt-1 line-clamp-2">{location.address}</p>
                                        <p className="text-xs opacity-75 mt-1 font-mono">
                                            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {locationLoading && (
                            <div className="absolute top-4 left-4 right-14 bg-yellow-500/90 text-white p-3 rounded-lg flex items-center space-x-2 backdrop-blur-sm animate-pulse">
                                <Loader className="w-5 h-5 animate-spin" />
                                <span className="font-semibold text-sm">Getting Precise GPS...</span>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="p-6 space-y-4 bg-gray-50">
                        {!capturedImage ? (
                            <button
                                onClick={capturePhoto}
                                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center bg-white/20 backdrop-blur-sm absolute bottom-24 hidden md:flex hover:bg-white/30 transition-all">
                                    <div className="w-12 h-12 bg-white rounded-full"></div>
                                </div>
                                <Camera className="w-6 h-6 md:hidden" />
                                <span className="md:hidden">Capture Photo</span>
                                <span className="hidden md:inline">Click to Capture</span>
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={retake}
                                    className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
                                >
                                    Retake
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={locationLoading && !location}
                                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Check className="w-5 h-5" />
                                    <span>{locationLoading && !location ? 'Wait for GPS...' : 'Submit Report'}</span>
                                </button>
                            </div>
                        )}

                        {location && (
                            <div className="text-center text-xs text-green-600 font-medium flex items-center justify-center gap-1">
                                <Check className="w-3 h-3" />
                                Location Verified: {location.city}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CameraWithGPS;
