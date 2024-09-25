export interface KYCData {
    "Document ID": string;
    "Address": string;
    "Date of Birth": string;
    "First Name": string;
    "Last Name": string;
    "Sex": string;
  }
  

export interface ImageUploadProps {
    onUpload: (file: File) => void;
}

export interface ImageViewProps {
    imageSrc: string;
}

export interface KYCInfoProps {
    kycData: KYCData | null;
}
