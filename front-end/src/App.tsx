import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress, Container, Typography, Box, Snackbar } from '@mui/material';
import ImageUploadComponent from './components/ImageUploadComponent';
import ImageViewComponent from './components/ImageViewComponent';
import KYCInfoComponent from './components/KYCInfoComponent';
import { KYCData } from './types';

const App: React.FC = () => {
  const [rotatedImageSrc, setRotatedImageSrc] = useState<string>('');
  const [kycData, setKYCData] = useState<KYCData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Track loading state
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false); // Track snackbar state

  // Use environment variable for API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('document', file);

    try {
      setLoading(true); // Start loading spinner
      setSnackbarOpen(true); // Open Snackbar when fetching starts

      // Corrected URL using backticks
      const response = await axios.post(`${API_URL}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      if (data.rotated_image) {
        setRotatedImageSrc(data.rotated_image);
      }
      setLoading(false); // Stop loading spinner
      setSnackbarOpen(false); // Close Snackbar after fetching is done
    } catch (err: unknown) {
      setLoading(false); // Stop loading spinner
      setSnackbarOpen(false); // Close Snackbar if there's an error
      if (axios.isAxiosError(err)) {
        console.error('Axios error:', err);
        setError(err.response?.data?.error || 'An error occurred while uploading the file.');
      } else {
        console.error('Unknown error:', err);
        setError('An unknown error occurred.');
      }
    }
  };

  const handleRotateSubmit = async (rotatedImageDataUrl: string) => {
    try {
      setLoading(true);
      setSnackbarOpen(true);

      // Corrected URL using backticks
      const response = await axios.post(`${API_URL}/process`, {
        image: rotatedImageDataUrl,
      });

      const data: KYCData = response.data;
      setKYCData(data);
      setLoading(false);
      setSnackbarOpen(false);
    } catch (err: unknown) {
      setLoading(false);
      setSnackbarOpen(false);
      if (axios.isAxiosError(err)) {
        console.error('Axios error:', err);
        setError(err.response?.data?.error || 'An error occurred while processing the image.');
      } else {
        console.error('Unknown error:', err);
        setError('An unknown error occurred.');
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close the Snackbar manually
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        margin: 'auto',
        width: '75vw',
      }}
    >
      <Container
        maxWidth="md"
        sx={{ backgroundColor: '#ffffff', padding: 4, borderRadius: 2 }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ color: '#1976d2', fontWeight: 'bold' }}
        >
          KYC Document Processor
        </Typography>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px',
            }}
          >
            <CircularProgress size={60} thickness={5} />
            <Typography sx={{ ml: 2 }}>Processing...</Typography>
          </Box>
        ) : (
          <>
            {!rotatedImageSrc && !kycData && (
              <ImageUploadComponent onUpload={handleUpload} />
            )}
            {rotatedImageSrc && !kycData && (
              <ImageViewComponent
                imageSrc={rotatedImageSrc}
                onRotateSubmit={handleRotateSubmit}
              />
            )}
            {kycData && <KYCInfoComponent kycData={kycData} />}
            {error && (
              <Typography
                color="error"
                align="center"
                sx={{ marginTop: 2 }}
              >
                {error}
              </Typography>
            )}
          </>
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message="Processing..."
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default App;
