import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
  origin: ['https://jeim-music.vercel.app'],
  credentials: true,
  
}));

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;

app.get('/youtube/stats', async (req, res) => {
  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({ error: 'Canal no encontrado o sin estadísticas públicas' });
    }

    const stats = data.items[0].statistics;

    res.json({
      subscribers: stats.subscriberCount,
      views: stats.viewCount,
      videos: stats.videoCount
    });
  } catch (error) {
    console.error('Error al consultar la API de YouTube:', error);
    res.status(500).json({ error: 'Error al obtener datos de YouTube' });
  }
});

app.get('/youtube/video/:id', async (req, res) => {
    const videoId = req.params.id;
  
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
  
      if (!data.items || data.items.length === 0) {
        return res.status(404).json({ error: 'Video no encontrado' });
      }
  
      const stats = data.items[0].statistics;
  
      res.json({
        views: stats.viewCount,
        likes: stats.likeCount,
        comments: stats.commentCount
      });
    } catch (error) {
      console.error('Error al obtener datos del video:', error);
      res.status(500).json({ error: 'Error al consultar el video en YouTube' });
    }
  });
  

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
