import { NextApiRequest, NextApiResponse } from 'next';
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens:  100000,
  responseMimeType: 'text/plain',
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { categories } = req.body;

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            { text: `write the complete code to generate a landing page of an ecommerce website having the Navbar at the top with the logo, search Bar and LogIn option and then a subNavbar which contains names of 4 categories: ${categories.join(', ')} and then a banner containing an image and finally below that there are 4 category cards containing a category image in each card with the category name, use HTML, tailwind CSS and Javascript and write the complete code.` },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage('');
    res.status(200).json({ html: result.response.text() });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
