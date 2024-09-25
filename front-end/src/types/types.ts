// types.ts

export interface ImageUploadProps {
    onUpload: (file: File) => void;
  }
  
  export interface ImageViewProps {
    imageSrc: string;
    onRotateSubmit: (rotatedImageDataUrl: string) => void;
  }
  
  export interface KYCInfoProps {
    kycData: KYCData;
  }
  
  export interface KYCData {
    'Document ID': string;
    'First Name': string;
    'Last Name': string;
    'Address': string;
    'Sex': string;
    'Date of Birth': string;
  }
  