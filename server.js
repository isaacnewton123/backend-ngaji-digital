const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['https://ngajidigital.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Check if API key is available
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
  console.warn('\x1b[33m%s\x1b[0m', 'WARNING: Gemini API key is not set or is using the placeholder value. Set it in the .env file.');
}

// Load the Kitab content directly
function loadKitabContent() {
  try {
    const kitabPath = path.join(__dirname, 'Kitab-Mukhtashor Jiddan Syarah.md');
    const content = fs.readFileSync(kitabPath, 'utf8');
    return content;
  } catch (error) {
    console.error('Error loading Kitab content:', error);
    return "Error loading Kitab content. Please check the file path.";
  }
}

const kitabContent = loadKitabContent();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.2,
    topP: 0.8,
    topK: 40
  }
});

// Simple in-memory sessions to track conversation state
const sessions = new Map();

// Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId = Date.now().toString() } = req.body;
    
    console.log("Received message:", message);
    console.log("Session ID:", sessionId);
    console.log("Using API KEY:", process.env.GEMINI_API_KEY ? "Key exists (hidden)" : "No API key");
    
    // Check if this is the first message in this session
    const isFirstMessage = !sessions.has(sessionId);
    
    // Store or update the session
    sessions.set(sessionId, {
      lastInteraction: Date.now(),
      messageCount: sessions.has(sessionId) ? sessions.get(sessionId).messageCount + 1 : 1
    });
    
    // Clean up old sessions (older than 30 minutes)
    const thirtyMinutes = 30 * 60 * 1000;
    for (const [sid, session] of sessions.entries()) {
      if (Date.now() - session.lastInteraction > thirtyMinutes) {
        sessions.delete(sid);
      }
    }
    
    // Create a prompt that instructs Gemini to ONLY use the Kitab content and respond in Indonesian
    // Add instructions to start with Assalamualaikum if it's the first message
    const prompt = `
    Anda adalah asisten AI tata bahasa Arab (Nahwu) yang KHUSUS menggunakan teks berikut sebagai sumber pengetahuan Anda.
    Anda HARUS SELALU menjawab dalam Bahasa Indonesia yang baik dan benar.
    Anda TIDAK boleh menggunakan informasi di luar sumber ini. Jika Anda tidak dapat menjawab berdasarkan sumber ini, katakan saja.
    
    ${isFirstMessage ? 'PENTING: Karena ini adalah pesan pertama dari pengguna, SELALU mulai respons Anda dengan "اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَا تُهُ" diikuti dengan perkenalan singkat sebelum menjawab pertanyaan.' : ''}
    
    SUMBER PENGETAHUAN:
    ${kitabContent}
    
    PERTANYAAN PENGGUNA:
    "${message}"
    
    Berdasarkan HANYA pada sumber pengetahuan di atas, silakan:
    1. ${isFirstMessage ? 'Mulai dengan salam "Assalamualaikum warahmatullahi wabarakatuh" dan perkenalan singkat' : 'Analisis pertanyaan'} dan berikan informasi yang relevan dari sumber pengetahuan
    2. Jika ini adalah frasa/kalimat bahasa Arab, berikan analisis gramatikal (i'rab) menggunakan HANYA konsep yang ditemukan dalam sumber pengetahuan
    3. Jika ini adalah pertanyaan tentang konsep Nahwu, jelaskan menggunakan HANYA informasi dari sumber pengetahuan
    4. Jika pertanyaan tidak dapat dijawab menggunakan sumber pengetahuan, mohon nyatakan dengan sopan bahwa Anda tidak memiliki informasi tersebut
    
    Ingat: Pengetahuan Anda HANYA terbatas pada isi Kitab-Mukhtashor Jiddan Syarah.md yang diberikan di atas.
    Berikan jawaban Anda dalam format Markdown untuk memudahkan pembacaan.
    `;
    
    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      res.json({ response, sessionId });
    } catch (aiError) {
      console.error('Error with Gemini API call:', aiError);
      
      // Check if the error is related to available models
      if (aiError.message && aiError.message.includes('not found for API version')) {
        // Try multiple fallback models in sequence
        const fallbackModels = ['gemini-1.5-pro', 'gemini-1.0-pro'];
        let fallbackSucceeded = false;
        
        for (const modelName of fallbackModels) {
          try {
            console.log(`Attempting with fallback model: ${modelName}`);
            const alternativeModel = genAI.getGenerativeModel({ model: modelName });
            const altResult = await alternativeModel.generateContent(prompt);
            const altResponse = altResult.response.text();
            res.json({ response: altResponse });
            fallbackSucceeded = true;
            break;
          } catch (fbError) {
            console.error(`Fallback model ${modelName} failed:`, fbError);
            continue;
          }
        }
        
        if (!fallbackSucceeded) {
          throw new Error('Semua model alternatif gagal');
        }
      } else {
        throw aiError;
      }
    }
  } catch (error) {
    console.error('Error with AI request:', error);
    res.status(500).json({ 
      error: 'Failed to process request', 
      message: 'Terjadi kesalahan pada server. Silakan periksa konfigurasi API Gemini atau coba lagi nanti.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const apiKeyStatus = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here" 
    ? "configured" 
    : "missing";
  
  res.json({ 
    status: 'ok', 
    kitabLoaded: !!kitabContent,
    apiKeyStatus: apiKeyStatus,
    modelConfig: {
      primaryModel: 'gemini-2.0-flash',
      fallbackModels: ['gemini-1.5-pro', 'gemini-1.0-pro'],
      responseLanguage: 'Bahasa Indonesia',
      markdownSupport: true
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Kitab content loaded: ${kitabContent ? 'Yes' : 'No'}`);
}); 