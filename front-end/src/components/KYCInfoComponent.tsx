import React from 'react';
import { KYCInfoProps } from '../types';
import { Box, Typography, Paper } from '@mui/material';

const KYCInfoComponent: React.FC<KYCInfoProps> = ({ kycData }) => (
  <Box sx={{ mt: 4 }}>
    {kycData ? (
      <Paper
        sx={{
          padding: 3,
          borderRadius: 2,
          backgroundColor: '#ffffff',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Extracted KYC Information
        </Typography>
        <ul style={{ listStyleType: 'none', padding: 0, lineHeight: 2 }}>
          <li><strong>Document ID:</strong> {kycData['Document ID']}</li>
          <li><strong>First Name:</strong> {kycData['First Name']}</li>
          <li><strong>Last Name:</strong> {kycData['Last Name']}</li>
          <li><strong>Address:</strong> {kycData['Address']}</li>
          <li><strong>Sex:</strong> {kycData['Sex']}</li>
          <li><strong>Date of Birth:</strong> {kycData['Date of Birth']}</li>
        </ul>
      </Paper>
    ) : (
      <Typography variant="body1" sx={{ color: 'gray' }}>
        No data available.
      </Typography>
    )}
  </Box>
);

export default KYCInfoComponent;
