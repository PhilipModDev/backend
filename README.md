# Brickyard Backend API

Simple backend server for image generation API integration.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the backend directory:
   ```
   PORT=8080
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:8080`

## API Endpoints

### POST `/api/generate-design`

Generate a design from an image and text prompt.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `image` (file): The backyard image
  - `prompt` (text): Description of desired design

**Response:**
```json
{
  "success": true,
  "image": "data:image/jpeg;base64,...",
  "prompt": "Make the patio larger",
  "processedAt": "2025-11-25T12:00:00.000Z"
}
```

## Testing with Frontend

1. Make sure the backend is running on port 8080
2. If testing on a physical device, update the API_BASE_URL in `brickyard-app/utils/api.js` to use your computer's IP address instead of localhost
3. The frontend will send images via multipart form data

## Mock Service

Currently using a mock service that returns the original image after a simulated delay. To integrate a real AI service:

1. Add your API key to `.env`
2. Update `services/imageService.js` to call the actual API
3. Available options: Replicate, OpenAI DALL-E, Stability AI

