// import React from 'react';
// import { ImageViewProps } from '../types';
// import { Box, Typography } from '@mui/material';

// const ImageViewComponent: React.FC<ImageViewProps> = ({ imageSrc }) => (
//   <Box sx={{ mt: 4, textAlign: 'center' }}>
//     <Typography variant="h6" gutterBottom>
//       Uploaded Document Preview
//     </Typography>
//     <img
//       src={imageSrc}
//       alt="Uploaded Document"
//       style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
//     />
//   </Box>
// );

// export default ImageViewComponent;

// ImageViewComponent.tsx

import React, { useState, useRef, useEffect } from 'react';
import { ImageViewProps } from '../types/types';
import { Box, Typography, Button } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';

const ImageViewComponent: React.FC<ImageViewProps> = ({ imageSrc, onRotateSubmit }) => {
  const [rotation, setRotation] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rotateLeft = () => {
    setRotation((prev) => prev - 90);
  };

  const rotateRight = () => {
    setRotation((prev) => prev + 90);
  };

  useEffect(() => {
    if (canvasRef.current && imageSrc) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        // Adjust canvas size based on rotation
        if (rotation % 180 !== 0) {
          canvas.width = image.height;
          canvas.height = image.width;
        } else {
          canvas.width = image.width;
          canvas.height = image.height;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Move to the center of the canvas
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Rotate the canvas
        ctx.rotate((rotation * Math.PI) / 180);

        // Draw the image
        ctx.drawImage(image, -image.width / 2, -image.height / 2);

        // Reset transformation matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      };
    }
  }, [imageSrc, rotation]);

  const handleSubmit = () => {
    if (canvasRef.current) {
      // Convert canvas to image
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      // Call the onRotateSubmit prop with the rotated image data
      onRotateSubmit(dataUrl);
    }
  };

  return (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Document Preview After Automated Rotation
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
        Please adjust the document if it's not centered or properly oriented.
      </Typography>
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          maxHeight: '500px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          marginTop: '16px',
        }}
      />
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Tooltip title="Rotate Left">
          <Button
            variant="outlined"
            color="primary"
            onClick={rotateLeft}
            startIcon={<RotateLeftIcon />}
          >
            Rotate Left
          </Button>
        </Tooltip>
        <Tooltip title="Rotate Right">
          <Button
            variant="outlined"
            color="primary"
            onClick={rotateRight}
            startIcon={<RotateRightIcon />}
          >
            Rotate Right
          </Button>
        </Tooltip>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 3 }}
      >
        Submit for Processing
      </Button>
    </Box>
  );
};

export default ImageViewComponent;