import React from 'react';
import Navbar from './Navbar';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box
                component={motion.main}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                sx={{ flexGrow: 1, py: 4 }}
            >
                {children}
            </Box>
            <Box component="footer" sx={{ py: 6, borderTop: '1px solid rgba(0,0,0,0.05)', bgcolor: 'white', mt: 'auto' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="space-between" alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                                Helping Hand
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Connecting hearts, building communities through structured giving.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', gap: 3, justifyContent: { xs: 'flex-start', md: 'center' } }}>
                                <Link href="#" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>About</Link>
                                <Link href="#" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Work</Link>
                                <Link href="#" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Privacy</Link>
                                <Link href="#" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Contact</Link>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="caption" color="text.secondary">
                                © 2026 Helping Hand. All rights reserved.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Layout;
