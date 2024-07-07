"use client";
import { useState } from 'react';
import Head from 'next/head';

interface Question {
  question: string;
  choices: string[];
  correct: string;
}

const GenerateTestPage = () => {
  const [topic, setTopic] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);

  const fetchQuestions = async () => {
    const response = await fetch('/api/generateTest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });

    const data = await response.json();
    const parsedQuestions = parseQuestions(data.questions);
    setQuestions(parsedQuestions);
    setAnswers(new Array(parsedQuestions.length).fill(''));
  };

  const parseQuestions = (questionsText: string): Question[] => {
    const lines: string[] = questionsText.split('\n').filter((line: string) => line.trim() !== '');
    const questions: Question[] = [];
    let currentQuestion: Question = { question: '', choices: [], correct: '' };

    lines.forEach((line: string) => {
      if (line.startsWith('**')) {
        if (currentQuestion.question !== '') {
          questions.push(currentQuestion);
        }
        currentQuestion = { question: line.replace('**', '').trim(), choices: [], correct: '' };
      } else if (line.match(/^[abcd]\)/)) {
        currentQuestion.choices.push(line.trim());
      } else if (line.startsWith('Answer Key:')) {
        const correctAnswers = line.replace('Answer Key:', '').trim().split('\n');
        correctAnswers.forEach((answer: string) => {
          const [index, correct] = answer.split(' ');
          questions[parseInt(index) - 1].correct = correct.split(')')[0];
        });
      }
    });
    if (currentQuestion.question !== '') {
      questions.push(currentQuestion);
    }
    return questions;
  };

  const handleAnswerChange = (questionIndex: number, choice: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = choice;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach((question, index) => {
      if (answers[index].startsWith(question.correct)) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
  };

  return (
    <div>
      <Head>
        <title>Generate Test</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Generate Test</h1>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border p-2 rounded mb-2 w-full"
          />
          <button
            onClick={fetchQuestions}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Generate Questions
          </button>
        </div>
        {questions.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Questions:</h2>
            {questions.map((question, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <h3 className="font-bold">{question.question}</h3>
                {question.choices.map((choice, choiceIndex) => (
                  <label key={choiceIndex} className="block">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={choice}
                      checked={answers[index] === choice}
                      onChange={() => handleAnswerChange(index, choice)}
                      className="mr-2"
                    />
                    {choice}
                  </label>
                ))}
              </div>
            ))}
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Submit Test
            </button>
            {score !== null && (
              <div className="mt-4">
                <h2 className="text-xl font-bold mb-2">Score:</h2>
                <p>You scored {score} out of {questions.length}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateTestPage;
