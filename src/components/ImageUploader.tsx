import React, { useRef, useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cloudinaryService, type CloudinaryUploadResponse } from '../services/cloudinaryService';
import './ImageUploader.css';

interface ImageUploaderProps {
  onImageUpload?: (imageData: CloudinaryUploadResponse) => void;
  onImagesUpload?: (imagesData: CloudinaryUploadResponse[]) => void;
  folder?: string;
  maxSizeMB?: number;
  multiple?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  onImagesUpload,
  folder = 'cit_website',
  maxSizeMB = 5,
  multiple = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const hasSizeLimit = maxSizeMB > 0;
  const isCloudinaryConfigured = cloudinaryService.isConfigured();
  const cloudinaryConfigMessage =
    'Image upload is unavailable. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env, then restart the app.';

  const validateFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return false;
    }

    if (hasSizeLimit) {
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > maxSizeMB) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        return false;
      }
    }

    return true;
  };

  const uploadSingleImage = async (file: File) => {
    const response = await cloudinaryService.uploadImage(file, folder);
    onImageUpload?.(response);
    return response;
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const uploadedImages: CloudinaryUploadResponse[] = [];

      for (const file of files) {
        const response = await uploadSingleImage(file);
        uploadedImages.push(response);
      }

      if (onImagesUpload) {
        onImagesUpload(uploadedImages);
      }

      setSuccess(true);
      setError(null);

      setTimeout(() => {
        setPreviewUrl(null);
        setSuccess(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isCloudinaryConfigured) {
      setError(cloudinaryConfigMessage);
      return;
    }

    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const files = Array.from(selectedFiles);
    const filesToUpload = multiple ? files : [files[0]];

    for (const file of filesToUpload) {
      if (!validateFile(file)) {
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(filesToUpload[0]);

    await uploadFiles(filesToUpload);
  };

  const handleRemovePreview = () => {
    setPreviewUrl(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isCloudinaryConfigured) {
      return;
    }

    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = async (e: React.DragEvent) => {
    if (!isCloudinaryConfigured) {
      setError(cloudinaryConfigMessage);
      return;
    }

    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) {
      return;
    }

    const filesToUpload = multiple ? droppedFiles : [droppedFiles[0]];

    for (const file of filesToUpload) {
      if (!validateFile(file)) {
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(filesToUpload[0]);

    await uploadFiles(filesToUpload);
  };

  const helperText = hasSizeLimit
    ? `PNG, JPG, GIF up to ${maxSizeMB}MB${multiple ? ' each' : ''}`
    : `PNG, JPG, GIF${multiple ? ' (multiple files allowed)' : ''}`;

  return (
    <div className="image-uploader">
      <div
        className={`uploader-zone ${!isCloudinaryConfigured ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!isCloudinaryConfigured) {
            setError(cloudinaryConfigMessage);
            return;
          }

          fileInputRef.current?.click();
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: 'none' }}
        />

        {previewUrl && !uploading && !error && success && (
          <div className="uploader-success">
            <CheckCircle size={48} color="#10b981" />
            <p>{multiple ? 'Images uploaded successfully!' : 'Image uploaded successfully!'}</p>
          </div>
        )}

        {previewUrl && !uploading && !error && !success && (
          <div className="uploader-preview">
            <img src={previewUrl} alt="Preview" />
            <button
              className="uploader-remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleRemovePreview();
              }}
            >
              <X size={20} />
            </button>
          </div>
        )}

        {uploading && (
          <div className="uploader-loading">
            <div className="spinner"></div>
            <p>Uploading...</p>
          </div>
        )}

        {error && (
          <div className="uploader-error">
            <AlertCircle size={32} />
            <p>{error}</p>
            <small>
              {isCloudinaryConfigured
                ? 'Click to try again or drag and drop an image'
                : 'Configure Cloudinary first to enable uploads'}
            </small>
          </div>
        )}

        {!previewUrl && !uploading && !error && (
          <div className="uploader-placeholder">
            <Upload size={48} />
            <p>
              <strong>Click to upload</strong> or drag and drop
            </p>
            <small>{helperText}</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
