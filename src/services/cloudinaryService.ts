// Cloudinary service for image upload and management

export interface CloudinaryUploadResponse {
  public_id: string;
  url: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

const isPlaceholderValue = (value: string | undefined): boolean => {
  if (!value) return true;
  const normalized = value.trim().toLowerCase();
  return normalized.length === 0 || normalized.includes('your_');
};

export const cloudinaryService = {
  isConfigured(): boolean {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    return !isPlaceholderValue(cloudName) && !isPlaceholderValue(uploadPreset);
  },

  // Upload image to Cloudinary
  async uploadImage(file: File, folder: string = 'cit_website'): Promise<CloudinaryUploadResponse> {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!this.isConfigured() || !cloudName || !uploadPreset) {
      throw new Error(
        'Image upload is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env, then restart the app.'
      );
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    try {
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Cloudinary upload failed');
      }

      return data;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  },

  // Delete image from Cloudinary
  async deleteImage(publicId: string): Promise<void> {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
    const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn('Cloudinary API credentials not configured for deletion');
      return;
    }

    // Note: This should ideally be done from your backend to keep API secret safe
    // For now, you may need to handle deletion through a cloud function
    console.info(`Image deletion for ${publicId} should be handled by backend`);
  },

  // Get optimized image URL
  getOptimizedUrl(
    secureUrl: string,
    options: {
      width?: number;
      height?: number;
      quality?: 'auto' | number;
      crop?: 'fill' | 'fit' | 'scale';
    } = {}
  ): string {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      return secureUrl;
    }

    // Build Cloudinary transformation URL
    const transformations: string[] = [];

    if (options.width || options.height) {
      const w = options.width ? `w_${options.width}` : '';
      const h = options.height ? `h_${options.height}` : '';
      const crop = `c_${options.crop || 'fill'}`;
      transformations.push([w, h, crop].filter(Boolean).join(','));
    }

    if (options.quality) {
      transformations.push(`q_${options.quality}`);
    }

    if (transformations.length === 0) {
      return secureUrl;
    }

    // Insert transformations into URL
    const parts = secureUrl.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/${transformations.join('/')},${parts[1]}`;
    }

    return secureUrl;
  },
};
