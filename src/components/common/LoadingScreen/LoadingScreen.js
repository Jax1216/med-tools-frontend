// src/components/Common/FullScreenLoader.jsx
import React from 'react';
import { Box } from '@mui/material';
import SpinningLogo from './SpinningLogo';

export default function FullScreenLoader() {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'background.default',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <SpinningLogo size={64} />
    </Box>
  );
}