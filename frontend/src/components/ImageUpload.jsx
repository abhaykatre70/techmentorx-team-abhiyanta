// Image Upload Component - Upload to Supabase Storage
import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ImageUpload = ({ onUpload, existingImage = null, bucket = 'reports' }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(existingImage);

    const handleFileSelect = async (event) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image must be less than 5MB');
                return;
            }

            setUploading(true);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            toast.success('Image uploaded!');
            onUpload(publicUrl);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed: ' + error.message);
            setPreview(existingImage);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onUpload(null);
    };

    return (
        <div className="space-y-3">
            {preview ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                >
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            ) : (
                <label className="block cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 hover:bg-orange-50 transition">
                        {uploading ? (
                            <div className="flex flex-col items-center space-y-3">
                                <Loader className="w-12 h-12 text-orange-500 animate-spin" />
                                <p className="text-sm font-semibold text-gray-600">Uploading...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-3">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Click to upload image</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            </div>
                        )}
                    </div>
                </label>
            )}
        </div>
    );
};

export default ImageUpload;
