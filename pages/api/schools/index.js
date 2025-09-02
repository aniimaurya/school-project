import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../../../lib/db';

// Ensure upload directory exists
const uploadDir = './public/schoolImages';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // limit file size to 5MB
});

const handler = nextConnect({
  onError(error, req, res) {
    console.error('API Route Error:', error);
    res.status(501).json({ error: `Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// Middleware to handle multipart/form-data
handler.use(upload.single('image'));

handler.post(async (req, res) => {
  try {
    console.log('Received POST req.body:', req.body);
    console.log('Received file:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const { name, address, city, state, contact, email_id } = req.body;

    if (!name || !address || !city || !state || !contact || !email_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const image = `/schoolImages/${req.file.filename}`;

    const [result] = await pool.query(
      `INSERT INTO schools (name, address, city, state, contact, image, email_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, address, city, state, contact, image, email_id]
    );

    res.status(201).json({ message: 'School added successfully', id: result.insertId });
  } catch (error) {
    console.error('POST /api/schools error:', error);
    res.status(500).json({ error: error.message });
  }
});

handler.get(async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, address, city, image FROM schools');
    res.status(200).json(rows);
  } catch (error) {
    console.error('GET /api/schools error:', error);
    res.status(500).json({ error: error.message });
  }
});

export const config = {
  api: { bodyParser: false }, // Multer handles it
};

export default handler;
