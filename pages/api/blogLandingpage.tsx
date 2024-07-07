import { NextApiRequest, NextApiResponse } from 'next';
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { categories } = req.body;
    const categoryList = categories.join(', ');

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            { text: `Generate the complete code using HTML, Tailwind CSS, and JavaScript for the Landing page of a blog website which consists of the following categories: ${categoryList}. The page should have a Navbar at the top with a logo, search bar, and login button. Below that, a sub-navbar with the given categories, a banner, and four category cards each with an image and the category name.` },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage('INSERT_INPUT_HERE');
    res.status(200).json({ landingPageCode: result.response.text() });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
