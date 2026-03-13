require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

connectToMongo();

const app = express();
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// AI Description Generator Route
app.post('/generate-description', async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "user", content: `Write a short, clear description (10 lines) for a note titled "${title}".` }
      ],
      max_tokens: 120,
      temperature: 0.8,
    });

    res.json({
      description: response.choices[0].message.content,
    });

  } catch (error) {
    console.error('Groq Error:', error);
    res.status(500).json({ error: 'Failed to generate description' });
  }
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

module.exports = app;
