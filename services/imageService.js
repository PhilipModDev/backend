/**
 * Renovate AI Image Generation Service
 */

const RENOVATE_API_URL = 'https://api.tech.renovateai.app/public/v1/renovate';
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

/**
 * Upload image to imgbb and return public URL
 */
async function uploadImage(imageBuffer) {
  if (!process.env.IMGBB_API_KEY) {
    throw new Error('IMGBB_API_KEY is not set in .env');
  }

  const formData = new URLSearchParams();
  formData.append('key', process.env.IMGBB_API_KEY);
  formData.append('image', imageBuffer.toString('base64'));

  const response = await fetch(IMGBB_API_URL, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!data.success) {
    console.error('imgbb error:', data);
    throw new Error(data.error?.message || 'Failed to upload image');
  }

  return data.data.url;
}

/**
 * Download image from URL and convert to base64
 */
async function downloadAsBase64(imageUrl) {
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:image/jpeg;base64,${base64}`;
}

/**
 * Generate a renovated design using Renovate AI
 */
export async function generateDesignImage(imageBuffer, prompt) {
  const imageUrl = await uploadImage(imageBuffer);

  
  console.log('Starting image generation');
  const response = await fetch(RENOVATE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.RENOVATE_API_KEY
    },
    body: JSON.stringify({
      image_url: imageUrl,
      guidance: prompt,
      renovation_spectrum: 'tweak'
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Renovate AI request failed');
  }
  console.log('Finish generating image');
  const resultUrl = data.renovated_image_url;
  
  if (!resultUrl) {
    throw new Error('No image URL in Renovate AI response');
  }
  const base64Image = await downloadAsBase64(resultUrl);

  return {
    success: true,
    image: base64Image,
    prompt: prompt,
    processedAt: new Date().toISOString()
  };
}
