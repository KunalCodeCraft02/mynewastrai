const express = require("express");
const router = express.Router();
const { model } = require("../config/gemini");

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

module.exports = router;
