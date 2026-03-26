import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CLOUD_NAME = 'daufhafae';
const UPLOAD_PRESET = 'CIT_WEBSITE';
const FOLDER = 'cit_website/research_projects';

const imagesToUpload = [
  {
    name: 'ResiLinked',
    path: './public/research_projects_images/ResiLinked.jpg',
  },
  {
    name: 'SoilScope',
    path: './public/research_projects_images/SoilScope.jpg',
  },
  {
    name: 'UA Clinic System',
    path: './public/research_projects_images/UAClinicSystem.jpg',
  },
];

async function uploadImage(filePath, fileName) {
  try {
    const absolutePath = path.join(__dirname, filePath);
    const fileBuffer = fs.readFileSync(absolutePath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('file', blob, path.basename(filePath));
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', FOLDER);
    formData.append('public_id', fileName);

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Upload failed: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      name: fileName,
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error(`Error uploading ${fileName}:`, error.message);
    throw error;
  }
}

async function uploadAllImages() {
  console.log('Starting upload to Cloudinary...\n');
  const results = [];

  for (const image of imagesToUpload) {
    try {
      console.log(`Uploading ${image.name}...`);
      const result = await uploadImage(image.path, image.name);
      results.push(result);
      console.log(`✓ Successfully uploaded ${image.name}`);
      console.log(`  URL: ${result.url}\n`);
    } catch (error) {
      console.error(`✗ Failed to upload ${image.name}\n`);
    }
  }

  console.log('\n=== Upload Summary ===');
  console.log(JSON.stringify(results, null, 2));

  // Generate code snippet for updating HallOfFame.tsx
  if (results.length > 0) {
    console.log('\n=== Update HallOfFame.tsx with these URLs ===');
    results.forEach((result) => {
      console.log(`// ${result.name}`);
      console.log(`image: '${result.url}'`);
    });
  }
}

uploadAllImages().catch(console.error);
