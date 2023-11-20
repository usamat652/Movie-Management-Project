import express from 'express'
import OpenAI from 'openai';
import mongoose from 'mongoose';
import { config } from "dotenv";
import "../src/config/connectDb.js";

config();

const port = process.env.PORT;
const app = express();
app.use(express.json());

const promptSchema = new mongoose.Schema({
  prompt: String,
  response: String,
});

const promptModel = mongoose.model('promptModel', promptSchema);

const openai = new OpenAI({
  apiKey: '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',
});

// Express route to handle OpenAI requests
app.post('/generate-response', async (req, res) => {
  try {
    const { prompt } = req.body;
    const savedpromptModel = await promptModel.create({ prompt });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const generatedResponse = response.choices[0].message.content;

    if (savedpromptModel) {
      savedpromptModel.response = generatedResponse;
      await savedpromptModel.save();
    }

    res.json({ response: generatedResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// import express from 'express';
// import axios from 'axios';
// import mongoose from 'mongoose';
// import { config } from 'dotenv';
// import './src/config/connectDb.js';

// config();

// const port = process.env.PORT;
// const app = express();
// app.use(express.json());

// const promptSchema = new mongoose.Schema({
//   prompt: String,
//   response: String,
// });

// const promptModel = mongoose.model('promptModel', promptSchema);

// const OPENAI_API_KEY = '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';
// const GPT_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

// // Express route to handle OpenAI requests using Axios
// app.post('/generate-response', async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     const savedPromptModel = await promptModel.create({ prompt });

//     const response = await axios.post(
//       GPT_ENDPOINT,
//       {
//         model:'gpt-3.5-turbo',
//         prompt: prompt,
//         max_tokens: 1150, // You can adjust this based on your requirements
//         n: 1,
//         stop: ['\n'],
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${OPENAI_API_KEY}`,
//         },
//       }
//     );

//     const generatedResponse = response.data.choices[0].text.trim();

//     if (savedPromptModel) {
//       savedPromptModel.response = generatedResponse;
//       await savedPromptModel.save();
//     }

//     res.json({ response: generatedResponse });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

//upper code gives an error about url passing in axios


