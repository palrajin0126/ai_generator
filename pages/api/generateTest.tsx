import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prismaClient';
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 100000,
  responseMimeType: "text/plain",
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { topic } = req.body;
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              { text: `Generate a set of 10 questions in MCQ format each having 4 choices out of which one of them is correct based on the topic: ${topic}. The questions should be of the standard of graduation level.` },
            ],
          },
        ],
      });

      const result = await chatSession.sendMessage("Start");
      const responseText = result.response.text();

      res.status(200).json({ questions: responseText });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};