import React, { useState } from 'react';
import {
    Container, Paper, Typography, TextField, Button, Box,
    Link as MuiLink, Alert, Grid, InputAdornment, IconButton
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PanToolIcon from '@mui/icons-material/PanTool';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 107, 107, 0.05) 0%, transparent 100%)'
        }}>
            <Container maxWidth="sm">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, md: 8 },
                            borderRadius: 10,
                            border: '1px solid rgba(0,0,0,0.05)',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Decorative logo in background */}
                        <PanToolIcon sx={{
                            position: 'absolute',
                            top: -20,
                            right: -20,
                            fontSize: '12rem',
                            opacity: 0.03,
                            color: 'primary.main',
                            transform: 'rotate(-15deg)'
                        }} />

                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Box sx={{
                                display: 'inline-flex',
                                p: 2,
                                bgcolor: 'primary.main',
                                borderRadius: 4,
                                mb: 3,
                                boxShadow: '0 10px 20px rgba(255,107,107,0.3)'
                            }}>
                                <PanToolIcon sx={{ color: 'white', fontSize: 32 }} />
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>Welcome Back</Typography>
                            <Typography variant="body1" color="text.secondary" fontWeight={500}>
                                Join the community of Helping Hand heroes.
                            </Typography>
                        </Box>

                        {location.state?.message && (
                            <Alert severity="success" sx={{ mb: 4, borderRadius: 4, fontWeight: 600 }}>
                                {location.state.message}
                            </Alert>
                        )}

                        {error && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                <Alert severity="error" sx={{ mb: 4, borderRadius: 4, fontWeight: 600 }}>{error}</Alert>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        variant="outlined"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            sx: { borderRadius: 4 }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        variant="outlined"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                            sx: { borderRadius: 4 }
                                        }}
                                    />
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
                                            fontSize: '1.2rem',
                                            fontWeight: 900,
                                            borderRadius: 4,
                                            mt: 2,
                                            boxShadow: '0 10px 20px rgba(255,107,107,0.3)'
                                        }}
                                    >
                                        {loading ? 'Authenticating...' : 'Sign In'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>

                        <Box sx={{ mt: 5, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary" fontWeight={500}>
                                New to Helping Hand? {' '}
                                <MuiLink
                                    component={Link}
                                    to="/register"
                                    sx={{
                                        fontWeight: 800,
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    Create Counterpart Account
                                </MuiLink>
                            </Typography>
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Login;
