import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route to upload PDF
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No PDF uploaded");
    }

    // Parse PDF text
    const pdfBuffer = req.file;
    const dataBuffer = await pdfParse(pdfBuffer);
    const pdfText = dataBuffer.text;

    // Send prompt to AI
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a question generator.",
        },
        {
          role: "user",
          content: `Make some questions from this PDF text:\n\n${pdfText}`,
        },
      ],
    });

    res.json({
      questions: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});
