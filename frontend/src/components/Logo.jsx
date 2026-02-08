// Logo Component - Use anywhere in the app
import React from 'react';
import { motion } from 'framer-motion';
import { HandHeart } from 'lucide-react';

const Logo = ({ size = 'medium', showText = true }) => {
    const sizes = {
        small: { icon: 'w-8 h-8', text: 'text-lg', container: 'w-10 h-10' },
        medium: { icon: 'w-8 h-8', text: 'text-2xl', container: 'w-14 h-14' },
        large: { icon: 'w-12 h-12', text: 'text-4xl', container: 'w-20 h-20' }
    };

    const s = sizes[size];

    return (
        <div className="flex items-center space-x-3">
            <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative"
            >
                <div className={`${s.container} bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg`}>
                    <HandHeart className={`${s.icon} text-white`} strokeWidth={2.5} />
                </div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 bg-orange-400 rounded-2xl -z-10`}
                />
            </motion.div>

            {showText && (
                <h1 className={`${s.text} font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent tracking-tight`}>
                    Helping Hand
                </h1>
            )}
        </div>
    );
};

export default Logo;
