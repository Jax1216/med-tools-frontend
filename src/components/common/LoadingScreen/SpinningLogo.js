import React from 'react';
import { Box, keyframes } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles'; 

// Define the spinning animation using keyframes
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Define a pulsing opacity animation for the group
const pulseGroupOpacity = keyframes`
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
`;

const getLogoCircleData = () => { 
  const circleCount = 9;
  const angles = [60, 75, 95, 120, 150, 185, 222, 265, 315]; // Degrees
  const scalePattern = [0.7, 1.10, 1.45, 1.75, 1.95, 2.15, 2.35, 2.95, 3.25];
  const radius = 35; // Main radius of the logo structure
  const baseDotSize = 3.5; // Increased base size for dots
  const dotSizeMultiplier = 0.6; // Multiplier for scaling dots

  const circles = [];
  for (let i = 0; i < circleCount; i++) {
    const angleRad = (angles[i] - 90) * (Math.PI / 180); 
    const cx = radius * Math.cos(angleRad);
    const cy = radius * Math.sin(angleRad);
    const r = baseDotSize * scalePattern[i] * dotSizeMultiplier; 

    circles.push({
      id: `dot-${i}`,
      cx,
      cy,
      r,
    });
  }
  return circles;
};

const SpinningLogo = ({ size = 48, color }) => { // Increased default size
  const theme = useTheme();
  const circles = getLogoCircleData(); 

  const dotColor = color || theme.palette.primary.main || '#1976d2';
  // container for the box
  const viewBoxSize = 90; 

  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: `${spin} 1.4s ease-in-out infinite`, 
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`-${viewBoxSize / 2} -${viewBoxSize / 2} ${viewBoxSize} ${viewBoxSize}`} 
      >
        <g 
            sx={{ 
                animation: `${pulseGroupOpacity} 1.8s ease-in-out infinite alternate`
            }}
        >
          {circles.map((circle) => (
            <circle
              key={circle.id}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill={dotColor}
            />
          ))}
        </g>
      </svg>
    </Box>
  );
};

export default SpinningLogo;