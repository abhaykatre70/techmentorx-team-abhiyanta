import React from 'react';
import { Box } from '@mui/material';

const HeroAnimation = () => {
    return (
        <Box sx={{
            width: '100%',
            maxWidth: { xs: 500, md: 800 },
            mx: 'auto',
            transform: { md: 'scale(1.4) translateX(40px)' },
            perspective: '1000px',
            transformStyle: 'preserve-3d',
        }}>
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <style>
                        {`
              @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                25% { transform: translateY(-15px) rotate(3deg); }
                75% { transform: translateY(-8px) rotate(-3deg); }
              }
              
              @keyframes floatAlt {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(-5deg); }
              }
              
              @keyframes pulse-glow {
                0%, 100% { filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.4)); }
                50% { filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.8)); }
              }
              
              @keyframes heart-beat {
                0%, 100% { transform: scale(1); }
                15% { transform: scale(1.15); }
                30% { transform: scale(1); }
                45% { transform: scale(1.1); }
              }
              
              @keyframes rotate-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              
              @keyframes sparkle {
                0%, 100% { opacity: 0; transform: scale(0); }
                50% { opacity: 1; transform: scale(1); }
              }
              
              .float-1 { animation: float 4s ease-in-out infinite; }
              .float-2 { animation: floatAlt 5s ease-in-out infinite 0.5s; }
              .float-3 { animation: float 4.5s ease-in-out infinite 1s; }
              .float-4 { animation: floatAlt 3.5s ease-in-out infinite 0.3s; }
              .float-5 { animation: float 5.5s ease-in-out infinite 0.7s; }
              
              .heart-pulse { animation: heart-beat 1.5s ease-in-out infinite; }
              .glow-pulse { animation: pulse-glow 2s ease-in-out infinite; }
              .rotate-slow { animation: rotate-slow 20s linear infinite; }
              
              .sparkle-1 { animation: sparkle 2s ease-in-out infinite 0s; }
              .sparkle-2 { animation: sparkle 2s ease-in-out infinite 0.4s; }
              .sparkle-3 { animation: sparkle 2s ease-in-out infinite 0.8s; }
              .sparkle-4 { animation: sparkle 2s ease-in-out infinite 1.2s; }
              .sparkle-5 { animation: sparkle 2s ease-in-out infinite 1.6s; }
            `}
                    </style>
                </defs>

                {/* Background decorative circle */}
                <circle cx="200" cy="200" r="180" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="10 5" className="rotate-slow" style={{ transformOrigin: 'center' }} />

                {/* Sparkles */}
                <g className="sparkle-1">
                    <polygon points="50,80 53,90 63,90 55,96 58,106 50,100 42,106 45,96 37,90 47,90" fill="#fbbf24" />
                </g>
                <g className="sparkle-2">
                    <polygon points="350,120 353,130 363,130 355,136 358,146 350,140 342,146 345,136 337,130 347,130" fill="#f59e0b" />
                </g>
                <g className="sparkle-3">
                    <polygon points="80,300 83,310 93,310 85,316 88,326 80,320 72,326 75,316 67,310 77,310" fill="#fbbf24" />
                </g>
                <g className="sparkle-4">
                    <polygon points="320,280 323,290 333,290 325,296 328,306 320,300 312,306 315,296 307,290 317,290" fill="#f59e0b" />
                </g>
                <g className="sparkle-5">
                    <polygon points="200,50 203,60 213,60 205,66 208,76 200,70 192,76 195,66 187,60 197,60" fill="#fbbf24" />
                </g>

                {/* Central Heart with Hands */}
                <g className="heart-pulse glow-pulse" style={{ transformOrigin: '200px 200px' }}>
                    <path d="M200,280 C200,280 120,220 120,160 C120,120 150,100 180,100 C200,100 200,120 200,120 C200,120 200,100 220,100 C250,100 280,120 280,160 C280,220 200,280 200,280Z" fill="#ef4444" stroke="#dc2626" strokeWidth="3" />
                    <ellipse cx="165" cy="145" rx="20" ry="15" fill="#fca5a5" opacity="0.6" />
                </g>

                {/* Floating Items */}
                <g className="float-1" style={{ transformOrigin: '100px 150px' }}>
                    <ellipse cx="100" cy="155" rx="25" ry="22" fill="#22c55e" />
                    <ellipse cx="95" cy="150" rx="8" ry="6" fill="#86efac" opacity="0.7" />
                    <path d="M100,133 Q105,125 110,130" stroke="#84cc16" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <ellipse cx="108" cy="128" rx="6" ry="4" fill="#84cc16" />
                </g>

                <g className="float-2" style={{ transformOrigin: '300px 130px' }}>
                    <path d="M275,110 L285,100 L300,100 L300,115 L315,100 L325,110 L315,120 L315,155 L285,155 L285,120 L275,110Z" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
                    <path d="M290,115 L310,115" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                </g>

                <g className="float-3" style={{ transformOrigin: '85px 280px' }}>
                    <ellipse cx="85" cy="290" rx="22" ry="25" fill="#d97706" />
                    <circle cx="85" cy="260" r="18" fill="#d97706" />
                    <circle cx="70" cy="248" r="8" fill="#d97706" />
                    <circle cx="100" cy="248" r="8" fill="#d97706" />
                    <circle cx="70" cy="248" r="5" fill="#fbbf24" />
                    <circle cx="100" cy="248" r="5" fill="#fbbf24" />
                    <circle cx="78" cy="258" r="3" fill="#1f2937" />
                    <circle cx="92" cy="258" r="3" fill="#1f2937" />
                    <ellipse cx="85" cy="268" rx="5" ry="4" fill="#92400e" />
                    <ellipse cx="62" cy="285" rx="8" ry="12" fill="#d97706" />
                    <ellipse cx="108" cy="285" rx="8" ry="12" fill="#d97706" />
                </g>

                <g className="float-4" style={{ transformOrigin: '320px 260px' }}>
                    <rect x="300" y="250" width="40" height="35" rx="3" fill="#ec4899" stroke="#db2777" strokeWidth="2" />
                    <rect x="300" y="240" width="40" height="12" rx="2" fill="#f472b6" />
                    <rect x="317" y="240" width="6" height="45" fill="#fbbf24" />
                    <rect x="300" y="262" width="40" height="6" fill="#fbbf24" />
                    <circle cx="320" cy="242" r="6" fill="#fbbf24" />
                    <ellipse cx="310" cy="238" rx="6" ry="4" fill="#fbbf24" />
                    <ellipse cx="330" cy="238" rx="6" ry="4" fill="#fbbf24" />
                </g>

                <g className="float-5" style={{ transformOrigin: '130px 320px' }}>
                    <ellipse cx="130" cy="340" rx="18" ry="6" fill="#9ca3af" />
                    <rect x="112" y="310" width="36" height="30" fill="#14b8a6" />
                    <ellipse cx="130" cy="310" rx="18" ry="6" fill="#2dd4bf" />
                    <rect x="115" y="318" width="30" height="12" fill="#fef3c7" />
                    <text x="130" y="328" textAnchor="middle" fontSize="8" fill="#0d9488" fontWeight="bold">FOOD</text>
                </g>

                {/* Hands */}
                <g>
                    <path d="M140,380 Q130,350 145,330 Q155,340 155,355 Q165,340 175,345 Q180,360 170,375 Q160,390 140,380Z" fill="#fcd34d" stroke="#f59e0b" strokeWidth="2" />
                    <path d="M260,380 Q270,350 255,330 Q245,340 245,355 Q235,340 225,345 Q220,360 230,375 Q240,390 260,380Z" fill="#fcd34d" stroke="#f59e0b" strokeWidth="2" />
                </g>

                {/* Small hearts */}
                <g className="float-1" style={{ transformOrigin: '170px 100px' }}>
                    <path d="M170,100 C170,100 165,95 165,90 C165,85 170,83 170,88 C170,83 175,85 175,90 C175,95 170,100 170,100Z" fill="#f87171" />
                </g>
                <g className="float-3" style={{ transformOrigin: '230px 95px' }}>
                    <path d="M230,95 C230,95 225,90 225,85 C225,80 230,78 230,83 C230,78 235,80 235,85 C235,90 230,95 230,95Z" fill="#fb7185" />
                </g>
                <g className="float-2" style={{ transformOrigin: '200px 75px' }}>
                    <path d="M200,75 C200,75 193,68 193,61 C193,54 200,51 200,58 C200,51 207,54 207,61 C207,68 200,75 200,75Z" fill="#f472b6" />
                </g>
            </svg>
        </Box>
    );
};

export default HeroAnimation;
