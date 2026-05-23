const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const memory = {};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

    const lowerMessage =
      userMessage.toLowerCase();

    // Save user's name
    if (lowerMessage.includes("my name is")) {

      const name =
        userMessage.substring(
          lowerMessage.indexOf("my name is") + 10
        ).trim();

      if (name) {

        memory.name =
          name.replace(/[^\w\s]/gi, "");

      }

    }

    // Recall user's name
    if (
      lowerMessage.includes("what's my name") ||
      lowerMessage.includes("what is my name")
    ) {

      if (memory.name) {

        return res.json({
          reply: `Your name is ${memory.name} 😄`
        });

      } else {

        return res.json({
          reply:
            "You haven't told me your name yet 😅"
        });

      }

    }

    let memoryPrompt = "";

    if (memory.name) {

      memoryPrompt =
        `The user's name is ${memory.name}. Remember it and use it naturally sometimes.`;

    }

    const response = await axios.post(

      "https://openrouter.ai/api/v1/chat/completions",

      {
        model: "meta-llama/llama-3.1-8b-instruct",

        messages: [

          {
            role: "system",

            content:
              `You are VOH AI, a smart, modern and friendly AI assistant created by VOICEOFHARRISON. You speak in a cool, conversational and confident way. Keep responses engaging, natural and human-like. Avoid sounding robotic or too formal. You can use emojis naturally sometimes. ${memoryPrompt}`
          },

          {
            role: "user",
            content: userMessage
          }

        ]
      },

      {
        headers: {

          "Authorization":
            `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type": "application/json",

          "HTTP-Referer": "http://localhost",

          "X-Title": "VOH AI"

        }
      }

    );

    const reply =
      response.data.choices[0].message.content;

    res.json({
      reply: reply
    });

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.json({
      reply: "Something went wrong 😕"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`VOH AI running on port ${PORT}`);
});
