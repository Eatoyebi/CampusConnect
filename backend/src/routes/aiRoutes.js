import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { campusKnowledge } from "../ai/campusKnowledge.js";

const router = express.Router();

function buildRolePrompt(role) {
  if (role === "student") {
    return `
You are helping a Student user.
Tone: friendly, clear, supportive.
Focus on: submitting maintenance requests, reading announcements, profile basics, and navigation.
`;
  }

  if (role === "ra") {
    return `
You are helping an RA user (Resident Assistant).
Tone: professional but friendly.
Focus on: creating announcements and guiding residents to the right pages.
`;
  }

  if (role === "admin") {
    return `
You are helping an Admin user.
Tone: concise, structured, operational.
Focus on: admin-only features like Admin User Lookup, announcements, and system navigation.
`;
  }

  return `
You are helping a CampusConnect user.
Tone: helpful and clear.
`;
}

router.post("/chat", async (req, res) => {
  try {
    const { message, role } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash"
    });

    const rolePrompt = buildRolePrompt(role);

    const fullPrompt = `
${campusKnowledge}

${rolePrompt}

User Question:
${message}
`.trim();

    const result = await model.generateContent(fullPrompt);
    const reply = result.response.text();

    return res.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err);
    return res.status(500).json({
      error: "AI chat failed",
      details: err?.message || String(err),
      name: err?.name
    });
  }
});

export default router;