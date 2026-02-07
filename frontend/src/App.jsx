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
import HeroAnimation from './components/HeroAnimation';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box sx={{
        position: 'relative',
        pt: { xs: 8, md: 12 },
        pb: { xs: 10, md: 15 },
        background: 'radial-gradient(circle at 10% 20%, rgba(255, 107, 107, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(46, 134, 222, 0.05) 0%, transparent 40%)',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '3rem', md: '5.5rem' },
                    mb: 3,
                    lineHeight: 1.1,
                    fontWeight: 900,
                    letterSpacing: -2,
                    background: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Be the <Box component="span" sx={{
                    color: 'primary.main',
                    WebkitTextFillColor: 'initial',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 10,
                      left: 0,
                      width: '100%',
                      height: '15px',
                      bgcolor: 'rgba(255,107,107,0.2)',
                      zIndex: -1
                    }
                  }}>Helping Hand</Box> <br />
                  Someone Needs.
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 550, fontWeight: 400, fontSize: '1.25rem', lineHeight: 1.7 }}>
                  Helping Hand is a bridge between the surplus and the suffering. We connect generous neighbors with verified local volunteers to make sure every meal and essential reaches its destination.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="large"
                    sx={{
                      px: 5, py: 2.2, fontSize: '1.1rem', borderRadius: 4,
                      boxShadow: '0 15px 35px rgba(255,107,107,0.35)',
                      transform: 'translateY(0)',
                      transition: '0.3s',
                      '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(255,107,107,0.45)' }
                    }}
                  >
                    Start Helping Today
                  </Button>
                  <Button
                    component={Link}
                    to="/dashboard"
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 5, py: 2.2, fontSize: '1.1rem', borderRadius: 4,
                      borderWidth: 2, '&:hover': { borderWidth: 2, bgcolor: 'rgba(255,107,107,0.05)' }
                    }}
                  >
                    See Live Needs
                  </Button>
                </Stack>

                <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <AvatarGroup max={4}>
                    <Avatar sx={{ border: '2px solid white !important' }} src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=100&h=100" />
                    <Avatar sx={{ border: '2px solid white !important' }} src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100" />
                    <Avatar sx={{ border: '2px solid white !important' }} src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100" />
                    <Avatar sx={{ border: '2px solid white !important' }} src="https://i.pravatar.cc/100?img=12" />
                  </AvatarGroup>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>5,000+</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Active Community Heroes</Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
              >
                <Box sx={{ position: 'relative', textAlign: 'center' }}>
                  <HeroAnimation />

                  {/* Floating Stats Card */}
                  <Paper
                    component={motion.div}
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    sx={{
                      position: 'absolute',
                      bottom: 40,
                      left: -20,
                      p: 3,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                      border: '1px solid rgba(255,255,255,0.8)',
                      backdropFilter: 'blur(10px)',
                      background: 'rgba(255,255,255,0.9)'
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}><VolunteerActivismIcon /></Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={900} color="success.main">120+ Meals</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Delivered in the last hour</Typography>
                    </Box>
                  </Paper>

                  {/* Secondary Floating Card */}
                  <Paper
                    component={motion.div}
                    animate={{ y: [20, 0, 20] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    sx={{
                      position: 'absolute',
                      top: 40,
                      right: -10,
                      p: 2,
                      borderRadius: 5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      bgcolor: 'secondary.main',
                      color: 'white'
                    }}
                  >
                    <Typography variant="h6" fontWeight={900}>98%</Typography>
                    <Typography variant="caption" fontWeight={600}>Success Rate</Typography>
                  </Paper>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="volunteer" sx={{ py: 15, bgcolor: '#fdfdfd', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Typography variant="overline" color="primary" sx={{ fontWeight: 900, letterSpacing: 3 }}>OUR MISSION</Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, mt: 1 }}>How Helping Hand Works</Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}>
                We've built a streamlined platform that turns surplus into smiles in three simple steps.
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={5}>
            {[
              {
                icon: <VolunteerActivismIcon sx={{ fontSize: 35 }} />,
                title: 'Post Surplus',
                desc: 'Got extra food, clothes, or toys? List them in seconds on our secure feed.',
                color: '#ff6b6b'
              },
              {
                icon: <GroupIcon sx={{ fontSize: 35 }} />,
                title: 'Volunteer Match',
                desc: 'Verified local volunteers are notified and step in to collect and distribute.',
                color: '#2e86de'
              },
              {
                icon: <AnalyticsIcon sx={{ fontSize: 35 }} />,
                title: 'Track Impact',
                desc: 'Earn community points and see the real-world difference you are making.',
                color: '#1dd1a1'
              }
            ].map((feature, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper
                  component={motion.div}
                  whileHover={{ y: -15 }}
                  viewport={{ once: true }}
                  sx={{
                    p: 6,
                    height: '100%',
                    borderRadius: 10,
                    textAlign: 'left',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.04)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05)'
                  }}
                >
                  <Box sx={{
                    width: 70, height: 70, borderRadius: 4,
                    bgcolor: feature.color,
                    color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mb: 4,
                    boxShadow: `0 10px 20px ${feature.color}33`
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 900 }}>{feature.title}</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>{feature.desc}</Typography>

                  {/* Decorative background number */}
                  <Typography sx={{
                    position: 'absolute',
                    top: -20,
                    right: 20,
                    fontSize: '8rem',
                    fontWeight: 900,
                    color: 'rgba(0,0,0,0.02)',
                    zIndex: -1
                  }}>
                    {idx + 1}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 12 }}>
        <Container maxWidth="lg">
          <Paper
            sx={{
              p: { xs: 6, md: 12 },
              borderRadius: 12,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(255,107,107,0.3)',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5253 100%)',
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h2" sx={{ fontWeight: 900, mb: 3 }}>Join the Movement</Typography>
                  <Typography variant="h6" sx={{ opacity: 0.95, mb: 0, fontWeight: 400, maxWidth: 600 }}>
                    Whether you are an individual, a business, or a volunteer, there is a place for you in the Helping Hand community.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      fontWeight: 900,
                      px: 8, py: 2.5,
                      borderRadius: 5,
                      fontSize: '1.2rem',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      '&:hover': { bgcolor: '#f8f9fa', transform: 'scale(1.05)' }
                    }}
                  >
                    Join Now
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Abstract Shapes */}
            <Box sx={{ position: 'absolute', top: -150, left: -150, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)' }} />
            <Box sx={{ position: 'absolute', bottom: -100, right: -50, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }} />
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
