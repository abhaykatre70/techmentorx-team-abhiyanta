
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, HandHelping, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';


const Home = () => {
    return (
        <div className="flex flex-col min-h-screen bg-off-white font-poppins relative">
            {/* Hero Section */}
            <header className="flex-grow flex flex-col md:flex-row items-center justify-center px-6 py-12 pt-32 max-w-7xl mx-auto gap-12 relative z-10">
                <motion.div
                    className="md:w-1/2 space-y-6 text-center md:text-left"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-2">
                        🚀 Join over 10,000 volunteers
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
                        Make a Difference <br />
                        <span className="text-green-600">One Act at a Time</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto md:mx-0">
                        Connect directly with NGOs and people in need. Donate food, clothes, or your time with our location-based platform.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                        <Link to="/login" className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 transform hover:-translate-y-1">
                            Start Helping <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a href="#about" className="bg-white text-gray-700 border border-gray-200 font-bold py-4 px-8 rounded-full hover:bg-gray-50 transition shadow-lg flex items-center justify-center">
                            Learn More
                        </a>
                    </div>
                </motion.div>

                {/* Hero Visual / Animation Placeholder */}
                <motion.div
                    className="md:w-1/2 relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="relative z-10 bg-white p-6 rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition duration-500">
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
                    {/* Decorative blob */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute -bottom-8 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                </motion.div>
            </header>

            {/* About Section */}
            <section id="about" className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                            alt="Volunteers helping"
                            className="rounded-3xl shadow-xl w-full"
                        />
                    </div>
                    <div className="md:w-1/2 space-y-6">
                        <span className="text-green-600 font-bold uppercase tracking-wider">About Us</span>
                        <h2 className="text-4xl font-extrabold text-gray-900">Bridging the Gap Between Surplus and Scarcity</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Helping Hand is a technology-driven platform designed to connect kind-hearted donors and volunteers with NGOs and people in need.
                            We believe that no resource should go to waste when there are people who need it.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Direct Peer-to-Peer Help",
                                "Verified NGO Network",
                                "Real-time Geolocation Tracking"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section id="impact" className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="text-green-600 font-bold uppercase tracking-wider block mb-2">Our Impact</span>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-12">Numbers That Speak Louder</h2>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { number: "15,000+", label: "Meals Served" },
                            { number: "2,500+", label: "Active Volunteers" },
                            { number: "120+", label: "Partner NGOs" },
                            { number: "50+", label: "Cities Covered" }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition">
                                <p className="text-4xl font-extrabold text-green-600 mb-2">{stat.number}</p>
                                <p className="text-gray-600 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Helping Hand?</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">We provided the most transparent and efficient way to help your community.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Heart className="w-8 h-8 text-red-500" />, title: "Easy Donation", desc: "Post items in seconds. We handle the logistics." },
                            { icon: <HandHelping className="w-8 h-8 text-green-600" />, title: "Real-time Tracking", desc: "See exactly where your donation goes with GPS tracking." },
                            { icon: <Users className="w-8 h-8 text-blue-500" />, title: "Verified NGOs", desc: "Partnering only with government verified organizations." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                className="p-8 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition duration-300"
                                whileHover={{ y: -10 }}
                            >
                                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <Heart className="w-6 h-6 text-green-500 fill-current" />
                        <span className="text-xl font-bold">Helping Hand</span>
                    </div>
                    <p className="text-gray-400 text-sm">&copy; 2026 Helping Hand Foundation. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
