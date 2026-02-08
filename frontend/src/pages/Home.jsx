// Home Page with Hero GIF
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, MapPin, Gift, TrendingUp, CheckCircle, Heart, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';

const Home = () => {

    const stats = [
        { number: '10,000+', label: 'People Helped', icon: Users },
        { number: '500+', label: 'Active Volunteers', icon: CheckCircle },
        { number: '₹50L+', label: 'Donations Raised', icon: Gift },
        { number: '25+', label: 'Cities Covered', icon: MapPin }
    ];

    const features = [
        {
            icon: MapPin,
            title: 'Live Tracking',
            description: 'Real-time location tracking of all relief activities across India',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Gift,
            title: 'Smart Donations',
            description: 'Match your donations with verified needs in your area',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Users,
            title: 'Volunteer Network',
            description: 'Connect with volunteers and coordinate relief efforts',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: TrendingUp,
            title: 'Impact Analytics',
            description: 'Track your contribution and see the real-time impact',
            color: 'from-orange-500 to-red-500'
        }
    ];

    return (
        <div className="min-h-screen bg-transparent">

            {/* Hero Section with GIF */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center space-x-3 mb-6">
                                <Logo size="medium" showText={false} />
                                <h2 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                    Helping Hand
                                </h2>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                                Together We Can
                                <span className="block bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                                    Make a Difference
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Join India's most trusted platform for disaster relief and community support.
                                Connect donors, volunteers, and those in need through technology.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link to="/login">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2"
                                    >
                                        <span>Get Started</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                                <Link to="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all border-2 border-orange-200"
                                    >
                                        View Dashboard
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Right - Hero Image with Overlay */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative w-full flex items-center justify-center p-4"
                        >
                            <div className="relative z-10 bg-white p-6 rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition duration-500 w-full max-w-lg">
                                <img
                                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                                    alt="Volunteers packing food"
                                    className="rounded-2xl w-full h-80 object-cover"
                                />
                                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3">
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <Heart className="w-6 h-6 text-green-600 fill-current" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Impact</p>
                                        <p className="font-bold text-gray-900">1.2M+ Lives Touched</p>
                                    </div>
                                </div>


                            </div>

                            {/* Decorative Blobs */}
                            <div className="absolute top-0 right-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                            <div className="absolute -bottom-8 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <Icon className="w-10 h-10 text-white mx-auto mb-3" />
                                    <p className="text-4xl font-black text-white mb-2">{stat.number}</p>
                                    <p className="text-white/90 font-semibold">{stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to make a real impact in disaster relief and community support
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all"
                                >
                                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                    >
                        <Heart className="w-20 h-20 text-white mx-auto mb-6" />
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Ready to Make an Impact?
                        </h2>
                        <p className="text-xl text-white/90 mb-8">
                            Join thousands of volunteers and donors making a difference every day
                        </p>
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-5 bg-white text-orange-600 rounded-xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all"
                            >
                                Join Helping Hand Today
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-900 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <Logo size="small" showText={false} />
                            <span className="text-white font-bold text-lg">Helping Hand</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            © 2026 Helping Hand. Making a difference together.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
