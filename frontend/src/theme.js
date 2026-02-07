import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#ff6b6b', // Coral/Orange
            dark: '#ee5253',
            contrastText: '#fff',
        },
        secondary: {
            main: '#2e86de', // Blue
            dark: '#227093',
            contrastText: '#fff',
        },
        background: {
            default: '#fdfdfd',
            paper: '#ffffff',
        },
        text: {
            primary: '#2d3436',
            secondary: '#636e72',
        },
        success: {
            main: '#1dd1a1',
        },
        error: {
            main: '#ff7675',
        },
    },
    typography: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 700,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 12,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '8px 24px',
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #ee5253 0%, #ff9f43 100%)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                },
            },
        },
    },
});

export default theme;
