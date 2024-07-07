// pages/api/questions.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prismaClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { questions } = req.body;

    try {
      // Create questions and choices
      for (const q of questions) {
        const createdQuestion = await prisma.question.create({
          data: {
            question: q.question,
            correct: q.correct,
            topic: q.topic,
          },
        });

        await prisma.choice.createMany({
          data: q.choices.map((choice: string) => ({
            questionId: createdQuestion.id,
            choice,
          })),
        });
      }

      res.status(201).json({ message: 'Questions and choices created successfully' });
    } catch (error) {
      console.error('Error creating questions:', error);
      res.status(500).json({ message: 'Error creating questions' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
