
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, User, LogOut } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link to="/">
                    <Logo />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-gray-600 hover:text-green-600 font-medium transition">Home</Link>
                    <a href="#about" className="text-gray-600 hover:text-green-600 font-medium transition">About</a>
                    <a href="#impact" className="text-gray-600 hover:text-green-600 font-medium transition">Impact</a>
                    <Link to="/ngos" className="text-gray-600 hover:text-green-600 font-medium transition">NGOs</Link>
                    <Link to="/contact" className="text-gray-600 hover:text-green-600 font-medium transition">Contact</Link>

                    {currentUser ? (
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard" className="text-gray-600 hover:text-green-600 font-medium">
                                Dashboard
                            </Link>
                            <div className="relative group">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-green-500 transition">
                                    <User className="w-5 h-5 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Account</span>
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            Start Helping <ChevronRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-700"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="px-6 py-6 flex flex-col gap-6">
                            <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-700">Home</Link>
                            <a href="#about" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-700">About</a>
                            <a href="#impact" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-700">Impact</a>
                            <Link to="/ngos" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-700">NGOs</Link>
                            <Link to="/contact" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-700">Contact</Link>
                            <div className="h-px bg-gray-100 my-2"></div>
                            {currentUser ? (
                                <>
                                    <Link to="/dashboard" className="text-lg font-medium text-gray-700" onClick={() => setIsOpen(false)}>
                                        Dashboard
                                    </Link>
                                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-lg font-medium text-red-600 text-left">
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-green-600 text-center text-white py-3 rounded-xl font-bold"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign In / Register
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
