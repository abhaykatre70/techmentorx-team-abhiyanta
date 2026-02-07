import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Logo = () => {
    return (
        <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative w-10 h-10 flex items-center justify-center">
                <motion.div
                    className="absolute inset-0 bg-green-100 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />
                <Heart className="w-6 h-6 text-green-600 relative z-10 fill-current" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                Helping Hand
            </h1>
        </motion.div>
    );
};

export default Logo;
