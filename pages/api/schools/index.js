import nextConnect from 'next-connect';
import pool from '../../../lib/db';

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
  try {
    const { name, address, city, state, contact, email_id } = req.body;

    if (!name || !address || !city || !state || !contact || !email_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const image = ''; // Image upload disabled for now

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
  api: { bodyParser: true } // Enable body parser for JSON since multer removed
};

export default handler;
