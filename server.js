import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({
  model: "gemini-3-flash-preview"
});

app.use(express.json());
app.use(express.static("public"));

app.get("/models", async (req, res) => {
  try {
    const models = genAI.model;
    res.json({ output: models });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list models" });
  }
});

app.post("/summarize", async (req, res) => {
  try {
    const { article } = req.body;

    if (!article) {
      return res.status(400).json({ error: "Article text is required" });
    }
    const prompt = `
    Summarize the following article into EXACTLY 3 concise bullet points:
    \n${article}
    `;

    const result = await genAI.generateContent({
      contents: [
        {
          parts: [
            {text: prompt}
          ]
        }
      ]
    });

    const summary = result.response.text();

    res.status(200).json({
      output: summary
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to summarize content" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});