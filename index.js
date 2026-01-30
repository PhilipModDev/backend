import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { generateDesignImage } from './services/imageService.js';

dotenv.config( { path: '.env' } );

const app = express();
const PORT = process.env.PORT || 8080;

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.use(cors());
app.use(express.json());
app.use('/temp', express.static('temp'));
app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
  res.sendFile('views/index.html', { root: '.' });
});

// Image generation endpoint
app.post('/api/generate-design', upload.single('image'), async (req, res) => {
  try {
    console.log('Generating design...');

    const { prompt } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ error: 'No image provided' });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }

    // Call the image generation service
    const result = await generateDesignImage(imageFile, prompt);
    console.log('Design generated:', prompt);

    res.json(result);
  } catch (error) {
    console.error('Error generating design:', error);
    res.status(500).json({ error: 'Failed to generate design' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
