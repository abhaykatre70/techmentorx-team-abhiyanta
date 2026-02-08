import React, { useState } from 'react';
import {
    Container, Paper, Typography, TextField, Button, Box,
    Link as MuiLink, Alert, Grid, MenuItem, Select, FormControl,
    InputLabel, InputAdornment, IconButton
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import GroupIcon from '@mui/icons-material/Group';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PanToolIcon from '@mui/icons-material/PanTool';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'Donor'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            console.log('Registering user:', formData);
            const res = await register(formData);
            console.log('Registration successful:', res);
            // After successful registration, show success message and navigate to login
            navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Something went wrong. Please check your details and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            py: 10,
            background: 'radial-gradient(circle at 0% 0%, rgba(46, 134, 222, 0.05) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(255, 107, 107, 0.05) 0%, transparent 50%)'
        }}>
            <Container maxWidth="md">
                <Grid container spacing={4} alignItems="center">
                    {/* Left side info - Hidden on mobile */}
                    <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                            <Typography variant="h2" sx={{ fontWeight: 900, color: 'primary.main', mb: 3 }}>Join the Chain of Kindness</Typography>
                            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, fontWeight: 400 }}>
                                Creating an account allows you to track your impact, coordinate donations, and connect with your community.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <Box sx={{ color: 'success.main', mt: 0.5 }}><PanToolIcon /></Box>
                                <Typography variant="body1" fontWeight={700}>Verified Community Profiles</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <Box sx={{ color: 'secondary.main', mt: 0.5 }}><PanToolIcon /></Box>
                                <Typography variant="body1" fontWeight={700}>Structured Impact Points</Typography>
                            </Box>
                        </motion.div>
                    </Grid>

                    {/* Right side form */}
                    <Grid item xs={12} md={7}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 4, md: 6 },
                                    borderRadius: 10,
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.08)'
                                }}
                            >
                                <Box sx={{ mb: 5 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>Create Account</Typography>
                                    <Typography variant="body1" color="text.secondary" fontWeight={500}>It only takes a minute to start helping.</Typography>
                                </Box>

                                {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3, fontWeight: 600 }}>{error}</Alert>}

                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                name="fullName"
                                                variant="outlined"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                required
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>,
                                                    sx: { borderRadius: 3 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                name="email"
                                                variant="outlined"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
                                                    sx: { borderRadius: 3 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Password"
                                                name="password"
                                                variant="outlined"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                    sx: { borderRadius: 3 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth sx={{ mt: 1 }}>
                                                <InputLabel>I want to join as</InputLabel>
                                                <Select
                                                    name="role"
                                                    value={formData.role}
                                                    label="I want to join as"
                                                    onChange={handleChange}
                                                    sx={{ borderRadius: 3 }}
                                                    startAdornment={<InputAdornment position="start"><GroupIcon sx={{ ml: 1 }} color="action" /></InputAdornment>}
                                                >
                                                    <MenuItem value="Donor">Donor (I have resources to give)</MenuItem>
                                                    <MenuItem value="Volunteer">Volunteer (I want to transport goods)</MenuItem>
                                                    <MenuItem value="Beneficiary">Beneficiary (I am seeking help)</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                fullWidth
                                                size="large"
                                                variant="contained"
                                                type="submit"
                                                disabled={loading}
                                                sx={{
                                                    py: 2,
                                                    fontSize: '1.1rem',
                                                    fontWeight: 900,
                                                    borderRadius: 4,
                                                    mt: 3,
                                                    boxShadow: '0 10px 20px rgba(255,107,107,0.2)'
                                                }}
                                            >
                                                {loading ? 'Processing...' : 'Complete Registration'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>

                                <Box sx={{ mt: 4, textAlign: 'center' }}>
                                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                                        Already a member? {' '}
                                        <MuiLink component={Link} to="/login" sx={{ fontWeight: 800, color: 'primary.main', textDecoration: 'none' }}>
                                            Sign In
                                        </MuiLink>
                                    </Typography>
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Register;
