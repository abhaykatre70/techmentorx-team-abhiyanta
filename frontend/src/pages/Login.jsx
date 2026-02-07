import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Link as MuiLink, Alert, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 10 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Paper sx={{ p: 6, borderRadius: 8 }}>
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Welcome Back</Typography>
                        <Typography variant="body1" color="text.secondary">Enter your credentials to access your account</Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

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
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    variant="outlined"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                    disabled={loading}
                                    sx={{ py: 2, fontSize: '1.1rem' }}
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Don't have an account? {' '}
                            <MuiLink component={Link} to="/register" sx={{ fontWeight: 700, textDecoration: 'none' }}>
                                Create one
                            </MuiLink>
                        </Typography>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default Login;
