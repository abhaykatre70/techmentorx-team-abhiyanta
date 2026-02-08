// Analytics Dashboard with Charts
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Gift, AlertTriangle, CheckCircle, MapPin, Award, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const Analytics = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDonations: 0,
        totalReports: 0,
        totalTasks: 0,
        completedTasks: 0,
        activeVolunteers: 0,
        totalPoints: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const [usersByRole, setUsersByRole] = useState({ NGO: 0, Volunteer: 0, Donor: 0 });
    const [reportsByStatus, setReportsByStatus] = useState({});
    const [tasksByStatus, setTasksByStatus] = useState({});

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            // Fetch users
            const { data: users, error: usersError } = await supabase.from('users').select('*');
            if (usersError) throw usersError;

            // Fetch donations
            const { data: donations, error: donationsError } = await supabase.from('donations').select('*');
            if (donationsError) throw donationsError;

            // Fetch reports
            const { data: reports, error: reportsError } = await supabase.from('reports').select('*');
            if (reportsError) throw reportsError;

            // Fetch tasks
            const { data: tasks, error: tasksError } = await supabase.from('tasks').select('*');
            if (tasksError) throw tasksError;

            // Calculate stats
            const totalPoints = users.reduce((sum, user) => sum + (user.points || 0), 0);
            const completedTasks = tasks.filter(t => t.status === 'completed').length;
            const activeVolunteers = users.filter(u => u.role === 'Volunteer').length;

            // Users by role
            const roleCount = { NGO: 0, Volunteer: 0, Donor: 0 };
            users.forEach(user => {
                roleCount[user.role] = (roleCount[user.role] || 0) + 1;
            });

            // Reports by status
            const reportStatus = {};
            reports.forEach(report => {
                reportStatus[report.status] = (reportStatus[report.status] || 0) + 1;
            });

            // Tasks by status
            const taskStatus = {};
            tasks.forEach(task => {
                taskStatus[task.status] = (taskStatus[task.status] || 0) + 1;
            });

            setStats({
                totalUsers: users.length,
                totalDonations: donations.length,
                totalReports: reports.length,
                totalTasks: tasks.length,
                completedTasks,
                activeVolunteers,
                totalPoints
            });

            setUsersByRole(roleCount);
            setReportsByStatus(reportStatus);
            setTasksByStatus(taskStatus);

        } catch (error) {
            console.error('Analytics error:', error);
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color, trend }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trend && (
                    <div className="flex items-center space-x-1 text-green-600 text-sm font-bold">
                        <TrendingUp className="w-4 h-4" />
                        <span>{trend}%</span>
                    </div>
                )}
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{value.toLocaleString()}</p>
            <p className="text-sm font-semibold text-gray-500">{label}</p>
        </motion.div>
    );

    const ProgressBar = ({ label, value, max, color }) => {
        const percentage = max > 0 ? (value / max) * 100 : 0;
        return (
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">{label}</span>
                    <span className="text-sm font-bold text-gray-900">{value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full bg-gradient-to-r ${color} rounded-full`}
                    />
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-600">Real-time insights and statistics</p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={Users}
                        label="Total Users"
                        value={stats.totalUsers}
                        color="from-blue-500 to-cyan-500"
                        trend={12}
                    />
                    <StatCard
                        icon={Gift}
                        label="Total Donations"
                        value={stats.totalDonations}
                        color="from-green-500 to-emerald-500"
                        trend={8}
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="Total Reports"
                        value={stats.totalReports}
                        color="from-orange-500 to-red-500"
                        trend={15}
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Completed Tasks"
                        value={stats.completedTasks}
                        color="from-purple-500 to-pink-500"
                        trend={20}
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">

                    {/* Users by Role */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-6 shadow-lg"
                    >
                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                            <Users className="w-6 h-6 mr-2 text-blue-500" />
                            Users by Role
                        </h3>
                        <div className="space-y-4">
                            <ProgressBar
                                label="NGO Admins"
                                value={usersByRole.NGO || 0}
                                max={stats.totalUsers}
                                color="from-purple-500 to-pink-500"
                            />
                            <ProgressBar
                                label="Volunteers"
                                value={usersByRole.Volunteer || 0}
                                max={stats.totalUsers}
                                color="from-blue-500 to-cyan-500"
                            />
                            <ProgressBar
                                label="Donors"
                                value={usersByRole.Donor || 0}
                                max={stats.totalUsers}
                                color="from-green-500 to-emerald-500"
                            />
                        </div>
                    </motion.div>

                    {/* Reports by Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-6 shadow-lg"
                    >
                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                            <AlertTriangle className="w-6 h-6 mr-2 text-orange-500" />
                            Reports by Status
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(reportsByStatus).map(([status, count]) => (
                                <ProgressBar
                                    key={status}
                                    label={status.charAt(0).toUpperCase() + status.slice(1)}
                                    value={count}
                                    max={stats.totalReports}
                                    color={
                                        status === 'resolved' ? 'from-green-500 to-emerald-500' :
                                            status === 'verified' ? 'from-blue-500 to-cyan-500' :
                                                'from-yellow-500 to-orange-500'
                                    }
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Tasks by Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-6 shadow-lg"
                    >
                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                            <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                            Tasks by Status
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(tasksByStatus).map(([status, count]) => (
                                <ProgressBar
                                    key={status}
                                    label={status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                                    value={count}
                                    max={stats.totalTasks}
                                    color={
                                        status === 'completed' ? 'from-green-500 to-emerald-500' :
                                            status === 'in-progress' ? 'from-blue-500 to-cyan-500' :
                                                'from-gray-400 to-gray-500'
                                    }
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Additional Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-xl p-6 shadow-lg text-white"
                    >
                        <h3 className="text-xl font-black mb-6 flex items-center">
                            <Award className="w-6 h-6 mr-2" />
                            Platform Impact
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-white/80 text-sm mb-1">Total Points Earned</p>
                                <p className="text-4xl font-black">{stats.totalPoints.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-white/80 text-sm mb-1">Active Volunteers</p>
                                <p className="text-4xl font-black">{stats.activeVolunteers}</p>
                            </div>
                            <div>
                                <p className="text-white/80 text-sm mb-1">Task Completion Rate</p>
                                <p className="text-4xl font-black">
                                    {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Activity Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl p-6 shadow-lg"
                >
                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                        <Activity className="w-6 h-6 mr-2 text-purple-500" />
                        Quick Stats Summary
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-3xl font-black text-blue-600 mb-2">{stats.totalUsers}</p>
                            <p className="text-sm font-semibold text-gray-600">Registered Users</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-3xl font-black text-green-600 mb-2">{stats.totalDonations}</p>
                            <p className="text-sm font-semibold text-gray-600">Donations Made</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <p className="text-3xl font-black text-orange-600 mb-2">{stats.totalReports}</p>
                            <p className="text-sm font-semibold text-gray-600">Reports Submitted</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Analytics;
