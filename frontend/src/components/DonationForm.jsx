import React, { useState } from 'react';
import { Grid, TextField, Button, MenuItem, Typography, Box, Alert, Stack } from '@mui/material';
import axios from 'axios';

const DonationForm = ({ onComplete }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: 'food',
        description: '',
        quantity: 1,
        unit: 'kg',
        address: '',
        priority: 'medium'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = ['food', 'clothes', 'toys', 'essentials', 'books', 'medical'];
    const priorities = ['low', 'medium', 'high', 'urgent'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/donations/', formData);
            if (onComplete) onComplete();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post donation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>Post New Donation</Typography>

            {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        placeholder="e.g. Fresh Home-cooked Food"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        select
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        name="description"
                        placeholder="Describe what you want to donate..."
                        value={formData.description}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Unit"
                        name="unit"
                        placeholder="kg, packs, items"
                        value={formData.unit}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        select
                        label="Priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        {priorities.map((p) => (
                            <MenuItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Address / Collection Point"
                        name="address"
                        placeholder="Your location or a meeting spot"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            size="large"
                            type="submit"
                            disabled={loading}
                            sx={{ minWidth: 200 }}
                        >
                            {loading ? 'Posting...' : 'Post Donation'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </form>
    );
};

export default DonationForm;
