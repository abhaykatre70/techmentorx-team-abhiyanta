import React from 'react';
import {
  Container, Typography, Button, Box, Grid, Paper, Stack,
  Avatar, AvatarGroup, Rating, Divider, useTheme, useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import GroupIcon from '@mui/icons-material/Group';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SecurityIcon from '@mui/icons-material/Security';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box sx={{
        position: 'relative',
        pt: { xs: 8, md: 15 },
        pb: { xs: 10, md: 20 },
        background: 'radial-gradient(circle at 10% 20%, rgba(255, 107, 107, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(46, 134, 222, 0.05) 0%, transparent 40%)',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.8rem', md: '5rem' },
                    mb: 3,
                    lineHeight: 1.1,
                    fontWeight: 900,
                    letterSpacing: -2
                  }}
                >
                  Be the <Box component="span" sx={{ color: 'primary.main', borderBottom: '6px solid rgba(255,107,107,0.2)' }}>Helping Hand</Box> <br />
                  Someone Needs Today
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 600, fontWeight: 400, fontSize: '1.2rem', lineHeight: 1.6 }}>
                  Helping Hand connects generous donors with local volunteers to ensure every contribution—food, clothes, or essentials—reaches those in need efficiently and safely.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="large"
                    sx={{
                      px: 5, py: 2.5, fontSize: '1.1rem', borderRadius: 4,
                      boxShadow: '0 10px 30px rgba(255,107,107,0.3)'
                    }}
                  >
                    Start Helping
                  </Button>
                  <Button
                    component={Link}
                    to="/dashboard"
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 5, py: 2.5, fontSize: '1.1rem', borderRadius: 4,
                      borderWidth: 2, '&:hover': { borderWidth: 2 }
                    }}
                  >
                    Browse Needs
                  </Button>
                </Stack>

                <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AvatarGroup max={4}>
                    <Avatar src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=100&h=100" />
                    <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100" />
                    <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100" />
                    <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100" />
                  </AvatarGroup>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Join <Box component="span" color="primary.main">2,500+</Box> heroes already making impact
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
            {!isMobile && (
              <Grid item xs={12} md={5}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, type: 'spring' }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
                      sx={{
                        width: '100%',
                        borderRadius: 10,
                        boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                        transform: 'rotate(-2deg)'
                      }}
                    />
                    <Paper sx={{
                      position: 'absolute',
                      bottom: -30,
                      left: -30,
                      p: 3,
                      borderRadius: 5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }}>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}><FavoriteIcon /></Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={800}>$12,450</Typography>
                        <Typography variant="caption" color="text.secondary">Total Impact Today</Typography>
                      </Box>
                    </Paper>
                  </Box>
                </motion.div>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="volunteer" sx={{ py: 15, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>HOW IT WORKS</Typography>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, letterSpacing: -1 }}>A Chain of Compassion</Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontWeight: 400 }}>
              We've created a seamless pipeline from your doorstep to the recipient's hands.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              { icon: <VolunteerActivismIcon sx={{ fontSize: 50, color: 'primary.main' }} />, title: 'Post Donation', desc: 'List any surplus food, clean clothes, or toys. describe its condition and set a location.' },
              { icon: <GroupIcon sx={{ fontSize: 40, color: 'secondary.main' }} />, title: 'Volunteers Pick Up', desc: 'Verified local volunteers see your post, coordinate a pickup, and handle the distribution.' },
              { icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'success.main' }} />, title: 'Impact Tracked', desc: 'Once delivered, both donor and volunteer receive points. See your impact growing in real-time.' }
            ].map((feature, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper component={motion.div}
                  whileHover={{ y: -10 }}
                  sx={{
                    p: 6,
                    height: '100%',
                    borderRadius: 8,
                    textAlign: 'center',
                    border: '1px solid rgba(0,0,0,0.03)',
                    transition: '0.3s'
                  }}
                >
                  <Box sx={{
                    width: 80, height: 80, borderRadius: '50%',
                    bgcolor: (theme) => `${feature.icon.props.color}.main`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 4, opacity: 0.1
                  }}>
                    <Box sx={{ opacity: 10 }}>{feature.icon}</Box>
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 800 }}>{feature.title}</Typography>
                  <Typography variant="body1" color="text.secondary">{feature.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 15 }}>
        <Container maxWidth="lg">
          <Paper
            sx={{
              p: { xs: 6, md: 10 },
              borderRadius: 10,
              bgcolor: 'primary.main',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 30px 60px rgba(255,107,107,0.4)',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5253 100%)'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h3" sx={{ fontWeight: 900, mb: 3 }}>Ready to make a difference?</Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 0, fontWeight: 400 }}>
                    Whether you have 5 minutes to post or 1 hour to volunteer, your help matters.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    sx={{
                      bgcolor: 'white', color: 'primary.main', fontWeight: 800,
                      px: 6, py: 2, borderRadius: 4, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                  >
                    Join Helping Hand
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Decorative circles */}
            <Box sx={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
