import React, { useState } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import pdfToText from 'react-pdftotext';

function PDFParserReact() {
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [resumeText, setResumeText] = useState(''); // State to store the resume text

  // Function to send extracted text to Gemini AI for feedback generation
  const generateFeedback = async (content) => {
    setLoading(true);

    const MODEL_NAME = 'gemini-pro';
    const API_KEY = 'AIzaSyBrFLwWvr-WPscoHu7O-shXHSIZnlP4FNs'; // Replace with your actual API key

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Define input context for the AI (e.g., resume analysis instructions)
    const context = `
      You are an AI resume reviewer. Please analyze the following resume and provide feedback. Focus on the following aspects:
      1. Structure and readability
      2. Key skills and qualifications
      3. Relevance and clarity of work experience
      4. Overall presentation and professionalism
      5. Any areas for improvement or potential omissions

      **DO NOT INCLUDE ORIGINAL RESUME IN YOUR RESPONSE**
    `;

    const generationConfig = {
      temperature: 0.7,
      topK: 10,
      topP: 0.9,
      maxOutputTokens: 1024,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    try {
      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: context }] },  // Use 'user' role for context
          { role: 'user', parts: [{ text: content }] },  // User's resume content
        ],
        generationConfig,
        safetySettings,
      });

      const response = result.response.text();

      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: response, // Only save and display the AI feedback
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle PDF file upload and extract text
  const extractText = (event) => {
    const file = event.target.files[0];

    if (file) {
      pdfToText(file)
        .then((text) => {
          setResumeText(text); // Set extracted text as preview
          generateFeedback(text); // Send the extracted text to AI for feedback
        })
        .catch((error) => {
          console.error('Failed to extract text from pdf:', error);
          alert('An error occurred while extracting the text.');
        });
    }
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
      <div style={{ flex: 1, marginRight: '20px' }}>
        <header className="App-header">
          <h1>Upload Your Resume for AI Feedback</h1>
          <input
            type="file"
            accept="application/pdf"
            onChange={extractText}
            className="file-input"
          />
        </header>

        {loading && (
          <div className="loading-indicator">
            <p>Loading...</p>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <h2>Resume Keyword Preview</h2>
          <textarea
            className='bg-slate-100 rounded-2xl  hover:shadow-lg'
            value={resumeText}
            readOnly
            rows={15}
            style={{
              width: '100%',
              height: '300px',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontFamily: 'Arial, sans-serif',
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {chatHistory.length > 0 && (
          <div className="chat-history bg-indigo-100 rounded-2xl p-6">
            <h2 className="text-xl text-indigo-900 font-bold mb-4">AI Feedback</h2>
            {chatHistory.map((chatItem) => (
              <div
                key={chatItem.id}
                className={`chat-item ${chatItem.role === 'bot' ? 'chat-start' : 'chat-end'}`}
                style={{ marginBottom: '15px' }}
              >
                <div className="chat-text text-indigo-800" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {chatItem.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PDFParserReact;
