// import React, { useState } from 'react';
// import { ImageUploadProps } from '../types';
// import { Button, Box, Typography} from '@mui/material';

// const ImageUploadComponent: React.FC<ImageUploadProps> = ({ onUpload }) => {
//   const [file, setFile] = useState<File | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       setFile(event.target.files[0]);
//     }
//   };

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (file) {
//       onUpload(file);
//     }
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
//       <Typography variant="h6" gutterBottom>
//         Upload your KYC Document
//       </Typography>
//       {/* <Input
//         type="file"
//         onChange={handleFileChange}
//         accept="image/*"
//         sx={{ width: '100%', padding: 2, border: '1px solid #ccc', borderRadius: 2 }}
//       /> */}
//       <input
//         type="file"
//         placeholder='file'
//         accept="image/*"
//         onChange={handleFileChange}
//         style={{
//           display: 'block',
//           width: '100%',
//           padding: '10px',
//           border: '1px solid #ccc',
//           borderRadius: '5px',
//           marginBottom: '16px',
//         }}
//       />
//       <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
//         Upload Image
//       </Button>
//     </Box>
//   );
// };

// export default ImageUploadComponent;

// ImageUploadComponent.tsx

import React, { useState } from 'react';
import { ImageUploadProps } from '../types';
import { Button, Box, Typography } from '@mui/material';

const ImageUploadComponent: React.FC<ImageUploadProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      onUpload(file);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Upload your KYC Document
      </Typography>
      <input
        type="file"
        placeholder='file'
        accept="image/*"
        onChange={handleFileChange}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          marginBottom: '16px',
        }}
      />
      <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
        Upload Image
      </Button>
    </Box>
  );
};

export default ImageUploadComponent;
