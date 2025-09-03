import nextConnect from 'next-connect';
import { v2 as cloudinary } from 'cloudinary';
import multiparty from 'multiparty';
import pool from '../../../lib/db';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Disable built-in bodyParser to use multiparty
  },
};

const handler = nextConnect({
  onError(error, req, res) {
    console.error('API Route Error:', error);
    res.status(501).json({ error: `Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

handler.post(async (req, res) => {
  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Failed to parse form data' });
    }

    try {
      // Extract text fields from parsed fields object
      const name = fields.name && fields.name[0];
      const address = fields.address && fields.address[0];
      const city = fields.city && fields.city[0];
      const state = fields.state && fields.state[0];
      const contact = fields.contact && fields.contact[0];
      const email_id = fields.email_id && fields.email_id[0];

      if (!name || !address || !city || !state || !contact || !email_id) {
        return res.status(400).json({ error: 'All fields except image are required' });
      }

      // Upload image file if provided
      let imageUrl = '';
      if (files.image && files.image[0]) {
        const uploadResult = await cloudinary.uploader.upload(files.image[0].path, {
          folder: 'school-images',
        });
        imageUrl = uploadResult.secure_url;
      }

      // Insert into DB
      const [result] = await pool.query(
        `INSERT INTO schools (name, address, city, state, contact, image, email_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, address, city, state, contact, imageUrl, email_id]
      );

      res.status(201).json({ message: 'School added successfully', id: result.insertId });
    } catch (error) {
      console.error('POST /api/schools error:', error);
      res.status(500).json({ error: error.message });
    }
  });
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

export default handler;
