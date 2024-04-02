// Paulius Malcius -> pam226

// Found this on youtube --> https://www.youtube.com/watch?v=IooIXYf0PIo

// You can start server by either doing node app.mjs or npm run start since I added that to the package.json

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database(path.join(__dirname, 'top40.db'));
const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/artists', (req, res) => {
  const stmt = db.prepare('SELECT DISTINCT artist FROM songlist ORDER BY artist');
  const artists = stmt.all();
  res.json(artists);
});

app.get('/songs', (req, res) => {
  const { artist = '', keyword = '', limit = '10', offset = '0' } = req.query;
  let query = 'SELECT * FROM songlist WHERE 1=1';
  let totalQuery = 'SELECT COUNT(*) AS total FROM songlist WHERE 1=1';
  const params = [];

  if (artist) {
    query += ' AND artist = ?';
    totalQuery += ' AND artist = ?';
    params.push(artist);
  }

  if (keyword) {
    query += ' AND title LIKE ?';
    totalQuery += ' AND title LIKE ?';
    params.push(`%${keyword}%`);
  }

  query += ' LIMIT ? OFFSET ?';
  const total = db.prepare(totalQuery).get(...params).total;
  const songs = db.prepare(query).all(...[...params, parseInt(limit), parseInt(offset)]);

  res.json({ songs, total });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
