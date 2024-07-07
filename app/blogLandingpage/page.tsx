"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // Ensure you have firebase config set up

const BlogLandingPage = () => {
  const [categories, setCategories] = useState<string[]>(['Category 1', 'Category 2', 'Category 3', 'Category 4']);
  const [landingPageHTML, setLandingPageHTML] = useState<string>('');
  const [viewCode, setViewCode] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/Signin');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleInputChange = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const generateLandingPage = async () => {
    const response = await fetch('/api/blogLandingpage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categories }),
    });

    const data = await response.json();
    setLandingPageHTML(data.landingPageCode);
  };

  return (
    <div>
      <Head>
        <title>Generate Blog Landing Page</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Blog Landing Page Generator</h1>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Categories:</label>
          {categories.map((category, index) => (
            <input
              key={index}
              type="text"
              value={category}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="border p-2 rounded mb-2 w-full"
              placeholder={`Category ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={generateLandingPage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Generate Landing Page
        </button>
        {landingPageHTML && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Generated Landing Page:</h2>
            <button
              onClick={() => setViewCode(!viewCode)}
              className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
            >
              {viewCode ? 'View Page' : 'View Code'}
            </button>
            {viewCode ? (
              <textarea
                readOnly
                value={landingPageHTML}
                className="w-full h-96 border p-2 rounded"
              />
            ) : (
              <iframe
                srcDoc={landingPageHTML}
                className="w-full h-96 border"
              ></iframe>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogLandingPage;
