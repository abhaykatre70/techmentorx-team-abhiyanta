import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, X, Upload } from 'lucide-react';
import { supabase } from '../supabase';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const GeoCamera = ({ onCaptureConfig }) => {
    const { updatePoints } = useAuth(); // Gamification Hook
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // 1. Get Location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Location error:", error);
                    toast.error("Could not capture location. Ensure GPS is enabled.");
                }
            );
        } else {
            toast.error("Geolocation is not supported by this browser.");
        }
    }, []);

    // 2. Start Camera
    const startCamera = async () => {
        setLoading(true);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
        } catch (err) {
            console.error("Camera error:", err);
            toast.error("Could not access camera. Check permissions.");
        } finally {
            setLoading(false);
        }
    };

    // Effect: Attach Stream
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Play error:", e));
        }
    }, [stream]);

    // 3. Stop Camera
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    // 4. Capture Photo
    const capturePhoto = () => {
        if (!videoRef.current) return;

        const canvas = canvasRef.current || document.createElement('canvas');
        try {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(videoRef.current, 0, 0);

            const imageData = canvas.toDataURL('image/jpeg');
            setCapturedImage(imageData);

            stopCamera();
        } catch (e) {
            console.error("Capture failed:", e);
            toast.error("Failed to capture image");
        }
    };

    // 5. Upload to Supabase
    const handleUpload = async () => {
        if (!capturedImage) {
            toast.error("No image captured");
            return;
        }

        setUploading(true);
        try {
            // Convert base64 to Blob
            const res = await fetch(capturedImage);
            const blob = await res.blob();
            const fileName = `report_${Date.now()}.jpg`;

            // Default placeholder if storage fails
            let publicUrl = "https://placehold.co/600x400/png?text=Report+Image";

            try {
                // Upload Image
                const { error: uploadError } = await supabase.storage
                    .from('reports')
                    .upload(fileName, blob);

                if (!uploadError) {
                    const { data } = supabase.storage
                        .from('reports')
                        .getPublicUrl(fileName);
                    publicUrl = data.publicUrl;
                } else {
                    console.warn("Storage upload failed, using placeholder.");
                }
            } catch (storageErr) {
                console.warn("Storage exception:", storageErr);
            }

            // Create Report Record
            const { error: dbError } = await supabase
                .from('reports')
                .insert([{
                    image_url: publicUrl,
                    latitude: location?.lat || 0,
                    longitude: location?.long || 0,
                    description: "Needy report via GeoCamera",
                    status: 'open',
                    urgency: 'high'
                }]);

            if (dbError) throw dbError;

            // GAMIFICATION REWARD
            await updatePoints(50);
            toast.success("Report Submitted! (+50 Points)");

            setCapturedImage(null);
            if (onCaptureConfig) onCaptureConfig();

        } catch (error) {
            console.error(error);
            toast.error("Failed to save report.");
        } finally {
            setUploading(false);
        }
    };

    // Clean up
    useEffect(() => {
        return () => stopCamera();
    }, []);

    return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 max-w-sm mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <MapPin className="text-red-500 w-5 h-5" /> Geo-Tag Report
                </h3>
                {location ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        GPS Active
                    </span>
                ) : (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full animate-pulse">
                        Locating...
                    </span>
                )}
            </div>

            <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video flex items-center justify-center mb-4">
                {!stream && !capturedImage && (
                    <button
                        onClick={startCamera}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full flex items-center gap-2 transition"
                    >
                        <Camera className="w-5 h-5" /> Open Camera
                    </button>
                )}

                {stream && (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                )}

                {capturedImage && (
                    <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                )}

                <canvas ref={canvasRef} className="hidden" />
            </div>

            {stream && (
                <div className="flex gap-2 justify-center">
                    <button
                        onClick={capturePhoto}
                        className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center shadow-lg hover:scale-105 transition"
                    >
                        <div className="w-12 h-12 bg-red-500 rounded-full"></div>
                    </button>
                    <button onClick={stopCamera} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {capturedImage && (
                <div className="flex gap-3">
                    <button
                        onClick={() => setCapturedImage(null)}
                        className="flex-1 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
                    >
                        Retake
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                        {uploading ? "Uploading..." : <><Upload className="w-4 h-4" /> Submit (+50 pts)</>}
                    </button>
                </div>
            )}
        </div>
    );
};

export default GeoCamera;
