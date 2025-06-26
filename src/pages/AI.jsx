import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const InterviewPrepModal = ({ application, onClose }) => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const generateResponse = async () => {
    setLoading(true);

    const MODEL_NAME = "gemini-1.5-pro";
    const API_KEY = "AIzaSyBrFLwWvr-WPscoHu7O-shXHSIZnlP4FNs"; // Replace with your actual API key

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const parts = [
      { text: "As an AI developed specifically to assist students in preparing for job interviews, my primary function is to provide accurate and relevant interview preparation questions based on the job role you have applied for. Please select a job application to begin." },
      { text: `Job Title: ${application.postingDetail.title}\nJob Description: ${application.postingDetail.description}` },
      { text: userInput }
    ];

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
      });

      const response = result.response;
      const generatedText = response.text()
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Wrap text between double asterisks with <strong> tags

      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          id: Date.now(),
          role: 'user',
          time: getCurrentTime(),
          text: userInput,
        },
        {
          id: Date.now() + 1,
          role: 'bot',
          time: getCurrentTime(),
          text: generatedText.replace(/\n/g, "<br>"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return `${hours}:${minutes}`;
  };

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
  <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto relative border border-slate-200 transition-all duration-300 ease-in-out">
    
    {/* Close Button */}
    <button
      onClick={onClose}
      className="absolute top-5 right-5 text-slate-600 hover:text-red-500 hover:bg-red-100 rounded-full p-2 transition-colors"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    {/* Title */}
    <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
      Interview Prep: {application.postingDetail.title}
    </h2>

    {/* Input */}
    <div className="relative mb-6">
      <input
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        type="text"
        className="pl-5 pr-12 py-3 w-full border border-gray-200 rounded-full shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Ask anything about the interview..."
      />
      <button
        onClick={generateResponse}
        type="button"
        disabled={loading}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white w-9 h-9 rounded-full flex items-center justify-center shadow transition-all disabled:opacity-50"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>

    {/* Loading Skeleton */}
    {loading && (
      <div className="animate-pulse space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-48"></div>
        <div className="h-3 bg-gray-200 rounded w-full max-w-sm"></div>
        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
      </div>
    )}

    {/* Chat History */}
    {chatHistory.length > 0 && (
      <div className="space-y-6 mt-4 overflow-y-auto max-h-[55vh] pr-2">
        {chatHistory.map((chatItem) => (
          <div
            key={chatItem.id}
            className={`flex items-start gap-3 ${chatItem.role === "bot" ? "justify-start" : "justify-end"}`}
          >
            {chatItem.role === "bot" && (
              <img
                className="w-8 h-8 rounded-full bg-slate-100"
                src="https://img.freepik.com/premium-photo/3d-style-chat-bot-robot-ai-app-icon-isolated-color-background-generative-ai_159242-25913.jpg"
                alt="Bot Avatar"
              />
            )}
            <div className="max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed shadow-md transition-colors bg-slate-100 border">
              <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: chatItem.text }} />
              <div className="mt-1 text-xs text-gray-400 text-right">{chatItem.time}</div>
            </div>
            {chatItem.role !== "bot" && (
              <img
                className="w-8 h-8 rounded-full bg-slate-100"
                src="https://cdn1.iconfinder.com/data/icons/facely-metapeople-3d-avatar-set/512/17._Designer.png"
                alt="User Avatar"
              />
            )}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  );
};

export default InterviewPrepModal;
