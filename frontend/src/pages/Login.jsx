import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'Donor'
    });
    const [showPassword, setShowPassword] = useState(false);
    const { login, signup, userRole, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e) => {
        e.preventDefault();

        try {
            if (isLogin) {
                const { user } = await login(formData.email, formData.password);
                if (user) {
                    // Redirect based on role will handle in AuthContext listener or we force it here
                    // Ideally, we fetch role then redirect. 
                    // For now, let's redirect to dashboard, and AuthProvider will set role state.
                    navigate('/dashboard');
                }
            } else {
                // Pass the selected name and role to signup
                await signup(formData.email, formData.password, formData.name, formData.role);
                toast.success("Account created successfully!");
                setIsLogin(true); // Switch to login view after signup
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Authentication failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-off-white font-poppins relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 relative z-10 transition-all duration-300 hover:shadow-green-100">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-50 p-4 rounded-2xl shadow-inner">
                            <Logo />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{isLogin ? 'Welcome Back' : 'Join the Movement'}</h2>
                    <p className="text-gray-500">{isLogin ? 'Sign in to continue making an impact' : 'Create an account to start helping'}</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">

                    {!isLogin && (
                        <>
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition duration-200 font-medium"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required={!isLogin}
                                    />
                                </div>
                            </div>

                            {/* Role Selection Dropdown */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">I am a</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-gray-400 text-lg group-focus-within:text-green-600 transition">🎭</span>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition sm:text-sm appearance-none font-medium"
                                        required={!isLogin}
                                    >
                                        <option value="Donor">Donor (Donate Items)</option>
                                        <option value="Volunteer">Volunteer (Help Deliver)</option>
                                        <option value="NGO">NGO (Request Help)</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition" />
                            <input
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition duration-200 font-medium"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition duration-200 font-medium"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition duration-300 flex items-center justify-center gap-2 group"
                    >
                        {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-green-600 font-bold hover:underline"
                        >
                            {isLogin ? 'Register' : 'Login'}
                        </button>
                    </p>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button onClick={loginWithGoogle} className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition font-medium text-gray-700 text-sm">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-2" alt="Google" />
                        Google
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition font-medium text-gray-700 text-sm">
                        <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="h-5 w-5 mr-2" alt="Facebook" />
                        Facebook
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
