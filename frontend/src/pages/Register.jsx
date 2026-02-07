import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Link as MuiLink, Alert, Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'donor'
    });
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
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 10 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Paper sx={{ p: 6, borderRadius: 8 }}>
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Join Helping Hand</Typography>
                        <Typography variant="body1" color="text.secondary">Start making an impact in your community today</Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="fullName"
                                    variant="outlined"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
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
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    variant="outlined"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>I want to join as</InputLabel>
                                    <Select
                                        name="role"
                                        value={formData.role}
                                        label="I want to join as"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="donor">Donor (I want to give)</MenuItem>
                                        <MenuItem value="volunteer">Volunteer (I want to help distribute)</MenuItem>
                                        <MenuItem value="beneficiary">Beneficiary (I am in need)</MenuItem>
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
                                    sx={{ py: 2, fontSize: '1.1rem' }}
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Already have an account? {' '}
                            <MuiLink component={Link} to="/login" sx={{ fontWeight: 700, textDecoration: 'none' }}>
                                Sign In
                            </MuiLink>
                        </Typography>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default Register;
