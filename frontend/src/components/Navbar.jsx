import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Menu, MenuItem,
    Drawer, List, ListItem, ListItemText, ListItemButton, Divider, Stack
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PanToolIcon from '@mui/icons-material/PanTool'; // For Helping Hand logo

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate('/');
    };

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Community Feed', path: '/dashboard' },
        { label: 'Volunteer', path: '/#volunteer' },
    ];

    const drawer = (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PanToolIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Helping Hand</Typography>
                </Box>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton
                            component={item.path.startsWith('/#') ? 'a' : Link}
                            to={item.path.startsWith('/#') ? undefined : item.path}
                            href={item.path.startsWith('/#') ? item.path : undefined}
                            onClick={handleDrawerToggle}
                            selected={location.pathname === item.path}
                            sx={{ borderRadius: 2, mb: 1 }}
                        >
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ mt: 4 }}>
                {user ? (
                    <Stack spacing={2}>
                        <Button fullWidth variant="outlined" component={Link} to="/profile" onClick={handleDrawerToggle}>My Impact</Button>
                        <Button fullWidth variant="contained" color="error" onClick={handleLogout}>Logout</Button>
                    </Stack>
                ) : (
                    <Stack spacing={2}>
                        <Button fullWidth variant="outlined" component={Link} to="/login" onClick={handleDrawerToggle}>Sign In</Button>
                        <Button fullWidth variant="contained" component={Link} to="/register" onClick={handleDrawerToggle}>Join Now</Button>
                    </Stack>
                )}
            </Box>
        </Box>
    );

    return (
        <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}>
            <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1200, width: '100%', mx: 'auto' }}>
                <Box
                    component={Link}
                    to="/"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        gap: 1.5,
                        transition: '0.3s',
                        '&:hover': { transform: 'scale(1.02)' }
                    }}
                >
                    <Box sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        p: 1,
                        borderRadius: 2,
                        display: 'flex',
                        boxShadow: '0 4px 12px rgba(255,107,107,0.3)'
                    }}>
                        <PanToolIcon fontSize="small" />
                    </Box>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 800,
                            color: 'primary.main',
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: -1
                        }}
                    >
                        Helping Hand
                    </Typography>
                </Box>

                {/* Desktop Nav */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.label}
                            component={item.path.startsWith('/#') ? 'a' : Link}
                            to={item.path.startsWith('/#') ? undefined : item.path}
                            href={item.path.startsWith('/#') ? item.path : undefined}
                            color="inherit"
                            sx={{
                                fontWeight: 600,
                                px: 2,
                                color: location.pathname === item.path ? 'primary.main' : 'inherit',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}

                    <Box sx={{ width: '1px', height: '20px', bgcolor: 'divider', mx: 1 }} />

                    {user ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton onClick={handleMenuOpen} sx={{ p: 0.5, border: '2px solid transparent', '&:hover': { borderColor: 'primary.main' } }}>
                                <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 'bold', width: 36, height: 36, fontSize: '0.9rem' }}>
                                    {user.fullName?.[0] || user.email[0].toUpperCase()}
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                elevation={3}
                                PaperProps={{ sx: { borderRadius: 3, mt: 1.5, minWidth: 150 } }}
                            >
                                <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>My Impact</MenuItem>
                                <Divider />
                                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Button component={Link} to="/login" variant="text" sx={{ fontWeight: 700 }}>Sign In</Button>
                            <Button component={Link} to="/register" variant="contained" sx={{ borderRadius: 3 }}>Join Now</Button>
                        </Box>
                    )}
                </Box>

                {/* Mobile Toggle */}
                <IconButton
                    onClick={handleDrawerToggle}
                    sx={{ display: { xs: 'flex', md: 'none' }, bgcolor: 'rgba(0,0,0,0.02)' }}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                PaperProps={{ sx: { width: '80%', maxWidth: 300, borderRadius: '24px 0 0 24px' } }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    );
};

export default Navbar;
